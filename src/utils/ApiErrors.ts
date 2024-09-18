class ApiError extends Error {
  public statusCode: number;      // HTTP status code
  public success: boolean;        // Success flag (usually false for errors)
  public errors: string[];        // Additional error details
  public data: any | null;        // Optional field to store additional data

  constructor(
    statusCode: number,           // HTTP status code (e.g., 404, 500)
    message: string = "Something went wrong",   // Default error message
    errors: string[] = [],        // Array of error messages (useful for validation errors)
    stack: string = "",           // Optional stack trace
    data: any | null = null       // Optional additional data (e.g., request context)
  ) {
    super(message);               // Call parent constructor with the message
    this.statusCode = statusCode; // Set HTTP status code
    this.success = false;         // Always false for errors
    this.errors = errors;         // Assign additional error messages
    this.data = data;             // Additional optional data (null by default)

    // Set the stack trace if provided, otherwise generate one using Error.captureStackTrace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
