#!/usr/bin/env sh

# On Windows (with git installed) you can set the npm shell like so:
# npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
# That way you can run this script via the npm script
# To unset it do this:
# npm config delete script-shell

# Abort on errors
set -e

# Navigate into the build output directory
cd dist

# Place .nojekyll to bypass Jekyll processing
echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'

git push -f git@github.com:nevernotmove/plugin-stats.git main:gh-pages

cd -