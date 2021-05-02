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
};
