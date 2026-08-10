export const REGEX = {
  UUID_V4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  LETTER_NUMBER_SPACE: /^([\p{L}\p{M}\p{N}\u0027\u2019\u2018\u02BB\u02BC]+([\s]+[\p{L}\p{M}\p{N}\u0027\u2019\u2018\u02BB\u02BC]+)?)*$/u,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{7,15}$/,
  USERNAME: /^([\p{L}\p{M}\d\u0027\u2019\u2018\u02BB\u02BC]+([_.-]+[\p{L}\p{M}\d\u0027\u2019\u2018\u02BB\u02BC])?)*$/u,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/, // At least one lowercase letter, one uppercase letter, one digit, one special character, length between 8 and 64
};
