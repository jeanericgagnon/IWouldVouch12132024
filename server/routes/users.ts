import { Router } from 'express';
import { userController } from '../controllers/user';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { updateUserSchema } from '../schemas/user';

const router = Router();

router.get('/me', auth, userController.getCurrentUser);
router.patch('/me', auth, validateRequest(updateUserSchema), userController.updateUser);
router.get('/:id', userController.getUserById);

export default router;