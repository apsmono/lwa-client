export const CURRENCY_FORMAT_DEFAULT_CONFIG = {
  currency: "USD",
  style: "currency",
};

export const currencyFormat = (
  num: number,
  options: Intl.NumberFormatOptions = {
    currency: "USD",
    style: "currency",
  }
) => {
  const { currencyDisplay, ...opt } = options;
  if (currencyDisplay === "none")
    return new Intl.NumberFormat("en-US", opt).format(num).replace("$", "");
  return new Intl.NumberFormat("en-US", opt).format(num);
};

export const parseLocaleNumber = (
  strNumber: string,
  locale: string = "en-US"
) => {
  if (!strNumber) {
    return 0;
  }
  const thousandSeparator = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  })
    .formatToParts(1111)
    .filter((part) => part.type === "group")[0].value;

  const decimalSeparator = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  })
    .formatToParts(1.1)
    .filter((part) => part.type === "decimal")[0].value;

  return parseFloat(
    strNumber
      .replace("$", "")
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), ".")
  );
};
