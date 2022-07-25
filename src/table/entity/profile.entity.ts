import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";

@Entity("profile")
export class Profile {
    @PrimaryGeneratedColumn()
    pid: number

    @OneToOne(() => Account, type => type.profile)
    account: Account

    @Column({
        unique: true,
        nullable: true
    })
    gitee_id: number

    @Column({
        unique: true,
        nullable: true
    })
    github_id: number

    @Column({
        unique: true,
        nullable: true
    })
    email: string

    @Column({
        nullable: true
    })
    password: string

    @Column({
        default: 0
    })
    rule: number
}