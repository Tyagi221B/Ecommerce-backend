class ApiError extends Error {
  public statusCode: number;      
  public success: boolean;        
  public errors: string[];        
  public data: any | null;        

  constructor(
    statusCode: number,           
    message: string = "Something went wrong",   
    errors: string[] = [],        
    stack: string = "",           
    data: any | null = null       
  ) {
    super(message);               
    this.statusCode = statusCode; 
    this.success = false;         
    this.errors = errors;         
    this.data = data;             

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
