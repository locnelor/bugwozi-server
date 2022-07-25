import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
    async (data, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user && request.user.account
    }
)