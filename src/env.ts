import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../env/.env.${process.env.NODE_ENV || "development"}` });

export const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  app: {
    port: Number(process.env.PORT) || 3000,
    apiPrefix: process.env.API_PREFIX || "/api",
  },
  jwt: {
    accessSecretKey: process.env.JWT_ACCESS_SECRET_KEY || "",
    refreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY || "",
  },
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "postgres",
    synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
    logging: process.env.DATABASE_LOGGING === "true",
  },
  swagger: {
    route: process.env.SWAGGER_ROUTE || "/swagger",
  },
};
