import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ruleConfig, userRuleGuard } from "src/guards/rule.guard";
import { AccountService } from "src/table/service/account.service";
import { ArticleService } from "src/table/service/article.service";



@Controller()
@ApiTags("管理路由")
@UseGuards(AuthGuard("jwt"), userRuleGuard([ruleConfig.admin, ruleConfig.leader]))
export class AdminController {
    constructor(
        private readonly accountService: AccountService,
        private readonly articleService: ArticleService
    ) { }

    @Get("setStatus/:hash_key/:status")
    @ApiOperation({ summary: "设置文章状态" })
    public async setStatus() { }

    @Get("setAccount/:hash_key/:status")
    @ApiOperation({ summary: "设置用户状态" })
    public async setAccount() { }

    @Post("insertKGNB")
    @ApiOperation({ summary: "添加阔哥牛逼语录" })
    public async insertKGNB(
        @Body() body
    ) { }

    @Get("deleteKGNB/:id")
    @ApiOperation({ summary: "删除阔哥牛逼语录" })
    public async deleteKGNB(
        @Param("id") id: number
    ) { }
}