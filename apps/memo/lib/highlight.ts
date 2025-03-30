export function highlightText(text: string, search: string) {
  if (!search) return text;

  const parts = text.split(new RegExp(`(${search})`, "gi"));

  return parts
    .map((part, i) => {
      if (part.toLowerCase() === search.toLowerCase()) {
        return `<mark class="bg-yellow-200 rounded px-1">${part}</mark>`;
      }
      return part;
    })
    .join("");
}
