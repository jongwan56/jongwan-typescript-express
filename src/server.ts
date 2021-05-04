import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { useContainer as typeormUseContainer, createConnection } from "typeorm";
import {
  useContainer as routingControllersUseContainer,
  useExpressServer,
} from "routing-controllers";
import { env } from "./env";
import { logger } from "./utils/Logger";

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
  }

  public async init(): Promise<void> {
    await this.createDatabaseConnection();
    this.useRoutingControllers();

    const { port, apiPrefix } = env.app;

    this.app.listen(port, () => {
      logger.info(`API server is running on http://localhost:${port}${apiPrefix}`);
    });
  }

  private async createDatabaseConnection(): Promise<void> {
    typeormUseContainer(Container);

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

  private useRoutingControllers() {
    routingControllersUseContainer(Container);

    useExpressServer(this.app, {
      cors: true,
      routePrefix: env.app.apiPrefix,
      controllers: [`${__dirname}/controllers/*.{ts,js}`],
      middlewares: [`${__dirname}/middlewares/*.{ts,js}`],
    });
  }
}

async function startServer(): Promise<void> {
  const app = new App();
  await app.init();
}

if (require.main === module) {
  void startServer();
}
