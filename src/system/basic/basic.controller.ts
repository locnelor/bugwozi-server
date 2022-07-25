import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { KGNB } from "src/table/entity/KGNB.entity";
import { KGNBService } from "src/table/service/kgnb.service";
import { Repository } from "typeorm";



@Controller("api/basic")
@ApiTags("")
export class BasicController {
    constructor(
        private readonly kgnbService: KGNBService
    ) { }

    @Get("getKGNB")
    @ApiOperation({ summary: "获取阔哥牛逼语录" })
    public async getKGNB() { }
}