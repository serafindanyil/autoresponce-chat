import { Router } from "express";
import { z } from "zod";
import { googleAuthCallback } from "@/controllers/auth.controller";
import { validateBody } from "@/middlewares/validation.middleware";

const router = Router();

const googleAuthSchema = z.object({
  token: z.string(),
});

router.post("/google", validateBody(googleAuthSchema), googleAuthCallback);

export const authRoutes = router;
