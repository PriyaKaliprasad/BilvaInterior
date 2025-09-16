// utils/fileName.js
export function truncateFileName(name, maxBaseLength = 8) {
  if (!name) return '';
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1) return name; // no extension

  const base = name.substring(0, lastDot);
  const ext = name.substring(lastDot); // includes dot

  if (base.length <= maxBaseLength) {
    return base + ext;
  }
  return base.substring(0, maxBaseLength) + '...' + ext;
}
