/**
 * Function to pad zeroes to timestamps
 * Converts H[H]:M[M]:S[S] to HH:MM:SS, Leaves YYYY:M[M]:D[D] as is
 * Example: 2020-7-2 5:3:2 -> 05:03:02 (5:03 AM, and then 2 seconds)
 * @param {string} time - time of file upload in YYYY:M[M]:D[D] H[H]:M[M]:S[S]
 */
export function padZeroes(time: string) {
  const timeStart = time.indexOf(' ');
  const firstColon = time.indexOf(':', timeStart);
  const secondColon = time.lastIndexOf(':');
  let hour = time.slice(timeStart + 1, firstColon);
  let min = time.slice(firstColon + 1, secondColon);
  let sec = time.slice(secondColon + 1);
  if (firstColon - timeStart === 2) {
    hour = `0${time.charAt(timeStart + 1)}`;
  }
  if (secondColon - firstColon === 2) {
    min = `0${time.charAt(firstColon + 1)}`;
  }
  if (time.length - secondColon === 2) {
    sec = `0${time.slice(-1)}`;
  }
  return `${time.slice(0, timeStart + 1)}${hour}:${min}:${sec}`;
}