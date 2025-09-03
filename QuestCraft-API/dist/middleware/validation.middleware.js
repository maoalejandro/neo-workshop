"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProgressUpdate = exports.validateQuestAcceptance = exports.validateQuestBody = void 0;
/**
 * Validates that request body contains all required fields
 */
const validateQuestBody = (req, res, next) => {
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
exports.validateQuestBody = validateQuestBody;
/**
 * Validates quest acceptance request
 */
const validateQuestAcceptance = (req, res, next) => {
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
exports.validateQuestAcceptance = validateQuestAcceptance;
/**
 * Validates progress update request
 */
const validateProgressUpdate = (req, res, next) => {
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
exports.validateProgressUpdate = validateProgressUpdate;
