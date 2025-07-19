import { Router } from "express";
import { createGroup, getGroupById, getGroupsOfUser, clearGroups } from "../controllers/group.controller";
import { authMiddleWare } from "../middleware/auth.middleware";


const router = Router();

router.post('/create', authMiddleWare, createGroup)
    .get('/get', authMiddleWare, getGroupsOfUser)
    .get('/get/:id', authMiddleWare, getGroupById)
    .delete('/clear', clearGroups);

export default router;