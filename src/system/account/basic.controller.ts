import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { allUserGuard } from "src/guards/rule.guard";
import { User } from "src/guards/user.decorator";
import { Account } from "src/table/entity/account.entity";
import { AccountService } from "src/table/service/account.service";
import { ArticleService } from "src/table/service/article.service";


@Controller("api/account/basic")
@ApiTags("用户基本路由")
@UseGuards(AuthGuard("jwt"), allUserGuard)
export class AccountBasicController {
    constructor(
        private readonly accountService: AccountService,
        private readonly articleService: ArticleService
    ) { }
    @Get("getUserInfo")
    @ApiOperation({ summary: "获取用户信息" })
    public async getUserInfo(
        @User() user: Account
    ) {
        delete user.profile;
        return user
    }

    @Post("issue/:hash_key")
    @ApiOperation({ summary: "发表评论" })
    public async issue(
        @Body() body,
        @Param("hash_key") hash_key: string,
        @User() user: Account
    ) { }

    @Get("deleteIssue/:issue_id")
    @ApiOperation({ summary: "删除我的评论" })
    public async deleteIssue(
        @User() user: Account,
        @Param("issue_id") issue_id: string
    ) { }



}