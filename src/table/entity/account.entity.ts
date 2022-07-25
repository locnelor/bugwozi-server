import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article.entity";
import { ArticleFolder } from "./articleFolder.entity";
import { Dynamic } from "./dynamic.entity";
import { Fans } from "./fans.entity";
import { Profile } from "./profile.entity";


@Entity("account")
export class Account {
    @PrimaryGeneratedColumn()
    uid: number

    @OneToMany(() => ArticleFolder, type => type.account)
    folders: ArticleFolder[]

    @OneToOne(() => Profile, type => type.account)
    @JoinColumn()
    profile: Profile

    //粉丝列表
    @OneToMany(() => Fans, type => type.follow)
    fans: Fans[]

    //关注列表
    @OneToMany(() => Fans, type => type.fans)
    follow: Fans[]

    @OneToMany(() => Dynamic, type => type.account)
    dynamics: Dynamic[]

    @OneToMany(() => Article, type => type.account)
    articles: Article[]

    @Column({
        unique: true
    })
    hash_key: string

    @Column({
        default: "未设置用户名"
    })
    user_name: string

    @Column({
        nullable: true
    })
    user_info: string



    @CreateDateColumn({
        type: "timestamp"
    })
    create_time: Date

}