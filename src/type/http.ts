import { HttpCode, HttpException } from "@nestjs/common";
class Http extends HttpException {
    constructor(msg: string, code: number) {
        super(msg, code)
    }
    static forbidden = (msg: string = "403", code = 403) => new Http(msg, code)
}
export const Forbidden = Http.forbidden()
export const PasswordErr = Http.forbidden("401", 401)
export const NotFound = Http.forbidden("404", 404)

export const giteeGetInfoErr = Http.forbidden("10011", 500);
export const giteeGetTokenErr = Http.forbidden("10012", 500);

export const githubGetInfoErr = Http.forbidden("10001", 500);
export const githubGetTokenErr = Http.forbidden("10002", 500);

