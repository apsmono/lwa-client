export function timeDiffRelative(current: Date, previous: Date) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current.getTime() - previous.getTime();

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    if (Math.round(elapsed / msPerDay) === 1) return "a day ago";
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    if (Math.round(elapsed / msPerMonth) === 1) return "1 month ago";
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}

export const dateFormat = (
  str: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    day: "numeric",
    month: "long",
  },
  timeZone = "en-US"
) => {
  const date = new Date(str);
  // console.log(date.toLocaleDateString());

  return date.toLocaleString(timeZone, options as Intl.DateTimeFormatOptions);
};

export const timeRelative = (
  current: Date,
  previous: Date,
  opt: Intl.RelativeTimeFormatOptions = { style: "short" },
  locale: string = "en"
) => {
  const formatter = new Intl.RelativeTimeFormat(locale, opt);
  const diff = current.getTime() - previous.getTime();

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  let unit: Intl.RelativeTimeFormatUnit = "seconds";

  let ms = msPerMinute;

  if (diff < msPerMinute * 60) {
    unit = "minute";
  } else if (diff < msPerHour * 24) {
    unit = "hour";
    ms = msPerHour;
  } else if (diff < msPerDay * 30) {
    unit = "day";
    ms = msPerDay;
  } else if (diff < msPerMonth * 12) {
    unit = "month";
    ms = msPerMonth;
  } else if (diff < msPerYear) {
    unit = "year";
    ms = msPerYear;
  }
  return formatter.format(-Math.floor(diff / ms), unit);
};
