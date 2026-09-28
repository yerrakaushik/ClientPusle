import { Router } from 'express';
import { clientController } from '../controllers/clientController.js';

const router = Router();

router.get('/health', clientController.getHealth);
router.post('/seed', clientController.seedData);

router.get('/clients', clientController.getClients);
router.get('/clients/:id', clientController.getClientById);
router.get('/clients/:id/interactions', clientController.getInteractions);
router.post('/clients/:id/interactions', clientController.addInteraction);
router.post('/clients/:id/chat', clientController.chatWithAssistant);
router.post('/clients/:id/meeting-brief', clientController.getMeetingBrief);
router.get('/clients/:id/memory', clientController.getMemoryPanel);
router.post('/clients/:id/feedback', clientController.recordFeedback);

export default router;
