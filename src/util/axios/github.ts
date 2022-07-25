import { options } from "./axios.service"

export class Github {
    constructor(
        private readonly axios: <T>({ url, method, params, headers, body }: options) => Promise<T>
    ) { }
    private readonly api = "https://api.github.com/"
    private getUrl(url: string) {
        return this.api + url;
    }

    public getGithubToken(code: string): Promise<{ access_token: string, token_type: string }> {
        return this.axios<string>({
            url: `https://github.com/login/oauth/access_token?client_id=:client_id&client_secret=:client_secret&code=${code}`,
            method: "POST",
            params: {
                client_id: process.env.github_client_id,
                client_secret: process.env.github_client_secret
            }
        }).then((e: string) => JSON.parse(e)).catch((e) => {
            return null;
        });
    }

    //获取用户信息
    public getGithubUserInfo(token: string) {
        return this.axios({
            url: this.getUrl("user"),
            method: "GET",
            headers: {
                Authorization: `token ${token}`
            }
        }).catch(() => null)
    }


}