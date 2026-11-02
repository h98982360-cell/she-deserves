import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    methods: ["GET", "OPTIONS"],
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT ?? 4000);
}

void bootstrap();
