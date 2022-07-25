import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { Issue } from "./issue.entity";
import { ArticleTag } from "./articleTag.entity";
import { Anthology } from "./anthology.entity";

export type article_status = "inspect" | "success" | "return"
@Entity("article")
export class Article {
    @OneToMany(() => Issue, type => type.article)
    issues: Issue[]

    @ManyToOne(() => Account, type => type.articles)
    account: Account

    @ManyToMany(() => ArticleTag, type => type.articles)
    tags: ArticleTag[]

    @ManyToOne(() => Anthology, type => type.articles)
    anthology: Anthology

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    hash_key: string

    @Column()
    title: string

    @Column()
    type: string

    @Column({
        type: "varchar",
        length: 110
    })
    subTitle: string

    @Column()
    isVisible: boolean

    @Column({
        comment: "inspect待审核 success成功 rejects拒绝",
        default: "inspect",
        select: false
    })
    status: article_status

    @Column({
        comment: "return reason",
        nullable: true,
        select: false
    })
    reason: string

    @Column({
        default: 0,
        comment: "查看数"
    })
    views: number

    @CreateDateColumn({
        type: "timestamp"
    })
    create_time: Date
}