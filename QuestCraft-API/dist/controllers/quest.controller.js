"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questController = exports.QuestController = void 0;
const quest_service_1 = require("../services/quest.service");
class QuestController {
    /**
     * Create a new quest (Admin endpoint)
     */
    createQuest(req, res, next) {
        try {
            const quest = req.body;
            const newQuest = quest_service_1.questService.createQuest(quest);
            res.status(201).json(newQuest);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get available quests for a player
     */
    getAvailableQuests(req, res, next) {
        try {
            const { playerId, playerLevel } = req.params;
            const availableQuests = quest_service_1.questService.getAvailableQuests(playerId, parseInt(playerLevel, 10));
            res.status(200).json(availableQuests);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Accept a quest for a player
     */
    acceptQuest(req, res, next) {
        try {
            const { playerId } = req.params;
            const { questId } = req.body;
            // For simplicity, we'll mock getting the player level
            // In a real app, this would come from a player service or database
            const playerLevel = req.body.playerLevel || 1; // Default to level 1 for testing
            const playerQuest = quest_service_1.questService.acceptQuest(playerId, questId, playerLevel);
            res.status(201).json(playerQuest);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all quests for a player
     */
    getPlayerQuests(req, res, next) {
        try {
            const { playerId } = req.params;
            const quests = quest_service_1.questService.getPlayerQuests(playerId);
            res.status(200).json(quests);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update quest progress
     */
    updateQuestProgress(req, res, next) {
        try {
            const { playerId, questId } = req.params;
            const { objectiveId, progressMade } = req.body;
            const updatedQuest = quest_service_1.questService.updateQuestProgress(playerId, questId, objectiveId, progressMade);
            res.status(200).json(updatedQuest);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.QuestController = QuestController;
// Singleton instance
exports.questController = new QuestController();
