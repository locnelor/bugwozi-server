import { options } from "./axios.service";

export type tokenResult = {
    access_token: string
    token_type: "bearer"
}
export class Gitee {
    constructor(
        private readonly axios: <T>({ url, method, params, headers, body }: options) => Promise<T>
    ) { }
    private readonly api = "https://gitee.com/api/v5/";
    private getUrl(url: string) {
        return this.api + url;
    }
    public getGiteeToken(code: string) {
        const url = `https://gitee.com/oauth/token?grant_type=authorization_code&code=${code}&client_id=:client_id&client_secret=:client_secret&redirect_uri=:redirect_uri`;
        return this.axios<tokenResult>({
            url,
            method: "POST",
            params: {
                client_id: process.env.gitee_client_id,
                client_secret: process.env.gitee_client_secret,
                redirect_uri: process.env.gitee_redirect_uri
            }
        })
    }
    public getGiteeUserInfo(token: string) {
        const url = this.getUrl("user?access_token=" + token);
        return this.axios<{
            login: string,
            name: string,
            avatar_url: string,
            id: number
        }>({
            url,
            method: "GET"
        })
    }
}