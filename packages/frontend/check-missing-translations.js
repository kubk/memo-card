#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRANSLATIONS_DIR = path.join(__dirname, 'src/translations');
const SRC_DIR = path.join(__dirname, 'src');
const EN_TRANSLATIONS_FILE = path.join(TRANSLATIONS_DIR, 'en.ts');

// Category translation keys are built dynamically from the API category name.
const EXCLUDED_KEYS = new Set([
  'category_Chemistry',
  'category_English',
  'category_Geography',
  'category_History',
  'category_Other',
  'category_Spanish',
  'category_Thai'
]);

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function extractTranslationKeys() {
  try {
    const enContent = fs.readFileSync(EN_TRANSLATIONS_FILE, 'utf8');
    
    const keyRegex = /^ {2}([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
    const keys = [];
    let match;
    
    while ((match = keyRegex.exec(enContent)) !== null) {
      keys.push(match[1]);
    }
    
    return keys.sort();
  } catch (error) {
    log(`Error reading translation file: ${error.message}`, 'red');
    process.exit(1);
  }
}

function findUsedTranslationKeys(keys) {
  const keysToFind = new Set(keys.filter((key) => !EXCLUDED_KEYS.has(key)));
  const usedKeys = new Set();

  if (keysToFind.size === 0) {
    return usedKeys;
  }

  const directories = [SRC_DIR];
  const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);

  while (directories.length > 0) {
    const directory = directories.pop();
    let entries;

    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name !== 'translations') {
          directories.push(path.join(directory, entry.name));
        }
        continue;
      }

      if (!sourceExtensions.has(path.extname(entry.name))) {
        continue;
      }

      let content;

      try {
        content = fs.readFileSync(path.join(directory, entry.name), 'utf8');
      } catch {
        continue;
      }

      const wordRegex = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
      let match;

      while ((match = wordRegex.exec(content)) !== null) {
        if (keysToFind.has(match[0])) {
          usedKeys.add(match[0]);

          if (usedKeys.size === keysToFind.size) {
            return usedKeys;
          }
        }
      }
    }
  }

  return usedKeys;
}

function findUnusedTranslations() {
  const allKeys = extractTranslationKeys();
  const usedKeys = findUsedTranslationKeys(allKeys);
  const unusedKeys = allKeys.filter(
    (key) => !EXCLUDED_KEYS.has(key) && !usedKeys.has(key)
  );

  return { unusedKeys, usedKeys, total: allKeys.length };
}

function main() {
  if (!fs.existsSync(EN_TRANSLATIONS_FILE)) {
    console.error(`Could not find translations file at: ${EN_TRANSLATIONS_FILE}`);
    process.exit(1);
  }
  
  const { unusedKeys } = findUnusedTranslations();
  
  if (unusedKeys.length > 0) {
    unusedKeys.forEach((key) => {
      console.log(key);
    });
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
