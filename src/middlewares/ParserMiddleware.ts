import express, { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({ type: "before" })
export class jsonMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    express.json()(req, res, next);
  }
}

@Middleware({ type: "before" })
export class urlencodedMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    express.urlencoded({ extended: false })(req, res, next);
  }
}
