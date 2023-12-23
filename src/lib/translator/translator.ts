type Storage<Language extends string, Resource> = {
  [key in Language]: Resource;
};

type DefaultResource = { [key in string]: string };

export class Translator<
  Language extends string,
  Translation extends DefaultResource,
> {
  constructor(
    private storage: Storage<Language, Translation>,
    private lang: Language,
  ) {}

  setLang(lang: Language) {
    this.lang = lang;
  }

  getLang() {
    return this.lang;
  }

  translate(key: keyof Translation, defaultValue?: string): string {
    return this.storage[this.lang][key] ?? defaultValue;
  }
}
