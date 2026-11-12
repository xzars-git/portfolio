#!/usr/bin/env bash
# Regenerates pdf/*.pdf from the live page's print stylesheet.
# Needs: python, Google Chrome. Run from the repo root: bash build-pdf.sh
set -e
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
PORT=5199
python -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 &
SRV=$!; trap 'kill $SRV' EXIT; sleep 1
mkdir -p pdf
OUT="$(cd pdf && pwd -W 2>/dev/null || pwd)"
for l in en id ja; do
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
    --print-to-pdf="$OUT/arsenius-purbandono-portfolio-$l.pdf" "http://127.0.0.1:$PORT/?lang=$l&pdf=1"
done
ls -la pdf
