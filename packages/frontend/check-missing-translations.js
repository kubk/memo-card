#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TRANSLATIONS_DIR = path.join(__dirname, 'src/translations');
const SRC_DIR = path.join(__dirname, 'src');
const EN_TRANSLATIONS_FILE = path.join(TRANSLATIONS_DIR, 'en.ts');

// Colors for terminal output
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
    
    // Match all keys in the translation object using regex
    const keyRegex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
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

function searchForKeyUsage(key) {
  try {
    // Search for t("key") and t('key') patterns
    const patterns = [
      `t\\("${key}"\\)`,
      `t\\('${key}'\\)`,
      `t\\\`${key}\\\``,
      `"${key}".*as.*any`, // for template literal usage like t(`category_${category}` as any)
      `'${key}'.*as.*any`,
      `\\b${key}\\b` // also search for the key as a word boundary (for dynamic usage)
    ];
    
    for (const pattern of patterns) {
      try {
        const result = execSync(
          `grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=translations -E '${pattern}' "${SRC_DIR}"`,
          { encoding: 'utf8', stdio: 'pipe' }
        );
        
        if (result && result.trim()) {
          return true;
        }
      } catch (grepError) {
        // grep returns non-zero exit code when no matches found, continue to next pattern
        continue;
      }
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

function findUnusedTranslations() {
  const allKeys = extractTranslationKeys();
  const unusedKeys = [];
  const usedKeys = [];
  
  for (const key of allKeys) {
    const isUsed = searchForKeyUsage(key);
    
    if (isUsed) {
      usedKeys.push(key);
    } else {
      unusedKeys.push(key);
    }
  }
  
  return { unusedKeys, usedKeys, total: allKeys.length };
}

function main() {
  // Check if we're in the right directory
  if (!fs.existsSync(EN_TRANSLATIONS_FILE)) {
    console.error(`Could not find translations file at: ${EN_TRANSLATIONS_FILE}`);
    process.exit(1);
  }
  
  const { unusedKeys, usedKeys, total } = findUnusedTranslations();
  
  if (unusedKeys.length > 0) {
    unusedKeys.forEach((key) => {
      console.log(key);
    });
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { extractTranslationKeys, searchForKeyUsage, findUnusedTranslations };