import { Router } from "express";
import { createGroup, getGroupsOfUser } from "../controllers/group.controller";
import { authMiddleWare } from "../middleware/auth.middleware";


const router = Router();

router.post('/create', authMiddleWare, createGroup)
    .get('/get', authMiddleWare, getGroupsOfUser);

export default router;