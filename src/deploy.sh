#!/bin/bash
# Build, syntax check, load test, then deploy. Stops if any check fails. Usage: ./deploy.sh "commit message"
set -e
cd /home/claude/huntmap && python3 build.py >/dev/null
node --check /tmp/claude-0/-home-claude/9b729957-bff7-5048-939c-b62d8fe72de5/scratchpad/chk.js
cd /home/claude/hunt-atlas && cp ../huntmap/site/index.html . && cp ../huntmap/app.html ../huntmap/data.js ../huntmap/build.py ../huntmap/deploy.sh src/
NODE_PATH=/tmp/claude-0/-home-claude/9b729957-bff7-5048-939c-b62d8fe72de5/scratchpad/node_modules:$(npm root -g) node tools/loadtest.js 2>&1 | grep -v "agent-proxy\|connect_rejected\|Allowed domains\|For details\|^$" | tee /tmp/claude-0/-home-claude/9b729957-bff7-5048-939c-b62d8fe72de5/scratchpad/loadtest.out
grep -q "LOAD TEST PASSED" /tmp/claude-0/-home-claude/9b729957-bff7-5048-939c-b62d8fe72de5/scratchpad/loadtest.out || { echo "NOT DEPLOYED: load test failed"; git checkout -q index.html; exit 1; }
git add -A && git commit -qm "$1

Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WUrJtZwzAvo3gCRgd2vLf9" && git push -q origin v13:main
for i in $(seq 1 30); do sleep 8; s=$(gh api "repos/austinheflin-star/hunt-atlas/actions/runs?per_page=1" --jq '.workflow_runs[0] | .status+" "+(.conclusion//"")+" "+.head_sha[0:7]'); case "$s" in "completed success"*) break;; esac; done
echo "DEPLOYED: $s (local $(git rev-parse --short HEAD))"
