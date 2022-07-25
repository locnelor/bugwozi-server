import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { allUserGuard, ruleConfig, userRuleGuard } from "src/guards/rule.guard";
import { User } from "src/guards/user.decorator";
import { Account } from "src/table/entity/account.entity";
import { ArticleService } from "src/table/service/article.service";
import { Forbidden, NotFound } from "src/type/http";
import { CryptoService } from "src/util/crypto.service";
import { PostArticleDto } from "./dto/postArticle.dto";


@Controller("api/account/article")
@ApiTags("文章操作")
@UseGuards(AuthGuard("jwt"), userRuleGuard([ruleConfig.email]))
export class AccountArticleController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly cryptoService: CryptoService,
    ) { }
    @ApiOperation({ summary: "发布文章" })
    @Post("publish")
    @UseInterceptors(FileInterceptor("file"))
    public async publishArticle(
        @Body() { title, tags, isVisible, subTitle, cover, type }: PostArticleDto,
        @User() user: Account,
        @UploadedFile("file") file: Express.Multer.File
    ) {
        const hash_key = this.cryptoService.createUid();
        const entity = this.articleService.article.create({
            hash_key,
            account: user,
            title,
            subTitle,
            isVisible,
            tags: await this.articleService.makeTags(tags.split(",")),
            type
        });
        const context = file.buffer.toString("utf8");
        await this.articleService.article.save(entity);
        this.articleService.saveArticleContext(hash_key, context, cover);
        return hash_key;
    }

    //修改文章发布json的修改包，之后让审核通过查看
    @ApiOperation({ summary: "修改文章" })
    @Post("update/:hash_key")
    public async updateArticle(
        @Param("hash_key") hash_key: string,
        @Body() body,
        @User() user: Account
    ) {
        const article = await this.articleService.article.findOne({ where: { hash_key }, relations: ["account"] })
        if (!article) throw NotFound
        if (article.account.uid !== user.uid) throw Forbidden
    }
    @ApiOperation({ summary: "设置文章状态" })
    @Get("setArticleVisible/:hash_key/:status")
    public async(
        @Param("status") statis: string,
        @Param("hash_key") hash_key: string,
        @User() user: Account
    ) { }

    @ApiOperation({ summary: "删除文章" })
    @Get("remove/:hash_key")
    public async removeArticle(
        @Param("hash_key") hash_key: string,
        @User() user: Account
    ) {
        const article = await this.articleService.findMyArticleByHashKey(hash_key, user);
        await this.articleService.article.remove(article);
    }

    @ApiOperation({ summary: "创建合集" })
    @Post("makeAnthology")
    public async makeAnthology(
        @User() user: Account
    ) { }

    @ApiOperation({ summary: "将文章加入合集" })
    @Get("addAnthology/:hash_key/:article_key")
    public async addAnthology(
        @Param("hash_key") hash_key: string,
        @Param("article_key") article_key: string,
        @User() user: Account
    ) { }

    @ApiOperation({ summary: "合集内容排序" })
    @Get("articleSort/:hash_key/:order")
    public async articleSort(
        @Param("hash_key") hash_key: string,
        @Param("order") order: string,
        @User() user: Account
    ) { }

    @ApiOperation({ summary: "将文章移出合集" })
    @Get("moveArticle/:hash_key")
    public async moveArticle(
        @Param("hash_key") hash_key: string,
        @User() user: Account
    ) { }

    @ApiOperation({ summary: "删除合集" })
    @Get("removeAnthology/:hash_key")
    public async removeAnthology(
        @Param("hash_key") hash_key: string,
        @User() user: Account
    ) { }

    @ApiOperation({ summary: "修改合集" })
    @Post("updateAnthology")
    public async updateAnthology(
        @Body() body,
        @User() user: Account
    ) { }

    @ApiOperation({ summary: "删除文章评论" })
    @Get("deleteIssue/:hash_key/:issue_id")
    public async deleteIssue(
        @Param("hash_key") hash_key: string,
        @Param("issue_id") issue_id: string,
        @User() user: Account
    ) { }


}