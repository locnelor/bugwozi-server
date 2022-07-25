import { Account } from "src/table/entity/account.entity"

//游客模式 | 
export type authSignType = "notSign" | "signed"
export interface authSign {
    type: authSignType //登录类型
    hash_key: string //用户id
    crypto: string // 密码
    allow: string // 允许ip
    account?: Account
}