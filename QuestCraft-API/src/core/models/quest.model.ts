export interface QuestObjective {
  objectiveId: string;
  description: string;
  targetCount: number;
}

export interface Quest {
  questId: string;
  title: string;
  description: string;
  levelRequirement: number;
  rewards: {
    xp: number;
    items: string[];
  };
  objectives: QuestObjective[];
}