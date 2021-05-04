import "reflect-metadata";
import express, { Request } from "express";
import { Container } from "typedi";
import { useContainer as typeormUseContainer, createConnection } from "typeorm";
import {
  Action,
  getMetadataArgsStorage,
  RoutingControllersOptions,
  useContainer as routingControllersUseContainer,
  useExpressServer,
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { serve as serveSwagger, setup as setupSwagger } from "swagger-ui-express";
import { init as initSentry, Integrations as SentryIntegrations } from "@sentry/node";
import { Integrations as SentryTracingIntegrations } from "@sentry/tracing";
import { env } from "./env";
import { logger } from "./utils/Logger";
import { UserService } from "./services/UserService";
import { version } from "../package.json";

export class App {
  public app: express.Application;
  private routingControllersOptions!: RoutingControllersOptions;

  constructor() {
    this.app = express();
  }

  public async init(): Promise<void> {
    await this.createDatabaseConnection();
    this.useSentry();
    this.setRoutingControllerOptions();
    this.useRoutingControllers();
    this.useSwagger();

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

  private useSentry() {
    const { dsn } = env.sentry;

    initSentry({
      dsn,
      integrations: [
        new SentryIntegrations.Http({ tracing: true }),
        new SentryTracingIntegrations.Express({ app: this.app }),
      ],
      tracesSampleRate: 1.0,
    });

    logger.info(`Sentry is initialized to ${dsn}`);
  }

  private setRoutingControllerOptions() {
    const userService = Container.get(UserService);

    this.routingControllersOptions = {
      cors: true,
      routePrefix: env.app.apiPrefix,
      authorizationChecker: async (action: Action, roles: string[]) => {
        const req = action.request as Request;
        req.user = await userService.getUserFromRequest(req);
        return !!req.user && !roles.length;
      },
      currentUserChecker: (action: Action) => (action.request as Request).user,
      controllers: [`${__dirname}/controllers/*.{ts,js}`],
      middlewares: [`${__dirname}/middlewares/*.{ts,js}`],
    };
  }

  private useRoutingControllers() {
    routingControllersUseContainer(Container);
    useExpressServer(this.app, this.routingControllersOptions);
  }

  private useSwagger() {
    const spec = routingControllersToSpec(
      getMetadataArgsStorage(),
      this.routingControllersOptions,
      {
        components: {
          schemas: validationMetadatasToSchemas({ refPointerPrefix: "#/components/schemas/" }),
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        info: {
          title: "Jongwan Typescript Express Server",
          version,
        },
      }
    );

    this.app.use(env.swagger.route, serveSwagger, setupSwagger(spec));

    logger.info(`Swagger is running on http://localhost:${env.app.port}${env.swagger.route}`);
  }
}

async function startServer(): Promise<void> {
  const app = new App();
  await app.init();
}

if (require.main === module) {
  void startServer();
}
