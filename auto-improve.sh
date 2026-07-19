#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
#  auto-improve.sh — Infinite Gundawar repo "skill"
#
#  Runs the healthcheck improver agent against a running instance and writes a
#  report. Designed to be triggered by:
#    - a cron job (local, after `npm run start`)
#    - a scheduled GitHub Actions workflow
#    - a post-deploy hook
#
#  Usage:  ./auto-improve.sh [BASE_URL]
#  Default BASE_URL: http://localhost:3300
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

BASE="${1:-http://localhost:3300}"
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${HERE}/.hermes/improvements.json"

echo "▶ Infinite Gundawar auto-improve — healthcheck against ${BASE}"
python3 "${HERE}/agents/improver/healthcheck.py" --base "${BASE}" --out "${OUT}"

echo "✓ Report written to ${OUT}"
echo "▶ Next: an LLM agent reads ${OUT} and opens PRs for any failures."
