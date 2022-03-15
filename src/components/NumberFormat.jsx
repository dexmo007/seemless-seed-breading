export default function NumberFormat({ value }) {
  const rounded = Math.round(value * 100) / 100;
  if (rounded === value) {
    return value;
  }
  return `~ ${rounded}`;
}
