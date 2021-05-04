import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import compression from "compression";

@Middleware({ type: "before" })
export class CompressionMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    compression()(req, res, next);
  }
}
