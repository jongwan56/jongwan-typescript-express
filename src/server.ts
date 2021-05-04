import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { useContainer, createConnection } from "typeorm";
import { env } from "./env";
import { logger } from "./utils/Logger";

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
  }

  public async init(): Promise<void> {
    await this.createDatabaseConnection();

    const { port, apiPrefix } = env.app;

    this.app.listen(port, () => {
      logger.info(`API server is running on http://localhost:${port}${apiPrefix}`);
    });
  }

  private async createDatabaseConnection(): Promise<void> {
    useContainer(Container);

    const { host, port, username, password, database, synchronize, logging } = env.database;

    await createConnection({
      type: "postgres",
      host,
      port,
      username,
      password,
      database,
      synchronize,
      logging,
      entities: [`${__dirname}/entities/*.{ts,js}`],
    });

    logger.info(`Database is connected to ${username}@${host}:${port}/${database}`);
  }
}

async function startServer(): Promise<void> {
  const app = new App();
  await app.init();
}

if (require.main === module) {
  void startServer();
}
