export default function linkify(text) {
  return {
    __html: text
      .replaceAll("<", "&lt;")
      .replace(/(https?:\/\/[^ ]+)/g, "<a href='$1' target='_blank'>$1</a>"),
  };
}
