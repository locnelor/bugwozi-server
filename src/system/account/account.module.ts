import { Module } from "@nestjs/common";
import { CryptoService } from "src/util/crypto.service";
import { AccountArticleController } from "./article.controller";
import { AccountBasicController } from "./basic.controller";


@Module({
    controllers: [
        AccountArticleController,
        AccountBasicController
    ],
    providers: [
        CryptoService
    ]
})
export class AccountModule { }