/**
 * Checks whether a given file has a valid image MIME type.
 * Currently supports JPEG and PNG formats.
 *
 * @param file - The file to validate.
 * @returns True if the file type is valid, false otherwise.
 */
export const validFileType = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  return validTypes.includes(file.type);
};

/**
 * Extracts the file extension from a given file.
 *
 * @param file - The file whose extension is needed.
 * @returns The lowercase file extension (e.g. "png"), or undefined/null if not present.
 */
export const getFileExt = (file: File): string | undefined | null => {
  return file.name.split(".").pop()?.toLowerCase();
};

/**
 * Converts a raw file size in bytes to a human-readable format.
 *
 * @param size - File size in bytes
 * @returns A formatted string representing the size in bytes, KB, or MB.
 */
export const getFileSize = (size: number): string => {
  if (size < 1024) return `${size} bytes`;
  else if (size < 1_048_576) return `${(size / 1024).toFixed(2)} KB`;
  else return `${(size / 1_048_576).toFixed(2)} MB`;
};
