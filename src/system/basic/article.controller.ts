import { Body, Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { allGuard } from "src/guards/rule.guard";
import { User } from "src/guards/user.decorator";
import { Account } from "src/table/entity/account.entity";
import { AccountService } from "src/table/service/account.service";
import { ArticleService } from "src/table/service/article.service";
import { Forbidden } from "src/type/http";



@Controller("api/basic/article")
@UseGuards(AuthGuard("jwt"), allGuard)
@ApiTags("网站文章")
export class BasicArticleController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly accountService: AccountService
    ) { }

    @Get("get/:hash_key")
    @ApiOperation({ summary: "获取文章信息及内容" })
    public async getArticle(
        @User() user: Account,
        @Param("hash_key") hash_key: string
    ) {
        const article = await this.articleService.findArticleByHashKey(hash_key);
        const context = this.articleService.getArticleContext(article.hash_key);
        //如果文章未公开并且未审核通过，仅允许管理以及本人查看
        if (!article.isVisible && article.status !== "success") {
            if (!user) throw Forbidden;
            if (this.accountService.isAdmin(user.profile) && user.uid !== article.account.uid) {
                throw Forbidden;
            }
        }
        return { ...article, context }
    }

    @Get("user/:hash_key/:start/:limit")
    @ApiOperation({ summary: "获取用户的文章列表" })
    public async getUserArticleList(
        @User() user: Account,
        @Param("hash_key") hash_key: string,
        @Param("start") start: number,
        @Param("limit") limit: number
    ) {
        let queryBuilder = this.accountService.account
            .createQueryBuilder("account")
            .leftJoinAndSelect("account.articles", "articles")
            .leftJoinAndSelect("articles.tags", "tags")
            .where("articles.id > :start", { start })
            .limit(limit)
        //如果访问的不是自己并且不是管理员
        if (!!user || user.hash_key !== hash_key) {
            if (!this.accountService.isAdmin(user.profile)) {
                queryBuilder = queryBuilder
                    .andWhere("articles.isVisible = :isVisible", { isVisible: true })
                    .andWhere("articles.status = :status", { status: "success" })
            }
        }
        const result = await queryBuilder

            .getOne();
        return result.articles
    }

    @Get("getList/:start/:limit")
    @ApiOperation({ summary: "获取文章" })
    public async getArticleList(
        @User() user: Account,
        @Param("start") start: number,
        @Param("limit") limit: number
    ) {
        let queryBuilder = this.articleService.article
            .createQueryBuilder("article")
            .leftJoinAndSelect("article.account", "account")
            .leftJoinAndSelect("article.tags", "tags")
            .orderBy("article.id", "DESC")
            .where("article.id < :start", { start: start == -1 ? "9999999999" : start })
            .limit(limit);
        //非管理员仅能查看公开文章
        console.log(this.accountService.isAdmin(user.profile));
        if (!user || !this.accountService.isAdmin(user.profile)) {
            queryBuilder = queryBuilder
                .andWhere("articles.isVisible = :isVisible", { isVisible: true })
                .andWhere("articles.status = :status", { status: "success" });
        }
        return await queryBuilder.getMany();
    }
}