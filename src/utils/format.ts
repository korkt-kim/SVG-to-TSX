export function sanitizeComponentName(name: string) {
  let cleanStr = name.replace(/[^a-zA-Z0-9_$]/g, "");

  if (/^[0-9]/.test(cleanStr)) {
    cleanStr = "_" + cleanStr;
  }

  return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1);
}
