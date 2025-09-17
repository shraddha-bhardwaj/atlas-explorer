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

// handle mongo errors
export function handleError(error) {
  // mongo duplicate key error
  if (error.code === 11000) {
    return errorResponse("Resource already exists", 409);
  }

  // mongo validation error
  if (error.name === "ValidationError") {
    return errorResponse("Invalid data provided", 400);
  }

  // mongo cast error
  if (error.name === "CastError") {
    return errorResponse("Invalid ID", 400);
  }

  // mongo connection errors
  if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
    return errorResponse("Database connection failed", 503);
  }

  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : error.message;

  return errorResponse(message, 500);
}

// wrapper for api routes to handle try-catch
export function apiHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error("API Error:", error);
      return handleError(error);
    }
  };
}

export async function tryAsync(operation, fallback = null) {
  try {
    return await operation();
  } catch (error) {
    console.error("Async operation failed:", error);
    return fallback;
  }
}
