class CustomError extends Error {
  title: string;

  constructor(title: string, message: string) {
    super(message);
    this.title = title;
    Object.setPrototypeOf(this, CustomError.prototype); // ensures instanceof works
  }
}

export default CustomError;
