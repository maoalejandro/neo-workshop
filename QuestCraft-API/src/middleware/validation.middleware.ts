import { Request, Response, NextFunction } from 'express';

/**
 * Validates that request body contains all required fields
 */
export const validateQuestBody = (req: Request, res: Response, next: NextFunction): void => {
  const { questId, title, description, levelRequirement, rewards, objectives } = req.body;
  
  if (!questId || !title || !description || levelRequirement === undefined || 
      !rewards || !objectives || !Array.isArray(objectives) || objectives.length === 0) {
    res.status(400).json({
      error: {
        message: 'Invalid quest data. Missing required fields.',
        status: 400
      }
    });
    return;
  }

  // Validate objectives
  for (const objective of objectives) {
    if (!objective.objectiveId || !objective.description || objective.targetCount === undefined) {
      res.status(400).json({
        error: {
          message: 'Invalid objective data. Each objective must have objectiveId, description, and targetCount.',
          status: 400
        }
      });
      return;
    }
  }

  next();
};

/**
 * Validates quest acceptance request
 */
export const validateQuestAcceptance = (req: Request, res: Response, next: NextFunction): void => {
  const { questId } = req.body;
  
  if (!questId) {
    res.status(400).json({
      error: {
        message: 'questId is required',
        status: 400
      }
    });
    return;
  }

  next();
};

/**
 * Validates progress update request
 */
export const validateProgressUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { objectiveId, progressMade } = req.body;
  
  if (!objectiveId || progressMade === undefined || typeof progressMade !== 'number' || progressMade < 0) {
    res.status(400).json({
      error: {
        message: 'Invalid progress data. objectiveId and positive progressMade are required.',
        status: 400
      }
    });
    return;
  }

  next();
};