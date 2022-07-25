import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { Article } from "./article.entity";
import { Dynamic } from "./dynamic.entity";


@Entity("issue")
export class Issue {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Article, type => type.issues)
    article: Article

    @ManyToOne(() => Dynamic, type => type.issues)
    dynamic: Dynamic

    @ManyToOne(() => Account)
    account: Account

    @ManyToOne(() => Issue, type => type.children)
    self: Issue

    @OneToMany(() => Issue, type => type.self)
    children: Issue[]

    @Column({
        default: 0
    })
    reply_count: number

    @Column()
    context: string
}