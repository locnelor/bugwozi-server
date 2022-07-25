import { Module } from "@nestjs/common";
import { AccountModule } from "./account/account.module";
import { AuthModule } from "./auth/auth.module";
import { BasicModule } from "./basic/basic.module";
import { FileModule } from "./file/file.module"


@Module({
    imports: [
        AuthModule,
        AccountModule,
        BasicModule,
        FileModule
    ]
})
export class SystemModule { }