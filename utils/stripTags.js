export default function stripTags(text) {
  return text.replace(/<.+?>/g, "");
}
