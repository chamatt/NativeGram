export default function maxLength(text = "", max) {
  if (!max || max <= 3) return text;
  return {
    text: text.length < max ? `${text}` : `${text.substring(0, max - 3)}...`,
    overflow: text.length > max,
  };
}
