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

  if (diff < msPerMinute) {
    unit = "seconds";
    return Math.round(diff / 1000) + " seconds ago";
  } else if (diff < msPerHour) {
    unit = "minutes";
  } else if (diff < msPerDay) {
    unit = "hours";
  } else if (diff < msPerMonth) {
    if (Math.round(diff / msPerDay) === 1) unit = "day";
    else unit = "days";
  } else if (diff < msPerYear) {
    unit = "months";
  } else {
    unit = "years";
  }
  return formatter.format(Math.floor(-diff / (1000 * 60 * 60 * 24)), unit);
};
