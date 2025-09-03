import { test, expect } from '@playwright/test';

// Test base URL
const BASE_URL = 'http://localhost:3000/api';

// Test data
const TEST_QUEST = {
  questId: 'quest-1',
  title: 'Defeat the Dragon',
  description: 'Defeat the mighty dragon that threatens the kingdom',
  levelRequirement: 5,
  rewards: {
    xp: 1000,
    items: ['Dragon Scale', 'Dragon Tooth']
  },
  objectives: [
    {
      objectiveId: 'obj-1',
      description: 'Damage the dragon',
      targetCount: 100
    },
    {
      objectiveId: 'obj-2',
      description: 'Destroy dragon scales',
      targetCount: 5
    }
  ]
};

const TEST_PLAYER_ID = 'player-123';
const TEST_PLAYER_LEVEL = 10;

test.describe('QuestCraft API', () => {
  
  test('should create a new quest', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/quests`, {
      data: TEST_QUEST
    });
    
    expect(response.status()).toBe(201);
    
    const quest = await response.json();
    expect(quest).toEqual(TEST_QUEST);
  });
  
  test('should get available quests for a player', async ({ request }) => {
    // Get available quests for the player
    const response = await request.get(
      `${BASE_URL}/quests/available/${TEST_PLAYER_ID}/${TEST_PLAYER_LEVEL}`
    );
    
    expect(response.status()).toBe(200);
    
    const quests = await response.json();
    expect(Array.isArray(quests)).toBe(true);
    expect(quests.length).toBeGreaterThan(0);
    
    // Find our test quest
    const testQuest = quests.find((q: any) => q.questId === TEST_QUEST.questId);
    expect(testQuest).toBeDefined();
    expect(testQuest.title).toBe(TEST_QUEST.title);
  });
  
  test('should not allow a player to accept a quest with insufficient level', async ({ request }) => {
    // Try to accept the quest with an insufficient level
    const response = await request.post(`${BASE_URL}/players/${TEST_PLAYER_ID}/quests`, {
      data: {
        questId: TEST_QUEST.questId,
        playerLevel: 1 // Level too low (quest requires level 5)
      }
    });
    
    expect(response.status()).toBe(403);
  });
  
  test('should allow a player to accept and complete a quest', async ({ request }) => {
    // Accept the quest
    const acceptResponse = await request.post(`${BASE_URL}/players/${TEST_PLAYER_ID}/quests`, {
      data: {
        questId: TEST_QUEST.questId,
        playerLevel: TEST_PLAYER_LEVEL
      }
    });
    
    expect(acceptResponse.status()).toBe(201);
    
    const playerQuest = await acceptResponse.json();
    expect(playerQuest.playerId).toBe(TEST_PLAYER_ID);
    expect(playerQuest.questId).toBe(TEST_QUEST.questId);
    expect(playerQuest.status).toBe('IN_PROGRESS');
    expect(playerQuest.progress.length).toBe(2);
    expect(playerQuest.progress[0].currentCount).toBe(0);
    expect(playerQuest.progress[1].currentCount).toBe(0);
    
    // Get player quests to verify it was added
    const getResponse = await request.get(`${BASE_URL}/players/${TEST_PLAYER_ID}/quests`);
    
    expect(getResponse.status()).toBe(200);
    
    const quests = await getResponse.json();
    expect(quests.length).toBe(1);
    expect(quests[0].questId).toBe(TEST_QUEST.questId);
    
    // Report partial progress on first objective
    const progressResponse1 = await request.post(
      `${BASE_URL}/players/${TEST_PLAYER_ID}/quests/${TEST_QUEST.questId}/progress`,
      {
        data: {
          objectiveId: 'obj-1',
          progressMade: 50 // Half of required amount
        }
      }
    );
    
    expect(progressResponse1.status()).toBe(200);
    
    const updatedQuest1 = await progressResponse1.json();
    expect(updatedQuest1.status).toBe('IN_PROGRESS');
    expect(updatedQuest1.progress[0].currentCount).toBe(50);
    expect(updatedQuest1.progress[0].isComplete).toBe(false);
    
    // Complete the first objective
    const progressResponse2 = await request.post(
      `${BASE_URL}/players/${TEST_PLAYER_ID}/quests/${TEST_QUEST.questId}/progress`,
      {
        data: {
          objectiveId: 'obj-1',
          progressMade: 50
        }
      }
    );
    
    expect(progressResponse2.status()).toBe(200);
    
    const updatedQuest2 = await progressResponse2.json();
    expect(updatedQuest2.status).toBe('IN_PROGRESS'); // Still in progress because objective 2 is incomplete
    expect(updatedQuest2.progress[0].currentCount).toBe(100);
    expect(updatedQuest2.progress[0].isComplete).toBe(true);
    
    // Complete the second objective
    const progressResponse3 = await request.post(
      `${BASE_URL}/players/${TEST_PLAYER_ID}/quests/${TEST_QUEST.questId}/progress`,
      {
        data: {
          objectiveId: 'obj-2',
          progressMade: 5
        }
      }
    );
    
    expect(progressResponse3.status()).toBe(200);
    
    const updatedQuest3 = await progressResponse3.json();
    expect(updatedQuest3.status).toBe('COMPLETED'); // All objectives are now complete
    expect(updatedQuest3.progress[1].currentCount).toBe(5);
    expect(updatedQuest3.progress[1].isComplete).toBe(true);
    expect(updatedQuest3.completedAt).toBeDefined();
  });
  
  test('should prevent a player from accepting the same quest twice', async ({ request }) => {
    // Try to accept the quest again
    const response = await request.post(`${BASE_URL}/players/${TEST_PLAYER_ID}/quests`, {
      data: {
        questId: TEST_QUEST.questId,
        playerLevel: TEST_PLAYER_LEVEL
      }
    });
    
    expect(response.status()).toBe(409);
  });
  
  test('should handle idempotent progress updates', async ({ request }) => {
    // Make a progress update that exceeds the target
    const response = await request.post(
      `${BASE_URL}/players/${TEST_PLAYER_ID}/quests/${TEST_QUEST.questId}/progress`,
      {
        data: {
          objectiveId: 'obj-1',
          progressMade: 1000 // Way more than needed
        }
      }
    );
    
    expect(response.status()).toBe(200);
    
    const updatedQuest = await response.json();
    expect(updatedQuest.progress[0].currentCount).toBe(100); // Should cap at the target count
    expect(updatedQuest.progress[0].isComplete).toBe(true);
  });
});