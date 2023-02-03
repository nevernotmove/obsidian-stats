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

git init
git checkout -B main
# Add everything but data folder
git add -- . ':!data'
git commit -m 'Deploy code'
git status

git push -f git@github.com:nevernotmove/obsidian-stats.git main:gh-pages

cd -