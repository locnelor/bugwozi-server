import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account } from "../entity/account.entity";
import { Article } from "../entity/article.entity";
import { Dynamic } from "../entity/dynamic.entity";
import { Issue } from "../entity/issue.entity";

@Injectable()
export class IssueService {
    constructor(
        @InjectRepository(Account)
        private readonly account: Repository<Account>,
        @InjectRepository(Issue)
        public readonly issue: Repository<Issue>,
        @InjectRepository(Article)
        private readonly article: Repository<Article>,
        @InjectRepository(Dynamic)
        private readonly dynamic: Repository<Dynamic>
    ) { }
    
}