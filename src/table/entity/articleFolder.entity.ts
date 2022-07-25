import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { ArticleFolderColumn } from "./articleFolderColumn.entity";


@Entity("article_folder")
export class ArticleFolder {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Account, type => type.folders)
    account: Account

    @OneToMany(() => ArticleFolderColumn, type => type.articleFolder)
    columns: ArticleFolderColumn[]

    @Column({
        default: 0
    })
    count: number

    @CreateDateColumn({
        type: "timestamp"
    })
    create_time: Date
}