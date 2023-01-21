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
git fast-export --all community-plugin-stats.json >> ../stats.json
cd ..
pwd
cp -R ../script/crunch/. .
go mod tidy
go mod vendor
go run crunch.go
cp total-downloads.json ../public/total-downloads.json
cp -R ./plugins/. ../public/plugins
cd ..
rm -rf tmp 
