import { Quest } from '../core/models/quest.model';
import { PlayerQuest, PlayerQuestProgress } from '../core/models/player.model';
import { dataService } from './data.service';

/**
 * Service for quest-related business logic
 */
export class QuestService {
  /**
   * Create a new quest
   */
  createQuest(quest: Quest): Quest {
    return dataService.createQuest(quest);
  }

  /**
   * Get all quests
   */
  getAllQuests(): Quest[] {
    return dataService.getAllQuests();
  }

  /**
   * Get available quests for a player based on their level
   */
  getAvailableQuests(playerId: string, playerLevel: number): Quest[] {
    const allQuests = dataService.getAllQuests();
    const playerQuests = dataService.getPlayerQuests(playerId);
    const playerQuestIds = new Set(playerQuests.map(pq => pq.questId));

    return allQuests.filter(quest => 
      quest.levelRequirement <= playerLevel && !playerQuestIds.has(quest.questId)
    );
  }

  /**
   * Accept a quest for a player
   */
  acceptQuest(playerId: string, questId: string, playerLevel: number): PlayerQuest {
    const quest = dataService.getQuestById(questId);
    
    if (!quest) {
      throw new Error('Quest not found');
    }

    if (quest.levelRequirement > playerLevel) {
      const error = new Error('Player does not meet level requirement');
      (error as any).statusCode = 403;
      throw error;
    }

    const existingQuest = dataService.getPlayerQuestById(playerId, questId);
    if (existingQuest) {
      const error = new Error('Player has already accepted this quest');
      (error as any).statusCode = 409;
      throw error;
    }

    // Initialize progress for each objective
    const progress: PlayerQuestProgress[] = quest.objectives.map(objective => ({
      ...objective,
      currentCount: 0,
      isComplete: false
    }));

    const playerQuest: PlayerQuest = {
      playerId,
      questId,
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      progress
    };

    return dataService.addPlayerQuest(playerQuest);
  }

  /**
   * Get all quests for a player
   */
  getPlayerQuests(playerId: string): PlayerQuest[] {
    return dataService.getPlayerQuests(playerId);
  }

  /**
   * Update progress for a quest objective
   */
  updateQuestProgress(
    playerId: string, 
    questId: string, 
    objectiveId: string, 
    progressMade: number
  ): PlayerQuest {
    const playerQuest = dataService.getPlayerQuestById(playerId, questId);
    
    if (!playerQuest) {
      const error = new Error('Player has not accepted this quest');
      (error as any).statusCode = 404;
      throw error;
    }

    if (playerQuest.status === 'COMPLETED') {
      return playerQuest; // Quest already completed, no further updates needed
    }

    const quest = dataService.getQuestById(questId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    // Find the objective in player's progress
    const objectiveIndex = playerQuest.progress.findIndex(
      obj => obj.objectiveId === objectiveId
    );

    if (objectiveIndex === -1) {
      throw new Error('Objective not found for this quest');
    }

    const objective = playerQuest.progress[objectiveIndex];
    
    // Update progress (idempotent - only add up to target)
    const updatedCount = Math.min(
      objective.currentCount + progressMade,
      objective.targetCount
    );
    
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
    const updatedPlayerQuest: PlayerQuest = {
      ...playerQuest,
      progress: updatedProgress,
      status: allObjectivesComplete ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: allObjectivesComplete ? new Date() : undefined
    };

    return dataService.updatePlayerQuest(updatedPlayerQuest);
  }
}

// Singleton instance
export const questService = new QuestService();