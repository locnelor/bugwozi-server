import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, readdirSync, renameSync, rmdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";

@Injectable()
export class PathService {
    public mkdirPath(path: string, create = true) {
        //创建目录
        if (!create) return path;
        const tmp = join(path, "..");
        if (!existsSync(tmp)) {
            this.mkdirPath(tmp);
        }
        if (!existsSync(path)) mkdirSync(path);
        return path;
    }
    public unlinkDir(path: string) {
        //删除目录
        if (!existsSync(path)) return;
        const stat = statSync(path);
        if (stat.isFile()) {
            unlinkSync(path);
            return;
        }
        const list = readdirSync(path);
        list.forEach(name => {
            const target = join(path, name);
            const targetStat = statSync(target);
            if (targetStat.isFile()) {
                unlinkSync(target);
            } else {
                this.unlinkDir(target);
            }
        })
        rmdirSync(path);
    }
    public moveDir(path: string, out: string) {
        //移动目录
        if (!existsSync(path)) return this.mkdirPath(out);
        if (!existsSync(out)) this.mkdirPath(out);
        const list = readdirSync(path);
        for (const name of list) {
            const file_path = join(path, name);
            const stat = statSync(file_path);
            const out_path = join(out, name);
            if (stat.isFile()) {
                renameSync(file_path, out_path);
                continue;
            }
            this.moveDir(file_path, out_path);
        }
        rmdirSync(path);
    }
    private readonly assets = join(process.cwd(), "public");

    private readonly user = join(this.assets, "account");

    //获取用户根目录
    public getUserRoot(hash_key: string) {
        return join(this.user, hash_key);
    }
    //获取用户头像路径
    public getUserAvatarPath(hash_key: string, create = true) {
        return join(this.mkdirPath(this.getUserRoot(hash_key), create), "avatar");
    }

    //默认头像地址
    public readonly defaultAccountIconPath = join(this.assets, "defaultAccountIcon.jpg");

    //文章根目录
    private readonly articleRoot = join(this.assets, "article")

    //获取文章路径
    public getArticlePath(hash_key: string) {
        return join(this.articleRoot, hash_key)
    }
    //获取文章文件
    public getArticleContext(hash_key: string, create = true) {
        return join(this.mkdirPath(this.getArticlePath(hash_key), create), "context")
    }
    //文章图片目录
    public getArticleImageDir(hash_key: string, create = false) {
        return this.mkdirPath(join(this.getArticlePath(hash_key), "image"), create);
    }
    //获取文章图片路径
    public getArticleImagePath(hash_key: string, imgId: string, create = true) {
        return join(this.getArticleImageDir(hash_key, create), imgId);
    }
    //获取文章封面文件
    public getArticleCover(hash_key: string, create = true) {
        return join(this.mkdirPath(this.getArticlePath(hash_key), create), "cover");
    }
}
