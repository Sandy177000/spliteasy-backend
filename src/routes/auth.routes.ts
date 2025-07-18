import { Router } from 'express';
import { login, signup } from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

export default router; 