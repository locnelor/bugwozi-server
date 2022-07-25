import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";

@Injectable()
export class ResHeaderInterceptor implements NestInterceptor {
    constructor(
        private readonly contentType: string
    ) { }
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const res: Response = context.switchToHttp().getResponse();
        res.setHeader("content-type", this.contentType);
        return next.handle()
    }
}
export const JPG = "image/jpeg";
export const PNG = "image/png"
export const JSON = "application/json; charset=utf-8"