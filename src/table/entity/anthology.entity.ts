import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { Article } from "./article.entity";

@Entity("anthology")
export class Anthology {
    @ManyToOne(() => Account)
    account: Account

    @OneToMany(() => Article, type => type.anthology)
    articles: Article[]

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    hash_key: string

    @Column({
        comment: "合集名称"
    })
    title: string

    @Column({
        comment: "info"
    })
    info: string

    @CreateDateColumn({
        type: "timestamp"
    })
    create_time: Date
}