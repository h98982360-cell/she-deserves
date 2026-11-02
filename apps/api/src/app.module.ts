import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ChatGateway } from "./chat.gateway";
import { DatabaseService } from "./database.service";
import { HealthController } from "./health.controller";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ["apps/api/.env", ".env"] })],
  controllers: [HealthController],
  providers: [ChatGateway, DatabaseService],
})
export class AppModule {}
