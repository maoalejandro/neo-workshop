"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quest_controller_1 = require("../controllers/quest.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
// Bind controller methods to handle 'this' context
const createQuestHandler = quest_controller_1.questController.createQuest.bind(quest_controller_1.questController);
const getAvailableQuestsHandler = quest_controller_1.questController.getAvailableQuests.bind(quest_controller_1.questController);
const acceptQuestHandler = quest_controller_1.questController.acceptQuest.bind(quest_controller_1.questController);
const getPlayerQuestsHandler = quest_controller_1.questController.getPlayerQuests.bind(quest_controller_1.questController);
const updateQuestProgressHandler = quest_controller_1.questController.updateQuestProgress.bind(quest_controller_1.questController);
// Admin: Create a new quest
router.post('/quests', validation_middleware_1.validateQuestBody, createQuestHandler);
// Player: List available quests
router.get('/quests/available/:playerId/:playerLevel', getAvailableQuestsHandler);
// Player: Accept a quest
router.post('/players/:playerId/quests', validation_middleware_1.validateQuestAcceptance, acceptQuestHandler);
// Player: View active quests
router.get('/players/:playerId/quests', getPlayerQuestsHandler);
// Game Engine: Report progress
router.post('/players/:playerId/quests/:questId/progress', validation_middleware_1.validateProgressUpdate, updateQuestProgressHandler);
exports.default = router;
