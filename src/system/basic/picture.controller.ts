import { Controller, Get, Param, Res, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { createReadStream, createWriteStream, existsSync, readFileSync } from "fs";
import { } from "images"
import { ACCOUNT_ARTICLE_MAX_WIDTH } from "src/config/fileConfig";
import { JPG, ResHeaderInterceptor } from "src/filder/resHeader.interceptor";
import { NotFound } from "src/type/http";
import { CanvasService } from "src/util/canvas.service";
import { PathService } from "src/util/path.service";

@Controller("api/basic/picture")
@ApiTags("picture interface of the website")
export class PictureController {
    constructor(
        private readonly canvasService: CanvasService,
        private readonly pathService: PathService
    ) { }

    @Get("avatar/:hash_key/:size")
    @ApiOperation({ summary: "get user avatar" })
    @UseInterceptors(new ResHeaderInterceptor(JPG))
    public async getAvatar(
        @Param("hash_key") hash_key: string,
        @Param("size") size: Number,
        @Res() res: Response
    ) {
        size = size > ACCOUNT_ARTICLE_MAX_WIDTH ? 50 : Number(size);
        size = size < 50 ? 50 : size;
        const path = this.pathService.getUserAvatarPath(hash_key, false);
        const imagePath = existsSync(path) ? path : this.pathService.defaultAccountIconPath;
        const result = this.canvasService.getFromPath(imagePath).toBuffer();
        res.send(result);
    }

    @Get("article/cover/:hash_key")
    @ApiOperation({ summary: "获取文章封面" })
    @UseInterceptors(new ResHeaderInterceptor(JPG))
    public async(
        @Param("hash_key") hash_key: string,
        @Res() res: Response
    ) {
        const path = this.pathService.getArticleCover(hash_key, false);
        if (!existsSync(path)) throw NotFound;
        createReadStream(path).pipe(res)
    }

    @Get("article/:hash_key/:name")
    @ApiOperation({ summary: "获取文章图片" })
    @UseInterceptors(new ResHeaderInterceptor(JPG))
    public async getArticleImage(
        @Param("hash_key") hash_key: string,
        @Param("name") name: string,
        @Res() res: Response
    ) {
        const path = this.pathService.getArticleImagePath(hash_key, name, false);
        if (!existsSync(path)) throw NotFound;
        createReadStream(path).pipe(res)
    }
}