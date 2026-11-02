import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool | null;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    this.pool = connectionString ? new Pool({ connectionString }) : null;
  }

  async check(): Promise<"connected" | "not_configured"> {
    if (!this.pool) {
      return "not_configured";
    }

    await this.pool.query("SELECT 1");
    return "connected";
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool?.end();
  }
}
