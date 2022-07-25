import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";


@Entity("fans")
export class Fans {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        comment: "关注人id_被关注人id"
    })
    hash_key: string

    //关注人
    @ManyToOne(() => Account)
    fans: Account

    //被关注人
    @ManyToOne(() => Account)
    follow: Account

    @CreateDateColumn({
        type: "timestamp"
    })
    create_date: Date
}