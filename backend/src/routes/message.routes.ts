import { Router } from "express";
import { z } from "zod";
import { updateMessageHandler } from "@/controllers/message.controller";
import { validateBody } from "@/middlewares/validation.middleware";
import { verifyJwt } from "@/middlewares/auth.middleware";

const router = Router();

const updateMessageSchema = z.object({
	text: z.string().min(1).max(2000),
});

router.put(
	"/:messageId",
	verifyJwt,
	validateBody(updateMessageSchema),
	updateMessageHandler
);

export const messageRoutes = router;
