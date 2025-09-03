"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataService = void 0;
/**
 * In-memory data storage for quests and player progress.
 * In a real application, this would be replaced with a database.
 */
class DataService {
    constructor() {
        this.quests = new Map();
        this.playerQuests = new Map();
    }
    // Quest methods
    getAllQuests() {
        return Array.from(this.quests.values());
    }
    getQuestById(questId) {
        return this.quests.get(questId);
    }
    createQuest(quest) {
        this.quests.set(quest.questId, quest);
        return quest;
    }
    // Player quest methods
    getPlayerQuests(playerId) {
        return this.playerQuests.get(playerId) || [];
    }
    getPlayerQuestById(playerId, questId) {
        const playerQuests = this.getPlayerQuests(playerId);
        return playerQuests.find(pq => pq.questId === questId);
    }
    addPlayerQuest(playerQuest) {
        const playerQuests = this.getPlayerQuests(playerQuest.playerId);
        playerQuests.push(playerQuest);
        this.playerQuests.set(playerQuest.playerId, playerQuests);
        return playerQuest;
    }
    updatePlayerQuest(playerQuest) {
        const playerQuests = this.getPlayerQuests(playerQuest.playerId);
        const index = playerQuests.findIndex(pq => pq.questId === playerQuest.questId);
        if (index !== -1) {
            playerQuests[index] = playerQuest;
            this.playerQuests.set(playerQuest.playerId, playerQuests);
        }
        return playerQuest;
    }
}
// Singleton instance
exports.dataService = new DataService();
