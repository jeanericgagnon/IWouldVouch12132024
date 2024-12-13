import { Router } from 'express';
import { referenceController } from '../controllers/reference';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createReferenceSchema } from '../schemas/reference';

const router = Router();

router.get('/', auth, referenceController.getReferences);
router.post('/', auth, validateRequest(createReferenceSchema), referenceController.createReference);
router.get('/:id', referenceController.getReferenceById);
router.post('/:id/approve', auth, referenceController.approveReference);
router.post('/:id/reject', auth, referenceController.rejectReference);

export default router;