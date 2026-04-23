#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
MANIFEST_PATH="${SECRETS_MIGRATION_MANIFEST:-${SCRIPT_DIR}/projects.solana-apps.json}"
VERCEL_SCOPE="${VERCEL_SCOPE:-solana-foundation}"
RUN_ID="${RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"
WORK_DIR="${ROOT_DIR}/.secrets-migration"
LOG_DIR="${WORK_DIR}/logs"
TMP_DIR="${WORK_DIR}/tmp"
LOG_FILE=""

mkdir -p "${LOG_DIR}" "${TMP_DIR}"

if [[ ! -f "${MANIFEST_PATH}" ]]; then
  echo "Missing manifest: ${MANIFEST_PATH}" >&2
  exit 1
fi

log() {
  local ts
  ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "[${ts}] $*"
  if [[ -n "${LOG_FILE}" ]]; then
    echo "[${ts}] $*" >> "${LOG_FILE}"
  fi
}

die() {
  log "ERROR: $*"
  exit 1
}

require_cmds() {
  local missing=()
  local cmd
  for cmd in "$@"; do
    if ! command -v "${cmd}" >/dev/null 2>&1; then
      missing+=("${cmd}")
    fi
  done
  if (( ${#missing[@]} > 0 )); then
    die "Missing required commands: ${missing[*]}"
  fi
}

setup_log() {
  LOG_FILE="${LOG_DIR}/redeploy-${RUN_ID}.log"
  : > "${LOG_FILE}"
}

manifest_projects() {
  if [[ -n "${PROJECT_FILTER:-}" ]]; then
    jq -c --arg project "${PROJECT_FILTER}" '
      .projects[] | select(.vercel_project == $project)
    ' "${MANIFEST_PATH}"
    return
  fi

  jq -c '.projects[]' "${MANIFEST_PATH}"
}

project_field() {
  local project_json="$1"
  local field="$2"
  jq -r "${field}" <<< "${project_json}"
}

latest_production_deployment_url() {
  local project="$1"
  vercel list "${project}" \
    --scope "${VERCEL_SCOPE}" \
    --environment production \
    --format json \
    | jq -r '.deployments[0].url'
}

redeploy_project() {
  local deployment_url="$1"
  local output
  output="$(vercel redeploy "${deployment_url}" --scope "${VERCEL_SCOPE}" --target production --no-color)"
  printf '%s\n' "${output}" >&2
  printf '%s\n' "${output}" | grep -Eo 'https://[^[:space:]]+' | tail -n 1
}

wait_for_deployment_ready() {
  local deployment_url="$1"
  local inspect_json
  inspect_json="$(vercel inspect "${deployment_url}" --scope "${VERCEL_SCOPE}" --wait --timeout 20m --format json)"

  if [[ "$(jq -r '.readyState' <<< "${inspect_json}")" != "READY" ]]; then
    die "Deployment ${deployment_url} did not reach READY"
  fi

  printf '%s\n' "${inspect_json}"
}

smoke_test_url() {
  local url="$1"
  local status
  status="$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 30 "${url}")"
  if [[ "${status}" =~ ^2[0-9][0-9]$ || "${status}" =~ ^3[0-9][0-9]$ ]]; then
    log "Smoke test passed for ${url} (${status})"
    return 0
  fi

  log "Smoke test failed for ${url} (${status})"
  return 1
}
