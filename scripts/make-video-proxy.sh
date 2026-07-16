#!/usr/bin/env bash
# Create a compressed proxy for browser review from a raw master.
# Usage: ./scripts/make-video-proxy.sh .local-masters/video-source/RAW.mp4 public/assets/video-proxies/OUT.mp4
set -euo pipefail

SRC="${1:-}"
OUT="${2:-}"

if [[ -z "$SRC" || -z "$OUT" ]]; then
  echo "Usage: $0 <raw-input.mp4> <proxy-output.mp4>"
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install ffmpeg, then re-run."
  exit 1
fi

mkdir -p "$(dirname "$OUT")"

ffmpeg -y -i "$SRC" \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -preset veryfast -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "$OUT"

echo "Proxy written: $OUT"
echo "Register this path in the public-safe video manifest before sharing."
