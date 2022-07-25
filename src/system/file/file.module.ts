import { Module } from "@nestjs/common"
import { CryptoService } from "src/util/crypto.service";
import { PathService } from "src/util/path.service";
import { FileController } from "./file.controller";
import { FileService } from "./file.service"
@Module({
    controllers: [FileController],
    providers: [PathService, FileService, CryptoService]
})
export class FileModule { }