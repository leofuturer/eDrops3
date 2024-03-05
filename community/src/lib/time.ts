export function timeAgo(date : Date) : string {
  const millisecondsAgo = ((new Date()).getTime() - date.getTime());
  const minutesAgo = Math.round(millisecondsAgo / (1000 * 60));
  if (minutesAgo < 60) return `${minutesAgo}m`;
  const hoursAgo = Math.round(millisecondsAgo / (1000 * 60 * 60));
  if (hoursAgo < 24) return `${hoursAgo}h`;
  const daysAgo = Math.round(millisecondsAgo / (1000 * 60 * 60 * 24));
  if (daysAgo < 365) return `${daysAgo}d`;
  const yearsAgo = Math.round(millisecondsAgo / (1000 * 60 * 60 * 24 * 365));
  return `${yearsAgo}y`;
}
