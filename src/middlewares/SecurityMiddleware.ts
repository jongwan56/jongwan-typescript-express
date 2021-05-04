import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import helmet from "helmet";

@Middleware({ type: "before" })
export class SecurityMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    helmet()(req, res, next);
  }
}
