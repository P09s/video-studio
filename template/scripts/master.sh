#!/bin/sh
# Brings a rendered video to the loudness social apps play at (-14 LUFS, peaks under -1.5 dB), so the voice and
# music sound as loud as other videos in the feed. The picture is copied as it is.
#   scripts/master.sh out/promo-v1.mp4   ->  out/promo-v1-master.mp4
set -e
in="$1"
out="${in%.mp4}-master.mp4"
# loudnorm alone can overshoot its peak target, and AAC encoding adds inter-sample peaks, so a limiter at -2 dB
# follows it (scripts/review.mjs measures the true peak of the result).
ffmpeg -v error -y -i "$in" -af "loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.79:level=false" -c:v copy -c:a aac -b:a 192k "$out"
echo "$out"
