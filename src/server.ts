import express from "express";
import { env } from "./env";
import { logger } from "./utils/Logger";

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
  }

  public init(): void {
    const { port, apiPrefix } = env.app;
    this.app.listen(port, () => {
      logger.info(`API server is running on http://localhost:${port}${apiPrefix}`);
    });
  }
}

function startServer(): void {
  const app = new App();
  app.init();
}

if (require.main === module) {
  startServer();
}
