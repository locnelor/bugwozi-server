import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hasRule, ruleConfig } from "src/guards/rule.guard";
import { Forbidden } from "src/type/http";
import { AxiosService } from "src/util/axios/axios.service";
import { CryptoService } from "src/util/crypto.service";
import { PathService } from "src/util/path.service";
import { Repository } from "typeorm";
import { Account } from "../entity/account.entity";
import { Fans } from "../entity/fans.entity";
import { Profile } from "../entity/profile.entity";


@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        public readonly account: Repository<Account>,
        @InjectRepository(Profile)
        public readonly profile: Repository<Profile>,
        @InjectRepository(Fans)
        public readonly fans: Repository<Fans>,
        private readonly crypto: CryptoService,
        private readonly axios: AxiosService,
        private readonly path: PathService
    ) { }

    public isAdmin(profile: Profile) {
        return hasRule(profile.rule, [ruleConfig.admin, ruleConfig.leader])
    }


    public async saveAvatar(
        user: Account,
        {
            url = null
        }
    ) {
        const path = this.path.getUserAvatarPath(user.hash_key, true);
        if (!!url) {
            return await this.axios.download(url, path)
        }
    }

    public async createAccount({
        user_name = "未设置用户名",
        gitee_id = null,
        github_id = null,
        email = null
    }) {
        const profile = this.profile.create({
            gitee_id,
            github_id,
            email,
            password: this.crypto.createUid()
        });
        const account = this.account.create({
            user_name,
            hash_key: this.crypto.createUid()
        });
        profile.account = account;
        await this.profile.save(profile);
        account.profile = profile;
        await this.account.save(account);
        return profile;
    }

    public getFansHashKey(user: Account, to: Account) {
        return user.uid + "_" + to.uid;
    }
    //query whether to follow
    public async hasFans(
        user: Account,
        hash_key: string
    ) {
        const follow = await this.account.findOne({
            where: {
                hash_key
            }
        });
        if (!follow) throw Forbidden
        const hash = this.getFansHashKey(user, follow)
        const fans = await this.fans.findOne({
            where: {
                hash_key: hash
            }
        });
        return {
            follow,
            fans
        }
    }
}