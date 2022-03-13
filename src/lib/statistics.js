/**
 *
 * @param {number[]} values
 * @returns {number}
 */
export function stddev(values) {
  if (!values.length) {
    throw new Error('cannot compute stddev of empty array');
  }
  const n = values.length;
  const mean = values.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    values.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}
