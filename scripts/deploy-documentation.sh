#!/usr/bin/env sh

# abort on errors
set -e

# change npm verbosity
export npm_config_loglevel=error

# Install depedencies
npm install

# TODO: run tests
# TODO: enable a smart way to deploy:
# 1. pull/clone the github gh page repo into the ci image
# 2. build the dist
# 3. if dist files changed, commit and push
cd docs/.vuepress/dist
git clone https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git
cd -

# build the docs
npm run docs:build

cd docs/.vuepress/dist
git add -A

if [[ ! `git diff-index --quiet HEAD docs/.vuepress/dist` ]]; then
    # deploy to github pages
    git commit -m 'deploy'
    git push https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master
else
    echo "no changes"
fi
cd -

