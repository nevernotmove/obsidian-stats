#!/usr/bin/env sh

# On Windows (with git installed) you can set the npm shell like so:
# npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
# That way you can run this script via the npm script
# To unset it do this:
# npm config delete script-shell

mkdir tmp
cd tmp
git clone https://github.com/obsidianmd/obsidian-releases.git
cd obsidian-releases
cp community-plugins.json ../community-plugins.json

echo "Extracting history of community-plugin-stats.json"
LOG_COUNT=$(git log --oneline -- community-plugin-stats.json | wc -l)
echo "Found $LOG_COUNT historical versions."

CURRENT=0
git log --reverse --pretty=format:"%at %H" -- community-plugin-stats.json | while read ts hash; do
  echo "---BEGIN $ts---"
  git show $hash:community-plugin-stats.json
  echo "---END---"
  CURRENT=$((CURRENT+1))
  if (( CURRENT % 100 == 0 )); then
    echo "Progress: $CURRENT/$LOG_COUNT versions extracted..." >&2
  fi
done > ../stats.json

cd ..
pwd
cp -R ../script/crunch/. .
echo "Starting Go cruncher..."
go run crunch.go
cp plugins.json ../public/data/plugins.json
cp -R ./plugins/. ../public/data/plugins
cd ..
rm -rf tmp 
