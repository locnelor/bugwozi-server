import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article.entity";


@Entity("articleTag")
export class ArticleTag {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => Article, type => type.tags)
    @JoinTable()
    articles: Article[]

    @Column({
        unique: true
    })
    name: string


}