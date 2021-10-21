/**
 *
 * @param {number} absValue Seconds to convert
 * @returns {string} Seconds to mm:ss string
 */
export function formatTime(s) {
  const sign = Math.sign(s);
  let absValue = Math.abs(s);
  return (
    `${sign === -1 ? '-' : ''}` +
    ((absValue - (absValue %= 60)) / 60 +
      (9 < absValue ? ':' : ':0') +
      absValue)
  );
}
