import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity("kgnb")
export class KGNB {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    context: string

    @CreateDateColumn({
        type: "timestamp"
    })
    create_time: Date
}