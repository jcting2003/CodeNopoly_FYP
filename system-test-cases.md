# Test Case: Player Registration Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- The tester must have access to the web application login and registration page.
- The email used for registration must not already exist in the `users` table.

## User Actions Sequence
1. Navigate to the login and registration page (`/login`).
2. Switch to the `Register` tab.
3. Enter a valid username, email address, password, and password confirmation.
4. Click the registration button.

## Success Assertions (Expected Outcomes)
- [ ] Verify that registration is completed successfully.
- [ ] Verify that a success message is shown to the user.
- [ ] Verify that the new user record is inserted into the `users` table.
- [ ] Verify that the user can proceed to login using the newly created credentials.

## Required Deliverables
- Capture a screenshot of the registration success state or resulting login-ready screen.

# Test Case: Player Login Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A valid player account must already exist in the database.

## User Actions Sequence
1. Navigate to the login page (`/login`).
2. Enter a valid player email and password.
3. Click the login button.

## Success Assertions (Expected Outcomes)
- [ ] Verify that login succeeds without validation or authentication errors.
- [ ] Verify that the player is redirected to the player dashboard.
- [ ] Verify that the authenticated session is established correctly.

## Required Deliverables
- Capture a screenshot of the player dashboard after successful login.

# Test Case: Admin Login Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A valid admin account must already exist in the database with `role = admin`.

## User Actions Sequence
1. Navigate to the login page (`/login`).
2. Enter a valid admin email and password.
3. Click the login button.

## Success Assertions (Expected Outcomes)
- [ ] Verify that login succeeds without authentication errors.
- [ ] Verify that the admin user is redirected to `/admin/dashboard`.
- [ ] Verify that admin-only navigation options are visible.

## Required Deliverables
- Capture a screenshot of the admin dashboard after successful login.

# Test Case: Create Game Session Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A valid player account must be logged in.

## User Actions Sequence
1. Navigate to the player dashboard.
2. Click the create game option.
3. Submit the create game action.

## Success Assertions (Expected Outcomes)
- [ ] Verify that a new game session is created successfully.
- [ ] Verify that a unique game code is generated.
- [ ] Verify that the host is redirected to the game lobby page.
- [ ] Verify that the new game record is stored in the `games` table.

## Required Deliverables
- Capture a screenshot of the game lobby showing the generated game code.

# Test Case: Join Game Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A game session must already exist with a valid game code.
- A second player account must be available and logged in.

## User Actions Sequence
1. Navigate to the join game page.
2. Enter a valid game code.
3. Submit the join game request.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the player joins the game successfully.
- [ ] Verify that the joined player appears in the lobby player list.
- [ ] Verify that a corresponding record is inserted into the `game_players` table.

## Required Deliverables
- Capture a screenshot of the lobby showing the joined player.

# Test Case: Start Game Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A host must have created a game.
- At least the minimum required number of players must have joined the lobby.

## User Actions Sequence
1. Open the game lobby as the host.
2. Click the `Start Game` button.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the game status changes to `started`.
- [ ] Verify that `current_turn_user_id` is assigned.
- [ ] Verify that the initial turn number is set.
- [ ] Verify that connected players move into the game flow.

## Required Deliverables
- Capture a screenshot of the started game state or first-turn game board.

# Test Case: Roll Dice and Move Player Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A game must already be started.
- The tester must be the current active player.

## User Actions Sequence
1. Open the game board.
2. Wait until it is the tester's turn.
3. Click the roll dice button.

## Success Assertions (Expected Outcomes)
- [ ] Verify that a dice value is generated successfully.
- [ ] Verify that the player position is updated based on the dice result.
- [ ] Verify that the new tile state is reflected in the UI.
- [ ] Verify that the updated position is persisted in the `game_players` table.

## Required Deliverables
- Capture a screenshot of the game board showing the updated player position after rolling.

# Test Case: QR or NFC Tile Scan Validation Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A game must already be started.
- The current player must have rolled the dice and landed on a valid tile.

## User Actions Sequence
1. Open the scan flow from the active gameplay state.
2. Scan the QR or NFC value for the tile matching the player's current position.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the scan request is accepted.
- [ ] Verify that the system confirms the tile matches the player's position.
- [ ] Verify that the tile details or next available actions are shown.

## Required Deliverables
- Capture a screenshot of the successful tile scan result screen.

# Test Case: MCQ Question Answering Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A started game must exist.
- The current player must land on a tile that provides a question.
- At least one MCQ question must exist for the tile and selected difficulty.

## User Actions Sequence
1. Scan the correct tile.
2. Select a difficulty level.
3. Load the question.
4. Submit a correct MCQ answer.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the MCQ answer is validated successfully.
- [ ] Verify that the system marks the answer as correct.
- [ ] Verify that credits are awarded to the player.
- [ ] Verify that a `player_answers` record is created.
- [ ] Verify that leaderboard-related values are updated.

## Required Deliverables
- Capture a screenshot of the answer result showing awarded credits.

# Test Case: Structured Question Answering Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A started game must exist.
- The current player must land on a tile that provides a structured question.
- At least one structured question must exist with `expected_answer`, `rubric`, and `max_score`.

## User Actions Sequence
1. Scan the correct tile.
2. Select a difficulty level that returns a structured question.
3. Enter a structured answer.
4. Submit the answer.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the structured answer is submitted successfully.
- [ ] Verify that AI-based validation is triggered.
- [ ] Verify that correctness, score, or feedback is returned.
- [ ] Verify that credits and answer records are updated accordingly.

## Required Deliverables
- Capture a screenshot of the structured answer result and feedback.

# Test Case: Property Purchase Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A started game must exist.
- The active player must land on an unowned property tile.
- The player must have enough credits to purchase the property.

## User Actions Sequence
1. Roll dice and land on an unowned property tile.
2. Choose the buy property action.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the property purchase is accepted.
- [ ] Verify that player credits are deducted correctly.
- [ ] Verify that the property owner is updated for the current game.
- [ ] Verify that the purchase is reflected in the `game_properties` table.

## Required Deliverables
- Capture a screenshot of the property purchase success state.

# Test Case: Rent Payment Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A started game must exist.
- A property in the current game must already be owned by another player.
- The active player must land on that owned property.

## User Actions Sequence
1. Roll dice and land on a property owned by another player.
2. Trigger the rent payment flow.

## Success Assertions (Expected Outcomes)
- [ ] Verify that rent is deducted from the current player.
- [ ] Verify that rent is credited to the property owner.
- [ ] Verify that updated credit totals are shown in the UI and leaderboard.

## Required Deliverables
- Capture a screenshot of the updated leaderboard or player credit state after rent payment.

# Test Case: Chance or Community Chest Card Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A started game must exist.
- The active player must land on a chance or community chest tile.
- A valid physical or test card code must be available.

## User Actions Sequence
1. Land on a card tile.
2. Draw the required card.
3. Scan the drawn card.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the card scan is validated successfully.
- [ ] Verify that the card effect is applied correctly.
- [ ] Verify that any credit or movement change is reflected in the game state.
- [ ] Verify that duplicate card scan in the same turn is prevented.

## Required Deliverables
- Capture a screenshot of the card scan result and the applied effect.

# Test Case: End Turn Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A started game must exist.
- The current player must have completed the allowed actions for the turn.

## User Actions Sequence
1. Perform the required turn actions.
2. Click the `End Turn` button.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the turn advances to the next eligible player.
- [ ] Verify that `turn_number` increments correctly.
- [ ] Verify that `last_dice_roll` is cleared for the next turn.
- [ ] Verify that realtime turn updates are reflected for connected players.

## Required Deliverables
- Capture a screenshot of the next player's turn state after ending the turn.

# Test Case: Leaderboard Update Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A started game must exist.
- At least two players must be participating in the game.

## User Actions Sequence
1. Perform one or more actions that change player credits, such as answering a question or paying rent.
2. Open or observe the leaderboard.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the leaderboard updates according to the latest player credit totals.
- [ ] Verify that ranking order changes correctly when scores change.

## Required Deliverables
- Capture a screenshot of the updated leaderboard.

# Test Case: My Games History Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- The logged-in player must have participated in one or more games.

## User Actions Sequence
1. Login as a player.
2. Navigate to the `My Games` page.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the player's game history is loaded successfully.
- [ ] Verify that the listed games belong only to the authenticated player.
- [ ] Verify that each game entry contains the expected summary information.

## Required Deliverables
- Capture a screenshot of the `My Games` page with loaded game history.

# Test Case: Admin Dashboard Statistics Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A valid admin account must exist.
- The database must contain at least one user, one question, and one game record.

## User Actions Sequence
1. Login as admin.
2. Navigate to `/admin/dashboard`.

## Success Assertions (Expected Outcomes)
- [ ] Verify that total users are displayed correctly.
- [ ] Verify that total questions are displayed correctly.
- [ ] Verify that total games are displayed correctly.
- [ ] Verify that active games are displayed correctly.

## Required Deliverables
- Capture a screenshot of the admin dashboard statistics.

# Test Case: Admin Question Management Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A valid admin account must exist and be logged in.
- The `questions` table must contain at least one existing question.

## User Actions Sequence
1. Navigate to `/admin/questions`.
2. Verify that the question list loads.
3. Click `Add Question` and create one MCQ question.
4. Click `Add Question` again and create one structured question.
5. Edit an existing question and save the changes.
6. Delete a selected question and confirm the deletion.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the question list loads successfully.
- [ ] Verify that an MCQ question can be created successfully.
- [ ] Verify that a structured question can be created successfully.
- [ ] Verify that edited question data is saved correctly.
- [ ] Verify that deleted questions are removed from the list.
- [ ] Verify that question creation is blocked when the configured maximum limit is reached.

## Required Deliverables
- Capture a screenshot of the question bank page after add, edit, and delete operations.

# Test Case: Role-Based Access Control Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- One admin account and one normal player account must exist.

## User Actions Sequence
1. Login as a normal player.
2. Attempt to navigate to `/admin/dashboard`.
3. Attempt to navigate to `/admin/questions`.
4. Attempt to call the admin question API while authenticated as a normal player.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the non-admin user cannot access the admin dashboard.
- [ ] Verify that the non-admin user cannot access the admin question bank page.
- [ ] Verify that the backend returns a forbidden or admin-only response for admin API requests.

## Required Deliverables
- Capture a screenshot or API response evidence showing access denial.

# Test Case: Host End Game Flow

## Setup & Prerequisites
- The backend and frontend servers must be running.
- A started game must exist.
- The tester must be the host of the game.

## User Actions Sequence
1. Open the active game as the host.
2. Trigger the end game action.

## Success Assertions (Expected Outcomes)
- [ ] Verify that the game status changes to ended.
- [ ] Verify that gameplay actions are no longer allowed for the ended session.
- [ ] Verify that the final leaderboard page or result state is available.

## Required Deliverables
- Capture a screenshot of the final leaderboard or ended game state.
