import { Quest } from '../core/models/quest.model';
import { PlayerQuest } from '../core/models/player.model';

/**
 * In-memory data storage for quests and player progress.
 * In a real application, this would be replaced with a database.
 */
class DataService {
  private quests: Map<string, Quest> = new Map();
  private playerQuests: Map<string, PlayerQuest[]> = new Map();

  // Quest methods
  getAllQuests(): Quest[] {
    return Array.from(this.quests.values());
  }

  getQuestById(questId: string): Quest | undefined {
    return this.quests.get(questId);
  }

  createQuest(quest: Quest): Quest {
    this.quests.set(quest.questId, quest);
    return quest;
  }

  // Player quest methods
  getPlayerQuests(playerId: string): PlayerQuest[] {
    return this.playerQuests.get(playerId) || [];
  }

  getPlayerQuestById(playerId: string, questId: string): PlayerQuest | undefined {
    const playerQuests = this.getPlayerQuests(playerId);
    return playerQuests.find(pq => pq.questId === questId);
  }

  addPlayerQuest(playerQuest: PlayerQuest): PlayerQuest {
    const playerQuests = this.getPlayerQuests(playerQuest.playerId);
    playerQuests.push(playerQuest);
    this.playerQuests.set(playerQuest.playerId, playerQuests);
    return playerQuest;
  }

  updatePlayerQuest(playerQuest: PlayerQuest): PlayerQuest {
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
export const dataService = new DataService();