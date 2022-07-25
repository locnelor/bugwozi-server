import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express";
import { Strategy } from "passport-jwt"
import { JwtService } from "@nestjs/jwt"
import { authSign } from "./authSign.interface";
import { AccountService } from "src/table/service/account.service";
import { CryptoService } from "src/util/crypto.service";
import { Forbidden } from "src/type/http";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private getDefaultToken() {
        return this.jwtService.sign({
            type: "notSign",
        })
    }
    constructor(
        private readonly jwtService: JwtService,
        private readonly accountService: AccountService,
        private readonly cryptoService: CryptoService
    ) {
        super({
            jwtFromRequest: (req: Request) => {
                if (!req.headers.cookie) return this.getDefaultToken();
                const { token } = req.headers.cookie.split(";").reduce((acc, label) => {
                    const split = label.split("=");
                    acc[split[0].trim()] = split[1];
                    return acc;
                }, {} as { token?: string });
                return !!token ? token : this.getDefaultToken();
            },
            ignoreExpiration: true,
            secretOrKey: "sbppk",
        })
    }

    async validate({
        type,
        hash_key,
        crypto,
        allow
    }: authSign) {
        console.log(type, hash_key, crypto, allow);
        if (type === "notSign" || !hash_key) return null;
        const account = await this.accountService.account.findOne({
            where: {
                hash_key
            },
            relations: ["profile"]
        })
        if (!account) return null;
        if (this.cryptoService.cryptoPassword(account.profile.password) !== crypto) {
            throw Forbidden
        }
        return {
            account,
            type,
            hash_key,
            crypto,
            allow
        }
    }
}
