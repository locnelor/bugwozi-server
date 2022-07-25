import { Injectable } from "@nestjs/common";


@Injectable()
export class EmailUtilService {
    private createCode() {
        const code = new Array(4)
            .fill(0)
            .map(() => Math.floor(Math.random() * 10) % 10)
            .join("");
        return code;
    }
    public async sendEmail(email: string) {
        const code = this.createCode();
        return code
    }
}