export function titleCase(str: string): string {
  return str
    .split(" ")
    .map((word) =>
      word === word.toUpperCase() && word.length > 1
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

export function stripSpecialChars(str: string): string {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
}

export function formatUploadName(name: string): string {
  let formattedName = stripSpecialChars(name);
  formattedName = titleCase(formattedName);
  formattedName = formattedName.replace(/\s+/g, "");
  return formattedName;
}
