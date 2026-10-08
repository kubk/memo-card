#!/bin/bash

locales=("ru" "es" "pt-br" "uk")

OUT_DIR="out"

# macOS and GNU sed use different syntax for in-place edits.
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed_cmd() {
        sed -i '' "$@"
    }
else
    sed_cmd() {
        sed -i "$@"
    }
fi

sed_replace() {
    sed_cmd "s/$1/$2/g" "$3"
}

for locale in "${locales[@]}"; do
    if [ -f "${OUT_DIR}/${locale}.html" ]; then
        sed_replace 'lang="en"' "lang=\"${locale}\"" "${OUT_DIR}/${locale}.html"
        echo "Replaced 'en' with '${locale}' in ${OUT_DIR}/${locale}.html"
    else
        echo "Warning: ${OUT_DIR}/${locale}.html not found"
    fi

    if [ -f "${OUT_DIR}/${locale}.txt" ]; then
        sed_replace '"en"' "\"${locale}\"" "${OUT_DIR}/${locale}.txt"
        echo "Replaced \"en\" with \"${locale}\" in ${OUT_DIR}/${locale}.txt"
    else
        echo "Warning: ${OUT_DIR}/${locale}.txt not found"
    fi
done

echo "Script execution completed."
