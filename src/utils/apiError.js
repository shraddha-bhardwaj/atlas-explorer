export function errorResponse(message, statusCode = 500) {
  return Response.json(
    {
      error: message,
      success: false,
    },
    { status: statusCode }
  );
}

export function successResponse(data, message = "Success") {
  return Response.json({
    data,
    message,
    success: true,
  });
}

// generic error handler
export function processError(error, msgContext = "") {
  let message;
  let statusCode;

  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  if (error.code === 11000) {
    message = "Resource already exists";
    statusCode = 409;
  } else if (error.name === "ValidationError") {
    message = "Invalid data provided";
    statusCode = 400;
  } else if (error.name === "CastError") {
    message = "Invalid ID format";
    statusCode = 400;
  } else if (
    error.name === "MongoNetworkError" ||
    error.name === "MongoServerError"
  ) {
    message = "Database connection failed";
    statusCode = 503;
  } else if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
    message = "Service unavailable";
    statusCode = 503;
  } else if (
    error.code === "ECONNABORTED" ||
    error.message?.includes("timeout")
  ) {
    message = "Request timeout";
    statusCode = 408;
  } else if (error.response?.status) {
    message = `External service error: ${error.message || "Unknown error"}`;
    statusCode = error.response.status >= 500 ? 502 : error.response.status;
  } else {
    message =
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : error.message || "Unknown error";
    statusCode = 500;
  }
  // if message context presetn, then add it to the message
  if (msgContext) {
    message = `${msgContext}: ${message}`;
  }

  return { message, statusCode };
}

// for service layers
export function throwError(error, msgContext = "") {
  const { message, statusCode } = processError(error, msgContext);
  throw new AppError(message, statusCode);
}

// wrapper for api routes to handle try-catch
export function apiHandler(handler) {
  return async (request, msgContext) => {
    try {
      return await handler(request, msgContext);
    } catch (error) {
      console.error("API Error:", error);

      // error in service layer
      if (error instanceof AppError) {
        return errorResponse(error.message, error.statusCode);
      }

      // fallback if not app error
      const { message, statusCode } = processError(
        error,
        "Unexpected API error"
      );
      return errorResponse(message, statusCode);
    }
  };
}

export class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.statusCode = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
