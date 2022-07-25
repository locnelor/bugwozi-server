import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { Request, Response } from "express";
import { tokenMaxAge } from "src/config/cookie";
import { Profile } from "src/table/entity/profile.entity";
import { CryptoService } from "src/util/crypto.service";
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly cryptoService: CryptoService
    ) { }
    public getToken(
        profile: Profile,
        req: Request,
        res?: Response
    ) {
        const token = this.jwtService.sign({
            type: "signed",
            hash_key: profile.account.hash_key,
            crypto: this.cryptoService.cryptoPassword(profile.password),
            allow: this.cryptoService.cryptoPassword(req.ip)
        });
        console.log("auth.service    allow ip = " + req.ip)
        if (!res) return token;
        res.cookie("token", token, {
            expires: new Date(Date.now() + tokenMaxAge)
        });
        res.redirect(process.env.client_home);
    }
}