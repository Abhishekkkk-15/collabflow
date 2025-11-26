export function normalizeString(str: string): string {
  let title = str?.toString().replace(/-/g, " ").split("_")[0];
  title = title?.charAt(0).toUpperCase() + title?.slice(1);
  return title;
}
