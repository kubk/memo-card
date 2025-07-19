#!/bin/bash

# Array of locales
locales=("ru" "es" "pt-br" "uk")

# Output directory
OUT_DIR="out"

# Detect the operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed_cmd() {
        sed -i '' "$@"
    }
else
    # Linux and others
    sed_cmd() {
        sed -i "$@"
    }
fi

sed_replace() {
    sed_cmd "s/$1/$2/g" "$3"
}

# Loop through each locale
for locale in "${locales[@]}"; do
    # Check if HTML file exists and replace 'en' with locale
    if [ -f "${OUT_DIR}/${locale}.html" ]; then
        sed_replace 'lang="en"' "lang=\"${locale}\"" "${OUT_DIR}/${locale}.html"
        echo "Replaced 'en' with '${locale}' in ${OUT_DIR}/${locale}.html"
    else
        echo "Warning: ${OUT_DIR}/${locale}.html not found"
    fi

    # Check if TXT file exists and replace "en" with "locale"
    if [ -f "${OUT_DIR}/${locale}.txt" ]; then
        sed_replace '"en"' "\"${locale}\"" "${OUT_DIR}/${locale}.txt"
        echo "Replaced \"en\" with \"${locale}\" in ${OUT_DIR}/${locale}.txt"
    else
        echo "Warning: ${OUT_DIR}/${locale}.txt not found"
    fi
done

echo "Script execution completed."
