import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
// import { printError } from 'src/util/console.log';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const message = exception instanceof HttpException ? exception.message : ""
        const stack = exception instanceof HttpException ? exception.stack : ""
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        // printError(status, "method", request.url, message, stack)
        console.log(status, request.url, message, stack)
        response.status(status).json({
            status,
            message
        });
    }
}
