#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/lib.sh"

require_cmds jq curl vercel
setup_log

mapfile -t project_rows < <(manifest_projects)
if [[ "${#project_rows[@]}" -eq 0 ]]; then
  die "No projects matched PROJECT_FILTER=${PROJECT_FILTER:-<unset>}"
fi

for project_json in "${project_rows[@]}"; do
  vercel_project="$(project_field "${project_json}" '.vercel_project')"
  log "Redeploying ${vercel_project}"

  latest_url="$(latest_production_deployment_url "${vercel_project}")"
  if [[ -z "${latest_url}" || "${latest_url}" == "null" ]]; then
    die "Could not determine latest production deployment for ${vercel_project}"
  fi

  redeploy_url="$(redeploy_project "https://${latest_url}")"
  if [[ -z "${redeploy_url}" ]]; then
    die "Vercel did not return a redeploy URL for ${vercel_project}"
  fi

  log "Waiting for ${redeploy_url}"
  wait_for_deployment_ready "${redeploy_url}" > "${TMP_DIR}/${vercel_project}-inspect.json"

  mapfile -t smoke_urls < <(jq -r '.smoke_urls[]' <<< "${project_json}")
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
