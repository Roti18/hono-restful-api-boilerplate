import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { serveStatic } from "@hono/node-server/serve-static";

import { securityHardening } from "./middlewares/security.middleware";
import { apiKeyMiddleware } from "./middlewares/api-key.middleware";
import { oauthMiddleware } from "./middlewares/oauth.middleware";
import { landingPage } from "./controllers/home.controller";
import routes from "./routes/index";

export type AppEnv = {
  Variables: {
    user?: {
      id: string;
      role?: string;
      scopes: string[];
    };
  };
};

const app = new Hono<AppEnv>();

app.use("*", secureHeaders());
app.use("*", securityHardening);
app.use("*", cors());
app.use("*", logger());

app.use("/api/*", apiKeyMiddleware);
app.use("/api/*", oauthMiddleware);

app.get("/", landingPage);
app.get("/docs/*", serveStatic({ root: "./" }));
app.get("/assets/*", serveStatic({ root: "./src" }));

import { dbViewer } from "./controllers/db-viewer.controller";
app.get("/admin/db", dbViewer);

app.route("/api", routes);

app.notFound((c) =>
  c.json({ success: false, error: { message: "Not Found" } }, 404),
);

export default app;
