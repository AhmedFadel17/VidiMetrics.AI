using FluentValidation;
using VidiMetrics.API.Factories;

namespace VidiMetrics.API.Middlwares
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex) 
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = exception switch
            {
                KeyNotFoundException => StatusCodes.Status404NotFound,
                ValidationException => StatusCodes.Status422UnprocessableEntity,
                ArgumentException => StatusCodes.Status400BadRequest,
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                _ => StatusCodes.Status500InternalServerError,
            };

            Dictionary<string, List<string>> errors = new();

            if (exception is ValidationException validationEx)
            {
                foreach (var failure in validationEx.Errors)
                {
                    if (!errors.ContainsKey(failure.PropertyName))
                        errors[failure.PropertyName] = new List<string>();

                    errors[failure.PropertyName].Add(failure.ErrorMessage);
                }
            }

            var response = ApiResponseFactory.Error(
                exception is ValidationException ? "Validation failed" : exception.Message,
                errors.Any() ? errors : null,
                statusCode
                );


            context.Response.StatusCode = statusCode;
            return context.Response.WriteAsJsonAsync(response);
        }
    }
}
