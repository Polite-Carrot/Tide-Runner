#!/bin/sh
set -e

# Xcode Cloud clones fresh, so Capacitor-generated
# ios/App/App/public and ios/App/App/capacitor.config.json are missing.
# Install Node, install deps, and let Capacitor regenerate them.

brew install node

cd "$CI_PRIMARY_REPOSITORY_PATH"

npm ci
npx cap sync ios
