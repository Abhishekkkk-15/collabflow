import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 400;

    const errResponse = exception.getResponse();
    // Normalize messages into array of strings or objects
    let details: unknown[] = [];

    if (typeof errResponse === 'string') {
      details = [errResponse];
    } else if (Array.isArray((errResponse as any).message)) {
      details = (errResponse as any).message;
    } else if ((errResponse as any).message) {
      details = [(errResponse as any).message];
    } else {
      details = [errResponse];
    }

    return response.status(status).json({
      success: false,
      statusCode: status,
      error: 'Bad Request',
      message: 'Some required fields are missing or invalid',
      details,
      timestamp: new Date().toISOString(),
    });
  }
}
