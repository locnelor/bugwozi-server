import { Module } from "@nestjs/common";
import { CanvasService } from "src/util/canvas.service";
import { PathService } from "src/util/path.service";
import { BasicArticleController } from "./article.controller";
import { BasicController } from "./basic.controller";
import { PictureController } from "./picture.controller";



@Module({
    controllers: [
        PictureController,
        BasicArticleController,
        BasicController
    ],
    providers: [CanvasService, PathService]
})
export class BasicModule { }