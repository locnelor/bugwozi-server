import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"
import { AxiosService } from "src/util/axios/axios.service";
import { CryptoService } from "src/util/crypto.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.secret
            })
        })
    ],
    providers: [CryptoService, AxiosService, JwtStrategy, AuthService],
    controllers: [AuthController],
    exports: [JwtStrategy]
})
export class AuthModule { }