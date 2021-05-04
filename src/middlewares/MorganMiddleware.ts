import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import morgan from "morgan";
import { stream } from "../utils/Logger";

@Middleware({ type: "before" })
export class MorganMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    morgan("combined", { stream })(req, res, next);
  }
}
