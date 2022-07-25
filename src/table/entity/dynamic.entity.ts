import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { Issue } from "./issue.entity";


export type dynamic_action = "article" | "issue" | "text"
@Entity("dynamic")
export class Dynamic {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Account, type => type.dynamics)
    account: Account

    @Column({
        comment: "article发布文章 issue评论 text发布动态"
    })
    action: dynamic_action

    @OneToMany(() => Issue, type => type.dynamic)
    issues: Issue[]

    @Column()
    title: string

    @Column()
    context: string

    @CreateDateColumn({
        type: "timestamp"
    })
    create_time: Date
}