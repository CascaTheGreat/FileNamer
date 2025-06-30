export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function stripSpecialChars(str: string): string {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
}

export function formatUploadName(name: string): string {
  let formattedName = stripSpecialChars(name);
  formattedName = titleCase(formattedName);
  formattedName = formattedName.replace(/\s+/g, "_");
  return formattedName;
}
