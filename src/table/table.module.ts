import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AxiosService } from "src/util/axios/axios.service";
import { CryptoService } from "src/util/crypto.service";
import { PathService } from "src/util/path.service";
import { Account } from "./entity/account.entity";
import { Anthology } from "./entity/anthology.entity";
import { Article } from "./entity/article.entity";
import { ArticleFolder } from "./entity/articleFolder.entity";
import { ArticleFolderColumn } from "./entity/articleFolderColumn.entity";
import { ArticleTag } from "./entity/articleTag.entity";
import { Dynamic } from "./entity/dynamic.entity";
import { Fans } from "./entity/fans.entity";
import { Issue } from "./entity/issue.entity";
import { KGNB } from "./entity/KGNB.entity";
import { Profile } from "./entity/profile.entity";
import { AccountService } from "./service/account.service";
import { ArticleService } from "./service/article.service";
import { DynamicService } from "./service/dynamic.service";
import { IssueService } from "./service/issue.service";
import { KGNBService } from "./service/kgnb.service";


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            Account,
            Profile,
            Article,
            ArticleFolder,
            ArticleFolderColumn,
            ArticleTag,
            Dynamic,
            Issue,
            Fans,
            Anthology,
            KGNB
        ]),
    ],
    providers: [
        AccountService,
        ArticleService,
        DynamicService,
        IssueService,
        AxiosService,
        PathService,
        CryptoService,
        KGNBService
    ],
    exports: [
        AccountService,
        ArticleService,
        DynamicService,
        IssueService,
        KGNBService
    ]
})
export class TableModule { }