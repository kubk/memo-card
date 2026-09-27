import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, test } from "vitest";

const checkerPath = resolve(process.cwd(), "check-missing-translations.js");

test("reports unused keys while respecting source and exclusion rules", () => {
  const fixtureDir = mkdtempSync(join(tmpdir(), "memo-card-translations-"));

  try {
    const translationsDir = join(fixtureDir, "src", "translations");
    mkdirSync(translationsDir, { recursive: true });
    writeFileSync(
      join(fixtureDir, "check-missing-translations.mjs"),
      readFileSync(checkerPath, "utf8"),
    );
    writeFileSync(
      join(translationsDir, "en.ts"),
      `export const en = {
  category_English: "English",
  dynamic_usage: "Dynamic",
  hidden_translation_usage: "Translation only",
  substring_key: "Substring",
  unused_key: "Unused",
  used_double: "Double",
  used_single: "Single",
  used_template: "Template",
};
`,
    );
    writeFileSync(
      join(translationsDir, "other.ts"),
      'const hidden_translation_usage = "Hidden";\n',
    );
    writeFileSync(
      join(fixtureDir, "src", "app.ts"),
      [
        'const doubleQuoted = t("used_double");',
        "const singleQuoted = t('used_single');",
        "const templateQuoted = t(`used_template`);",
        "const dynamic_usage = true;",
        'const partial = "not_substring_key_suffix";',
      ].join("\n"),
    );

    const result = spawnSync(
      process.execPath,
      [join(fixtureDir, "check-missing-translations.mjs")],
      { encoding: "utf8" },
    );

    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
    expect(result.stdout.trim().split(/\r?\n/)).toEqual([
      "hidden_translation_usage",
      "substring_key",
      "unused_key",
    ]);
  } finally {
    rmSync(fixtureDir, { recursive: true, force: true });
  }
});
