import { Injectable } from "@nestjs/common";
import { createHash } from "crypto"


@Injectable()
export class CryptoService {
    public md5(str: string | Buffer) {
        return createHash("md5").update(str).digest("hex")
    }
    public sha1(str: string) {
        return createHash("sha1").update(str).digest("hex")
    }
    public createUid(email = "") {
        //创建uid
        return this.md5(this.sha1(`${Math.random()}_${Date.now()}_${email}`))
    }
    public cryptoPassword(password: string) {
        //加密密码
        return this.md5(this.sha1(password))
    }
    public createHashId(...args: string[]) {
        return this.md5(args.sort().join("_"))
    }
}