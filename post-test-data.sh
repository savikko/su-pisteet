#!/bin/bash

# Post test data from results.json to Next.js API
# Make sure Next.js app is running (npm run dev) before running this script

JSON_FILE="results.json"
API_URL="http://localhost:3000/api/results"

echo ""
echo "🏃‍♂️ Posting test data to Next.js API..."
echo "File: $JSON_FILE"
echo "URL: $API_URL"
echo ""

# Check if file exists
if [ ! -f "$JSON_FILE" ]; then
    echo "❌ Error: $JSON_FILE not found!"
    exit 1
fi

# Check if jq is available for pretty output (optional)
if command -v jq &> /dev/null; then
    HAS_JQ=true
else
    HAS_JQ=false
fi

# Post to API
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d @"$JSON_FILE")

# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Success!"
    if [ "$HAS_JQ" = true ]; then
        echo "$BODY" | jq '.'
    else
        echo "$BODY"
    fi
    echo ""
    echo "🌐 View results at: http://localhost:3000"
else
    echo "❌ Error occurred! HTTP Status: $HTTP_CODE"
    echo "$BODY"
    echo ""
    echo "💡 Make sure Next.js is running:"
    echo "   npm run dev"
    exit 1
fi

