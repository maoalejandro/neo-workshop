import { Router } from 'express';
import { questController } from '../controllers/quest.controller';
import { 
  validateQuestBody, 
  validateQuestAcceptance, 
  validateProgressUpdate 
} from '../middleware/validation.middleware';

const router = Router();

// Bind controller methods to handle 'this' context
const createQuestHandler = questController.createQuest.bind(questController);
const getAvailableQuestsHandler = questController.getAvailableQuests.bind(questController);
const acceptQuestHandler = questController.acceptQuest.bind(questController);
const getPlayerQuestsHandler = questController.getPlayerQuests.bind(questController);
const updateQuestProgressHandler = questController.updateQuestProgress.bind(questController);

// Admin: Create a new quest
router.post('/quests', validateQuestBody, createQuestHandler);

// Player: List available quests
router.get('/quests/available/:playerId/:playerLevel', getAvailableQuestsHandler);

// Player: Accept a quest
router.post('/players/:playerId/quests', validateQuestAcceptance, acceptQuestHandler);

// Player: View active quests
router.get('/players/:playerId/quests', getPlayerQuestsHandler);

// Game Engine: Report progress
router.post('/players/:playerId/quests/:questId/progress', validateProgressUpdate, updateQuestProgressHandler);

export default router;