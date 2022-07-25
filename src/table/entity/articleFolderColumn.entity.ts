import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article.entity";
import { ArticleFolder } from "./articleFolder.entity";


@Entity("article_folder_column")
export class ArticleFolderColumn {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    hash_key: string

    @ManyToOne(() => ArticleFolder, type => type.columns)
    articleFolder: ArticleFolder

    @ManyToOne(() => Article)
    article: Article

    @CreateDateColumn({
        type: "timestamp"
    })
    create_time: Date
}