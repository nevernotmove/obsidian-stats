#!/usr/bin/env sh
set -e

# This script runs the full data fetching and crunching process
# but outputs the results to a local 'test-output' folder instead
# of modifying your public/data directory.

ROOT_DIR=$(pwd)
TEST_DIR="tmp-test-run"
OUTPUT_DIR="test-output"

echo "Creating clean test environment..."
rm -rf "$TEST_DIR" "$OUTPUT_DIR"
mkdir -p "$TEST_DIR"
mkdir -p "$OUTPUT_DIR"

cd "$TEST_DIR"
echo "Cloning obsidian-releases (shallow clone to save time)..."
git clone --depth 1 https://github.com/obsidianmd/obsidian-releases.git .

echo "Extracting stats history..."
# We only get the history of the file we care about
git fetch --unshallow || true
LOG_COUNT=$(git log --oneline -- community-plugin-stats.json | wc -l)
echo "Found $LOG_COUNT historical versions."

cp community-plugins.json ../"$OUTPUT_DIR"/community-plugins.json
# community-plugins.json is already in the current folder from the git clone

CURRENT=0
git log --reverse --pretty=format:"%at %H" -- community-plugin-stats.json | while read ts hash; do
  echo "---BEGIN $ts---"
  git show "$hash":community-plugin-stats.json
  echo "---END---"
  CURRENT=$((CURRENT+1))
  if [ $((CURRENT % 100)) -eq 0 ]; then
    echo "Progress: $CURRENT/$LOG_COUNT versions extracted..." >&2
  fi
done > stats.json

echo "Copying crunch.go and running it..."
cp "$ROOT_DIR"/script/crunch/crunch.go .
cp "$ROOT_DIR"/script/crunch/go.mod .
# cp "$ROOT_DIR"/script/crunch/go.sum . # Not needed anymore

go run crunch.go

echo "Copying results to $OUTPUT_DIR..."
cp plugins.json "$ROOT_DIR"/"$OUTPUT_DIR"/
cp -R plugins "$ROOT_DIR"/"$OUTPUT_DIR"/

cd "$ROOT_DIR"
# rm -rf "$TEST_DIR" # Keep it if you want to inspect, or remove it for cleanliness

echo "------------------------------------------------"
echo "Done! You can find the results in '$OUTPUT_DIR'"
echo "Number of plugins crunched: $(ls -1 "$OUTPUT_DIR"/plugins | wc -l)"
echo "------------------------------------------------"
