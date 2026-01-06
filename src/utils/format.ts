export function sanitizeComponentName(_name: string) {
  const name = _name.split("=").slice(1).join("=");
  let cleanStr = name.replace(/[^a-zA-Z0-9_$]/g, "");

  if (/^[0-9]/.test(cleanStr)) {
    cleanStr = "_" + cleanStr;
  }

  return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1);
}
