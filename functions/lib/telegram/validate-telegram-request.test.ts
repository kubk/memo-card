import { describe, expect, it } from "vitest";
import { validateTelegramRequest } from "./validate-telegram-request.ts";
import { Crypto } from "@peculiar/webcrypto";
const crypto = new Crypto();

const validate = validateTelegramRequest;

// The hash was taken from here: https://github.com/Telegram-Mini-Apps/tma.js/blob/b230e8ba5b138efdc248581377be650e297a3a22/packages/init-data-node/__tests__/validation.ts#L6
const hashValid =
  "query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2";
const hashFake =
  "query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A279052342342348397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2";
const secretTokenValid = "5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiLPtAEhx8";
const secretTokenFake = "5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiL";

describe("validate telegram request", () => {
  it("should correctly validate parameters in case they are valid", async () => {
    const result = await validate(crypto, hashValid, secretTokenValid);
    expect(result).toBeTruthy();
    expect(result).toHaveProperty("firstName");
    expect(result).toHaveProperty("lastName");
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("languageCode");
    expect(result).toHaveProperty("username");
  });

  it("should correctly report fake parameters", async () => {
    expect(await validate(crypto, hashFake, secretTokenValid)).toBeFalsy();
    expect(await validate(crypto, hashValid, secretTokenFake)).toBeFalsy();
    expect(await validate(crypto, "auth_date=1", secretTokenFake)).toBeFalsy();
  });
});
