import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account } from "../entity/account.entity";
import { Dynamic } from "../entity/dynamic.entity";

@Injectable()
export class DynamicService {
    constructor(
        @InjectRepository(Account)
        private readonly account: Repository<Dynamic>,
        @InjectRepository(Dynamic)
        public readonly dynamic: Repository<Dynamic>,
        
    ) { }
}