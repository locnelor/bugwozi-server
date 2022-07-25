import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AccountService } from "src/table/service/account.service";
import { Forbidden, giteeGetInfoErr, giteeGetTokenErr } from "src/type/http";
import { AxiosService } from "src/util/axios/axios.service";
import { AuthService } from "./auth.service";



@Controller("api/auth")
export class AuthController {
    constructor(
        private readonly accountService: AccountService,
        private readonly axiosService: AxiosService,
        private readonly authService: AuthService
    ) { }

    @ApiOperation({ summary: "使用邮箱注册、登录" })
    @Post("authEmail")
    async authEmail() {

    }

    @ApiOperation({ summary: "使用github、快速登录" })
    @Get("github/sign")
    async githubSign(@Req() req: Request) {
        const { code } = req.query;
        const token = await this.axiosService.github.getGithubToken(code.toString())
        console.log(token, "token");
        if (!token) throw Forbidden;
        const info = await this.axiosService.github.getGithubUserInfo(token.access_token)
        console.log(info, "info")
        return info;
        // c357833214313cbfe437
        //https://github.com/login/oauth/authorize?client_id=aba75663610cc68ae71a&redirect_uri=http://localhost:8080/api/auth/github/sign
    }

    @ApiOperation({ summary: "使用gitee快速登录" })
    @Get("gitee/sign")
    async giteeSign(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { code } = req.query;
        const token = await this.axiosService.gitee.getGiteeToken(code.toString()).catch(() => {
            throw giteeGetTokenErr
        });
        const { access_token } = token
        const info = await this.axiosService.gitee.getGiteeUserInfo(access_token).catch(() => {
            throw giteeGetInfoErr
        });
        const profile = await this.accountService.profile.findOne({
            where: {
                gitee_id: info.id
            },
            relations: ["account"]
        })
        if (!!profile) {
            return this.authService.getToken(profile, req, res);
        }
        const result = await this.accountService.createAccount({
            gitee_id: info.id,
            user_name: info.login
        });
        this.accountService.saveAvatar(result.account, { url: info.avatar_url });
        return this.authService.getToken(result, req, res);
    }

}   