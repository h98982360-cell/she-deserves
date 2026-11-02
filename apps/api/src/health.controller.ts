import { Controller, Get } from "@nestjs/common";
import { DatabaseService } from "./database.service";

@Controller("health")
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  async getHealth() {
    const database = await this.database.check();
    return { status: "ok", database };
  }
}
