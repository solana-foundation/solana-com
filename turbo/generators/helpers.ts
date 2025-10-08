export function validateName(name: string) {
  if (name.includes(".")) {
    return "name cannot include an extension";
  }
  if (name.includes(" ")) {
    return "name cannot include spaces";
  }
  if (!name) {
    return "name is required";
  }
  return true;
}
