import { Router } from 'express';
import { authController } from '../controllers/auth';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, signupSchema } from '../schemas/auth';

const router = Router();

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/linkedin/callback', authController.linkedinCallback);
router.post('/logout', authController.logout);

export default router;