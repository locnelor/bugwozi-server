import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SystemModule } from './system/system.module';
import { TableModule } from './table/table.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: process.env.orm_type as any,
        host: process.env.orm_host,
        port: Number(process.env.orm_port),
        username: process.env.orm_username,
        password: process.env.orm_password,
        database: process.env.orm_database,
        dropSchema: process.env.orm_dropSchema === "true",
        synchronize: process.env.orm_synchronize === "true",
        logging: process.env.orm_logging === "true",
        migrationsRun: process.env.orm_migrationsRun === "true",
        charset: "utf8",
        entities: ["./**/*.entity.js"]
      })
    }),
    TableModule,
    SystemModule
  ]
})
export class AppModule { }
