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
