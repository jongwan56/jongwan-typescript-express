import express from "express";
import { env } from "./env";

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
  }

  public init(): void {
    const { port } = env.app;
    this.app.listen(port);
  }
}

function startServer(): void {
  const app = new App();
  app.init();
}

if (require.main === module) {
  startServer();
}
