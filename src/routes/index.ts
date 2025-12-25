import { Hono } from "hono";

import authRoutes from "./auth.route";
import itemRoutes from "./item.route";

const router = new Hono();

router.route("/auth", authRoutes);
router.route("/items", itemRoutes);

export default router;
