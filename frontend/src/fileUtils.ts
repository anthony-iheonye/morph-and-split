// A function to check that filetype is valid
export const validFileType = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  return validTypes.includes(file.type);
};

export const getFileExt = (file: File): string | undefined | null => {
  return file.name.split(".").pop()?.toLowerCase();
};

export const getFileSize = (size: number): string => {
  if (size < 1024) return `${size} bytes`;
  else if (size < 1_048_576) return `${(size / 1024).toFixed(2)} KB`;
  else return `${(size / 1_048_576).toFixed(2)} MB`;
};
