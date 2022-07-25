import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import * as images from "images";
import { Duplex } from "stream"
import { FILE_TYPE, Image } from "images";
class Canvas {
    constructor(
        private image: Image
    ) { }
    public getStream(type: FILE_TYPE = "jpg") {
        const stream = new Duplex();
        const data = this.image.encode(type);
        stream.push(data);
        stream.push(null)
        return stream;
    }
    public resize(width: number, height?: number) {
        this.image = this.image.resize(width, height);
        return this;
    }
    public resize_max_width(max_width: number) {
        const { width } = this.image.size();
        if (width > max_width) this.image = this.image.resize(max_width);
        return this;
    }
    public toBuffer(type: FILE_TYPE = "jpg") {
        return this.image.encode(type);
    }
    public save(path: string, type: FILE_TYPE = "jpg") {
        this.image.save(path, type);
        return true;
    }
}
@Injectable()
export class CanvasService {
    public getFromPath(path: string) {
        return new Canvas(images(readFileSync(path)))
    }
    public getFromBuffer(data: Buffer) {
        return new Canvas(images(data))
    }
    public getFromBase64(data: string) {
        return new Canvas(images(Buffer.from(data, "base64")))
    }
}