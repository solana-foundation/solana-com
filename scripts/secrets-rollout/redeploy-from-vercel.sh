#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/lib.sh"

require_cmds jq curl vercel
setup_log
manifest_scope="$(manifest_vercel_scope)"

mapfile -t project_rows < <(manifest_projects)
if [[ "${#project_rows[@]}" -eq 0 ]]; then
  die "No projects matched PROJECT_FILTER=${PROJECT_FILTER:-<unset>}"
fi

for project_json in "${project_rows[@]}"; do
  vercel_project="$(project_field "${project_json}" '.vercel_project')"
  vercel_scope="$(project_field "${project_json}" '.vercel_scope // empty')"
  if [[ -z "${vercel_scope}" || "${vercel_scope}" == "null" ]]; then
    vercel_scope="${VERCEL_SCOPE:-${manifest_scope}}"
  fi

  log "Redeploying ${vercel_project} in Vercel scope ${vercel_scope}"

  latest_url="$(latest_production_deployment_url "${vercel_project}" "${vercel_scope}")"
  if [[ -z "${latest_url}" || "${latest_url}" == "null" ]]; then
    die "Could not determine latest production deployment for ${vercel_project}"
  fi

  redeploy_url="$(redeploy_project "https://${latest_url}" "${vercel_scope}")"
  if [[ -z "${redeploy_url}" ]]; then
    die "Vercel did not return a redeploy URL for ${vercel_project}"
  fi

  log "Waiting for ${redeploy_url}"
  wait_for_deployment_ready "${redeploy_url}" "${vercel_scope}" > "${TMP_DIR}/${vercel_project}-inspect.json"

  mapfile -t smoke_urls < <(jq -r '.smoke_urls[]?' <<< "${project_json}")
  if [[ "${#smoke_urls[@]}" -eq 0 ]]; then
    die "No smoke URLs configured for ${vercel_project}"
  fi

  passed=0
  for smoke_url in "${smoke_urls[@]}"; do
    if smoke_test_url "${smoke_url}"; then
      passed=1
      break
    fi
  done

  if [[ "${passed}" -ne 1 ]]; then
    die "All smoke URLs failed for ${vercel_project}"
  fi
done
