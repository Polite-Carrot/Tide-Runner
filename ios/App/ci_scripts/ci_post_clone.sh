#!/bin/sh
set -e

# Xcode Cloud clones fresh, so the Capacitor-generated
# ios/App/App/public and ios/App/App/capacitor.config.json don't exist.
# Install Node, install deps, and let Capacitor regenerate them.

brew install node

cd ../..

npm ci
npx cap sync ios
