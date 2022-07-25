import { Injectable } from "@nestjs/common";
import { createWriteStream } from "fs";
import { get, post, Headers } from "request"
import { Gitee } from "./gitee";
import { Github } from "./github";

export type options = {
    url: string,
    method: "GET" | "POST",
    body?: any,
    params?: { [k in string]: string },
    headers?: Headers,
}
@Injectable()
export class AxiosService {
    public readonly github = new Github(this.request);
    public readonly gitee = new Gitee(this.request);

    private request<T>(
        {
            url,
            method,
            params = {},
            headers,
            body
        }: options
    ) {
        const axios = method === "GET" ? get : post;
        const target = Object.keys(params).reduce((str, key) => str.replace(`:${key}`, params[key]), url);
        return new Promise<T>((resolve, rejects) => {
            axios(target, {
                headers: Object.assign({
                    accept: 'application/json',
                    'User-Agent': 'node.js'
                }, headers),
                body
            }, (err, res, body) => {
                if (!!err) return rejects(err)
                try {
                    const json = JSON.parse(body);
                    if (json.error) return rejects(json);
                    return resolve(json);
                } catch (e) { }
                if (typeof body === "object") {
                    if (!!body.error) return rejects(body);
                }
                resolve(body);
            });
        });
    }

    public download(url: string, path) {
        return new Promise<boolean>((resolve, rejects) => {
            const out = createWriteStream(path)
            get(url).pipe(out)
            out.on("error", (err) => {
                resolve(false)
            })
            out.on("finish", () => {
                resolve(true);
            })
        })

    }
}
