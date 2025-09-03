import { Request, Response, NextFunction } from 'express';
import { questService } from '../services/quest.service';
import { Quest } from '../core/models/quest.model';

export class QuestController {
  /**
   * Create a new quest (Admin endpoint)
   */
  createQuest(req: Request, res: Response, next: NextFunction): void {
    try {
      const quest: Quest = req.body;
      const newQuest = questService.createQuest(quest);
      res.status(201).json(newQuest);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get available quests for a player
   */
  getAvailableQuests(req: Request, res: Response, next: NextFunction): void {
    try {
      const { playerId, playerLevel } = req.params;
      const availableQuests = questService.getAvailableQuests(
        playerId,
        parseInt(playerLevel, 10)
      );
      res.status(200).json(availableQuests);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Accept a quest for a player
   */
  acceptQuest(req: Request, res: Response, next: NextFunction): void {
    try {
      const { playerId } = req.params;
      const { questId } = req.body;
      
      // For simplicity, we'll mock getting the player level
      // In a real app, this would come from a player service or database
      const playerLevel = req.body.playerLevel || 1; // Default to level 1 for testing
      
      const playerQuest = questService.acceptQuest(playerId, questId, playerLevel);
      res.status(201).json(playerQuest);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all quests for a player
   */
  getPlayerQuests(req: Request, res: Response, next: NextFunction): void {
    try {
      const { playerId } = req.params;
      const quests = questService.getPlayerQuests(playerId);
      res.status(200).json(quests);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update quest progress
   */
  updateQuestProgress(req: Request, res: Response, next: NextFunction): void {
    try {
      const { playerId, questId } = req.params;
      const { objectiveId, progressMade } = req.body;
      
      const updatedQuest = questService.updateQuestProgress(
        playerId,
        questId,
        objectiveId,
        progressMade
      );
      
      res.status(200).json(updatedQuest);
    } catch (error) {
      next(error);
    }
  }
}

// Singleton instance
export const questController = new QuestController();