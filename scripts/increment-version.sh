#!/bin/bash
# Increment version before build

VERSION_FILE="version.json"

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
  
  # Update version file
  cat > "$VERSION_FILE" << EOF
{
  "version": "$NEW_VERSION",
  "build": $NEW_BUILD,
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
}
EOF
  
  echo "Version updated to $NEW_VERSION (build $NEW_BUILD)"
else
  echo "version.json not found!"
  exit 1
fi
