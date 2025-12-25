import { Hono } from "hono";
import * as controller from "../controllers/item.controller";
import { protect } from "../middlewares/auth.middleware";

const router = new Hono();

router.get("/", protect, controller.list);
router.get("/:id", protect, controller.get);
router.post("/", protect, controller.create);

export default router;
