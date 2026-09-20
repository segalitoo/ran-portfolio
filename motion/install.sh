#!/bin/sh
# Move the renders into the site. Posters that are still PNG go through
# cwebp, as every other image in the repo does; ffmpeg here has no webp
# encoder. render-art.mjs already emits webp, so those are copied.
set -e
cd "$(dirname "$0")"

# Named one by one rather than by glob. A blanket copy drops a second
# copy of the Mint render under its composition name, and four of the
# five Payoneer pages take the art loop while icon-packages, which has
# no artwork, keeps the cross-dissolve. Left to a glob that difference
# is invisible and the wrong file wins silently.
#
#   <source stem in out/>  <name the site asks for>
SET='
art-website   payoneer-website
art-email     payoneer-email
art-portal    payoneer-portal
art-photos    payoneer-images
payoneer-icons payoneer-icons
'

echo "$SET" | while read -r src dst; do
  [ -n "$src" ] || continue
  for ext in webm mp4; do
    [ -e "out/$src.$ext" ] || { echo "missing out/$src.$ext"; exit 1; }
    cp "out/$src.$ext" "../assets/media/$dst.$ext"
  done
  if [ -e "out/$src-poster.webp" ]; then
    cp "out/$src-poster.webp" "../assets/media/$dst-poster.webp"
  elif [ -e "out/$src-poster.png" ]; then
    cwebp -q 82 -quiet "out/$src-poster.png" -o "../assets/media/$dst-poster.webp"
  else
    echo "missing poster for $src"; exit 1
  fi
done

ls -la ../assets/media/payoneer-* | awk '{printf "%-44s %8d\n", $NF, $5}'
