import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Account } from "src/table/entity/account.entity";

export const ruleConfig = {
    initial: 1, // 初始化账户 | 为0则代表封禁用户
    gitee: 1 << 1,//绑定了gitee
    github: 1 << 2,//绑定了github
    email: 1 << 3,//绑定了邮箱
    admin: 1 << 4,//管理员
    leader: 1 << 5,//站长
}


export class RuleGuard implements CanActivate {
    constructor(
        private readonly callback: (entity: Account) => boolean
    ) { }
    canActivate(
        context: ExecutionContext
    ) {
        const req = context.switchToHttp().getRequest()
        const user = req.user.account
        return this.callback(user)
    }
    public static create = (callback: (entity: Account) => boolean) => new RuleGuard(callback)
}

//all
export const allGuard = RuleGuard.create(() => true);
//所有用户
export const allUserGuard = RuleGuard.create((user) => !!user);

//检测权限
export const hasRule = (userRule: number, rules: number[]) => {
    const rule = rules.reduce((acc, value) => acc | value, 0);
    if (userRule % 2 === 0) return false;
    return ((userRule & rule) === rule);
}
//权限守卫
export const userRuleGuard = (rules: number[]) => RuleGuard.create((user) => {
    if (!!user) {
        const userRule = user.profile.rule
        const result = hasRule(userRule, rules);
        return result;
    }
    return false;
})