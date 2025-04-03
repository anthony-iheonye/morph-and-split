/**
 * CustomError extends the native JavaScript Error object to include a `title` field.
 *
 * Useful for showing user-friendly error titles alongside detailed messages,
 * especially when displaying toast notifications or UI feedback.
 */
class CustomError extends Error {
  /** Short error title for UI display */
  title: string;

  constructor(title: string, message: string) {
    super(message);
    this.title = title;
    Object.setPrototypeOf(this, CustomError.prototype); // ensures instanceof works
  }
}

export default CustomError;
