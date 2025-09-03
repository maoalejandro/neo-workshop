import { QuestObjective } from './quest.model';

export interface PlayerQuestProgress extends QuestObjective {
  currentCount: number;
  isComplete: boolean;
}

export interface PlayerQuest {
  playerId: string;
  questId: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  startedAt: Date;
  completedAt?: Date;
  progress: PlayerQuestProgress[];
}