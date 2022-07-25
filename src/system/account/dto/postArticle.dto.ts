import { IsBooleanString, IsString, Length } from "class-validator"



export class PostArticleDto {
    @Length(4, 30, {
        message: "title length between 4-40"
    })
    title: string

    @Length(0, 100)
    subTitle: string

    cover: string

    tags: string

    @IsString()
    type: string

    @IsBooleanString()
    isVisible: boolean
}