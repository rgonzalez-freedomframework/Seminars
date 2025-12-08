#!/bin/bash
# Increment version before build

VERSION_FILE="version.json"
VERSION_TS="src/lib/version.ts"

if [ -f "$VERSION_FILE" ]; then
  # Read current version
  CURRENT_VERSION=$(node -p "require('./$VERSION_FILE').version")
  CURRENT_BUILD=$(node -p "require('./$VERSION_FILE').build")
  
  # Increment build number
  NEW_BUILD=$((CURRENT_BUILD + 1))
  
  # Parse version parts
  IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
  MAJOR="${VERSION_PARTS[0]}"
  MINOR="${VERSION_PARTS[1]}"
  PATCH="${VERSION_PARTS[2]}"
  
  # Increment patch version
  NEW_PATCH=$((PATCH + 1))
  NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
  
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
  
  # Update version.json
  cat > "$VERSION_FILE" << EOF
{
  "version": "$NEW_VERSION",
  "build": $NEW_BUILD,
  "timestamp": "$TIMESTAMP"
}
EOF
  
  # Update version.ts
  cat > "$VERSION_TS" << EOF
// Auto-generated version file
// This is updated by scripts/increment-version.sh before each build
export const VERSION = '$NEW_VERSION'
export const BUILD = $NEW_BUILD
export const TIMESTAMP = '$TIMESTAMP'
EOF
  
  echo "Version updated to $NEW_VERSION (build $NEW_BUILD)"
else
  echo "version.json not found!"
  exit 1
fi
