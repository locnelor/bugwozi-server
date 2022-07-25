import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { KGNB } from "../entity/KGNB.entity";



@Injectable()
export class KGNBService {
    constructor(
        @InjectRepository(KGNB)
        public readonly KGNB: Repository<KGNB>
    ) { }
}