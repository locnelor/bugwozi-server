import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { writeFileSync } from "fs";
import { User } from "src/guards/user.decorator";
import { Account } from "src/table/entity/account.entity";
import { CryptoService } from "src/util/crypto.service";
import { PathService } from "src/util/path.service";


@Controller()
export class FileController {
    constructor(
        private readonly pathService: PathService,
        private readonly cryptoService: CryptoService
    ) { }

//     @ApiOperation({ summary: "文章上传图片" })
//     @Post("upload")
//     @UseInterceptors(FileInterceptor("file"))
//     public async upload(
//         @UploadedFile("file") file: Express.Multer.File,
//         @User() user: Account
//     ) {
//         const name = file.originalname;
//         const suffix = name.slice(name.lastIndexOf("."));
//         const filename = this.cryptoService.createUid() + suffix;
//         writeFileSync(this.pathService.getUserArticlePath(user.hash_key, filename), file.buffer);
//     }
}