/**
 * Represents a stratification data file uploaded by the user.
 *
 * Typically used for defining how datasets should be split based on metadata columns.
 */
export default interface StratificationDataFile {
  /** File name used for display or identification */
  name: string;
  /** File object reference for upload or null if none selected */
  file: File | null;
}
