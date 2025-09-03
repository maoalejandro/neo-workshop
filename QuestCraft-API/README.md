# QuestCraft API

A backend service for a fantasy RPG that manages player quests and achievements. This API allows players to view and accept quests, tracks their progress against quest objectives, and marks quests as complete when all objectives are met.

## Project Architecture

The project follows a modular architecture with clear separation of concerns:

- `/routes`: API route definitions
- `/controllers`: Request handling and response formatting
- `/services`: Business logic and data operations
- `/core/models`: TypeScript interfaces for data models
- `/middleware`: Request validation and error handling
- `/config`: Application configuration
- `/tests`: API tests using Playwright

## Core Business Logic & Rules

- **Quest Eligibility**: A player can only accept a quest if their current level is equal to or greater than the quest's levelRequirement.
- **Stateful Progress**: The system maintains the state of each player's active quests. Accepting a quest moves its status from AVAILABLE to IN_PROGRESS for that specific player.
- **Objective Completion**: When progress is reported for an objective, the system checks if the currentCount now meets or exceeds the targetCount.
- **Quest Completion**: When an objective is completed, the system checks if all other objectives for that player's quest are also complete. If so, the overall quest status for that player is updated to COMPLETED.
- **Idempotency**: Progress updates are handled in a way that applying the same update multiple times does not grant extra progress.

## API Endpoints

### Admin: Create a New Quest

- **Endpoint**: `POST /api/quests`
- **Description**: Allows a game administrator to create a new quest template available to all players.
- **Request Body**: A Quest object.
- **Success Response (201 Created)**: The created Quest object.
- **Error Response (400 Bad Request)**: If the quest data is invalid.
- **Example**:
  ```bash
  curl -X POST http://localhost:3000/api/quests \
    -H "Content-Type: application/json" \
    -d '{
      "questId": "quest-1",
      "title": "Defeat the Dragon",
      "description": "Defeat the mighty dragon that threatens the kingdom",
      "levelRequirement": 5,
      "rewards": {
        "xp": 1000,
        "items": ["Dragon Scale", "Dragon Tooth"]
      },
      "objectives": [
        {
          "objectiveId": "obj-1",
          "description": "Damage the dragon",
          "targetCount": 100
        },
        {
          "objectiveId": "obj-2",
          "description": "Destroy dragon scales",
          "targetCount": 5
        }
      ]
    }'
  ```

### Player: List Available Quests

- **Endpoint**: `GET /api/quests/available/{playerId}/{playerLevel}`
- **Description**: Returns a list of all quests that the specified player is eligible to accept (i.e., their level is high enough and they have not already started or completed it).
- **Success Response (200 OK)**: An array of Quest objects.
- **Example**:
  ```bash
  curl -X GET http://localhost:3000/api/quests/available/player-123/10
  ```

### Player: Accept a Quest

- **Endpoint**: `POST /api/players/{playerId}/quests`
- **Description**: Allows a player to accept an available quest. This creates a new PlayerQuest record.
- **Request Body**: `{ "questId": "string", "playerLevel": number }`
- **Success Response (201 Created)**: The newly created PlayerQuest object with status IN_PROGRESS.
- **Error Response (403 Forbidden)**: If the player does not meet the level requirement.
- **Error Response (409 Conflict)**: If the player has already accepted this quest.
- **Example**:
  ```bash
  curl -X POST http://localhost:3000/api/players/player-123/quests \
    -H "Content-Type: application/json" \
    -d '{
      "questId": "quest-1",
      "playerLevel": 10
    }'
  ```

### Player: View Active Quests

- **Endpoint**: `GET /api/players/{playerId}/quests`
- **Description**: Returns a list of all quests currently in progress or completed by a player.
- **Success Response (200 OK)**: An array of PlayerQuest objects.
- **Example**:
  ```bash
  curl -X GET http://localhost:3000/api/players/player-123/quests
  ```

### Game Engine: Report Progress

- **Endpoint**: `POST /api/players/{playerId}/quests/{questId}/progress`
- **Description**: Used by an external system (the "game engine") to report a player's progress on a specific quest objective. This endpoint triggers all the business logic for objective and quest completion.
- **Request Body**: `{ "objectiveId": "string", "progressMade": number }`
- **Success Response (200 OK)**: The updated PlayerQuest object.
- **Error Response (404 Not Found)**: If the player has not accepted the specified quest.
- **Example**:
  ```bash
  curl -X POST http://localhost:3000/api/players/player-123/quests/quest-1/progress \
    -H "Content-Type: application/json" \
    -d '{
      "objectiveId": "obj-1",
      "progressMade": 50
    }'
  ```

## Setup and Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   NODE_ENV=development
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

This will compile the TypeScript code to JavaScript in the `dist` directory.

## Running in Production

```bash
npm start
```

## Testing

Run the API tests using Playwright:

```bash
npm test
```

The tests validate the business logic and API endpoints, including:
- Creating quests
- Checking available quests
- Accepting quests
- Reporting progress
- Completing quests
- Handling error conditions

## Technical Notes

- The API uses an in-memory database (JavaScript Maps) to store quests and player progress for simplicity.
- In a production environment, you would replace this with a real database.
- The API includes robust input validation and error handling.
- The codebase is written in TypeScript for type safety and better developer experience.