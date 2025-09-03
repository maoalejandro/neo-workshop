"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questService = exports.QuestService = void 0;
const data_service_1 = require("./data.service");
/**
 * Service for quest-related business logic
 */
class QuestService {
    /**
     * Create a new quest
     */
    createQuest(quest) {
        return data_service_1.dataService.createQuest(quest);
    }
    /**
     * Get all quests
     */
    getAllQuests() {
        return data_service_1.dataService.getAllQuests();
    }
    /**
     * Get available quests for a player based on their level
     */
    getAvailableQuests(playerId, playerLevel) {
        const allQuests = data_service_1.dataService.getAllQuests();
        const playerQuests = data_service_1.dataService.getPlayerQuests(playerId);
        const playerQuestIds = new Set(playerQuests.map(pq => pq.questId));
        return allQuests.filter(quest => quest.levelRequirement <= playerLevel && !playerQuestIds.has(quest.questId));
    }
    /**
     * Accept a quest for a player
     */
    acceptQuest(playerId, questId, playerLevel) {
        const quest = data_service_1.dataService.getQuestById(questId);
        if (!quest) {
            throw new Error('Quest not found');
        }
        if (quest.levelRequirement > playerLevel) {
            const error = new Error('Player does not meet level requirement');
            error.statusCode = 403;
            throw error;
        }
        const existingQuest = data_service_1.dataService.getPlayerQuestById(playerId, questId);
        if (existingQuest) {
            const error = new Error('Player has already accepted this quest');
            error.statusCode = 409;
            throw error;
        }
        // Initialize progress for each objective
        const progress = quest.objectives.map(objective => ({
            ...objective,
            currentCount: 0,
            isComplete: false
        }));
        const playerQuest = {
            playerId,
            questId,
            status: 'IN_PROGRESS',
            startedAt: new Date(),
            progress
        };
        return data_service_1.dataService.addPlayerQuest(playerQuest);
    }
    /**
     * Get all quests for a player
     */
    getPlayerQuests(playerId) {
        return data_service_1.dataService.getPlayerQuests(playerId);
    }
    /**
     * Update progress for a quest objective
     */
    updateQuestProgress(playerId, questId, objectiveId, progressMade) {
        const playerQuest = data_service_1.dataService.getPlayerQuestById(playerId, questId);
        if (!playerQuest) {
            const error = new Error('Player has not accepted this quest');
            error.statusCode = 404;
            throw error;
        }
        if (playerQuest.status === 'COMPLETED') {
            return playerQuest; // Quest already completed, no further updates needed
        }
        const quest = data_service_1.dataService.getQuestById(questId);
        if (!quest) {
            throw new Error('Quest not found');
        }
        // Find the objective in player's progress
        const objectiveIndex = playerQuest.progress.findIndex(obj => obj.objectiveId === objectiveId);
        if (objectiveIndex === -1) {
            throw new Error('Objective not found for this quest');
        }
        const objective = playerQuest.progress[objectiveIndex];
        // Update progress (idempotent - only add up to target)
        const updatedCount = Math.min(objective.currentCount + progressMade, objective.targetCount);
        // Create a new progress array with the updated objective
        const updatedProgress = [...playerQuest.progress];
        updatedProgress[objectiveIndex] = {
            ...objective,
            currentCount: updatedCount,
            isComplete: updatedCount >= objective.targetCount
        };
        // Check if all objectives are complete
        const allObjectivesComplete = updatedProgress.every(obj => obj.isComplete);
        // Update the player quest
        const updatedPlayerQuest = {
            ...playerQuest,
            progress: updatedProgress,
            status: allObjectivesComplete ? 'COMPLETED' : 'IN_PROGRESS',
            completedAt: allObjectivesComplete ? new Date() : undefined
        };
        return data_service_1.dataService.updatePlayerQuest(updatedPlayerQuest);
    }
}
exports.QuestService = QuestService;
// Singleton instance
exports.questService = new QuestService();
