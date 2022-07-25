import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { Forbidden, NotFound } from "src/type/http";
import { CryptoService } from "src/util/crypto.service";
import { PathService } from "src/util/path.service";
import { Repository } from "typeorm";
import { Account } from "../entity/account.entity";
import { Anthology } from "../entity/anthology.entity";
import { Article } from "../entity/article.entity";
import { ArticleFolder } from "../entity/articleFolder.entity";
import { ArticleFolderColumn } from "../entity/articleFolderColumn.entity";
import { ArticleTag } from "../entity/articleTag.entity";


@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article)
        public readonly article: Repository<Article>,

        @InjectRepository(Anthology)
        public readonly anthology: Repository<Anthology>,

        @InjectRepository(Account)
        private readonly account: Repository<Account>,

        @InjectRepository(ArticleTag)
        public readonly tag: Repository<ArticleTag>,

        @InjectRepository(ArticleFolder)
        public readonly folder: Repository<ArticleFolder>,

        @InjectRepository(ArticleFolderColumn)
        public readonly folderColumn: Repository<ArticleFolderColumn>,

        private readonly cryptoService: CryptoService,
        private readonly pathService: PathService
    ) { }
    //保存文章内容、图片
    public saveArticleContext(hash_key: string, context: string, cover?: string) {
        const path = this.pathService.getArticleContext(hash_key);
        const raw = JSON.parse(context);
        const imagePath = this.pathService.getArticleImageDir(hash_key, true);
        const images = readdirSync(imagePath).reduce((acc, name) => {
            acc[name] = true;
            return acc;
        }, {} as { [k in string]: boolean });
        if (!!raw.entityMap) {
            for (const key in raw.entityMap) {
                const entity = raw.entityMap[key];
                if (entity.type === "IMAGE") {
                    const { base64, type, url } = entity.data;
                    if (!!url) images[url.split("/")[1]] = false;
                    if (!!base64) {
                        const buffer = Buffer.from(base64.slice(base64.indexOf(",") + 1), "base64");
                        const filename = this.cryptoService.createUid();
                        writeFileSync(this.pathService.getArticleImagePath(hash_key, filename), buffer);
                        raw.entityMap[key].data = {
                            type,
                            url: hash_key + "/" + filename
                        }
                    }
                }
            }
        }
        //删除无用图片
        for (const key in images) {
            if (images[key]) {
                const path = this.pathService.getArticleImagePath(hash_key, key, false);
                unlinkSync(path);
            }
        }
        writeFileSync(path, JSON.stringify(raw));
        if (!!cover) {
            try {
                const buffer = Buffer.from(cover.slice(cover.indexOf(",") + 1), "base64");
                writeFileSync(this.pathService.getArticleCover(hash_key, false), buffer);
            } catch (e) { }
        }
    }

    //创建文章标签，
    public async makeTags(tags: string[]) {
        const arr = new Array(tags.length);
        for (const key in tags) {
            const name = tags[key]
            const result = await this.tag.findOne({ where: { name } });
            if (!!result) {
                arr[key] = result;
            } else {
                const entity = this.tag.create({ name });
                arr[key] = await this.tag.save(entity);
            }
        }
        return arr;
    }

    public async findMyArticleByHashKey(hash_key: string, user: Account) {
        const article = await this.findArticleByHashKey(hash_key);
        if (article.account.uid !== user.uid) throw Forbidden
        return article
    }
    public async findArticleByHashKey(hash_key: string) {
        const article = await this.article.findOne({ where: { hash_key }, relations: ["account"] });
        if (!article) throw NotFound;
        return article
    }

    public getArticleContext(hash_key: string) {
        const path = this.pathService.getArticleContext(hash_key, false);
        return readFileSync(path, "utf8");
    }

    // public getFolderKey(user: Account, article: Article) {
    //     return `${user.uid}_${article.id}`
    // }

    // public async has(
    //     user: Account,
    //     hash_key: string
    // ) {
    //     const article = await this.article.findOne({
    //         where: {
    //             hash_key
    //         },
    //         relations: ["account"]
    //     });
    //     if (!article) return null;
    //     const hash = this.getFolderKey(user, article);
    //     const column = await this.folderColumn.findOne({
    //         where: {
    //             hash_key: hash
    //         }
    //     });
    //     return {
    //         column,
    //         article
    //     }
    // }
    // public async remove(
    //     column: ArticleFolderColumn,
    //     article: Article
    // ) {
    //     await this.folderColumn.remove(column);
    // }

    // public async createColumn(
    //     article: Article,
    //     user: Account,
    //     articleFolder: ArticleFolder
    // ) {
    //     const hash_key = this.getFolderKey(user, article);
    //     const entity = this.folderColumn.create({
    //         hash_key,
    //         article,
    //         articleFolder
    //     });
    //     await this.folderColumn.insert(entity);
    // }


}