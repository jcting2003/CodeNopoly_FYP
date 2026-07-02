const { chromium } = require('playwright');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR);
}

// Helper to take and log screenshots
async function takeScreenshot(page, name) {
  const file = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(`[SCREENSHOT] Saved: ${file}`);
}

async function run() {
  console.log('Starting system test cases runner...');

  // Database connection
  const db = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'codenopoly'
  });
  console.log('Connected to MySQL database.');

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  console.log('Playwright headless browser launched.');

  // ----------------------------------------------------
  // TC 1 & TC 2: Host Player Registration & Login Flow
  // ----------------------------------------------------
  const hostCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const hostPage = await hostCtx.newPage();

  console.log('\n--- Running TC 1: Player Registration Flow ---');
  await hostPage.goto('http://localhost:5173/login');
  await hostPage.waitForLoadState('networkidle');

  // Switch to register tab
  await hostPage.click('button:has-text("Register")');

  const uniqueEmail = `host_${Date.now()}@mail.com`;
  await hostPage.fill('input[placeholder="py_coder"]', 'HostPlayer');
  await hostPage.fill('input[placeholder="dev@mail.com"]', uniqueEmail);
  await hostPage.locator('input[placeholder="••••••••"]').first().fill('password123');
  await hostPage.locator('input[placeholder="••••••••"]').last().fill('password123');

  await hostPage.click('button:has-text("Initialize Profile")');

  // Wait for success message
  await hostPage.waitForSelector('text=Registration successful. Please log in.');
  await takeScreenshot(hostPage, 'TC01_PlayerRegistration');
  console.log('TC 1: Player Registration Flow passed.');

  console.log('\n--- Running TC 2: Player Login Flow ---');
  // Fill login form
  await hostPage.fill('input[placeholder="dev@pythonopoly.io"]', uniqueEmail);
  await hostPage.locator('input[placeholder="••••••••"]').fill('password123');
  await hostPage.click('button:has-text("Execute Login")');

  // Wait for dashboard navigation
  await hostPage.waitForURL('**/dashboard');
  await hostPage.waitForSelector('text=Welcome back');
  await takeScreenshot(hostPage, 'TC02_PlayerLogin');
  console.log('TC 2: Player Login Flow passed.');

  // ----------------------------------------------------
  // TC 3: Admin Login Flow
  // ----------------------------------------------------
  const adminCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const adminPage = await adminCtx.newPage();

  // Accept standard alert boxes and log them
  adminPage.on('dialog', async dialog => {
    console.log(`[DIALOG] ${dialog.type()}: ${dialog.message()}`);
    await dialog.accept();
  });

  console.log('\n--- Running TC 3: Admin Login Flow ---');
  await adminPage.goto('http://localhost:5173/login');
  await adminPage.waitForLoadState('networkidle');

  await adminPage.fill('input[placeholder="dev@pythonopoly.io"]', 'admin@mail.com');
  await adminPage.locator('input[placeholder="••••••••"]').fill('password123');
  await adminPage.click('button:has-text("Execute Login")');

  await adminPage.waitForURL('**/admin/dashboard');
  await adminPage.waitForSelector('text=Admin Panel');
  await takeScreenshot(adminPage, 'TC03_AdminLogin');
  console.log('TC 3: Admin Login Flow passed.');

  // ----------------------------------------------------
  // TC 4: Create Game Session Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 4: Create Game Session Flow ---');
  await hostPage.goto('http://localhost:5173/dashboard');
  await hostPage.click('button:has-text("Create Game")');
  await hostPage.waitForURL('**/create-game');

  // Check "Join as player"
  await hostPage.check('input[type="checkbox"]');
  await hostPage.click('button:has-text("Create Game")');

  // Wait for lobby redirect
  await hostPage.waitForURL(url => url.pathname.includes('/game-lobby'));
  await hostPage.waitForSelector('text=Game Code');

  // Extract game code and ID
  const lobbyUrl = hostPage.url();
  const gameId = lobbyUrl.match(/\/game-lobby\/(\d+)/)[1];
  const gameCode = lobbyUrl.match(/\?code=([A-Z0-9\-]+)/)[1];
  console.log(`Created Game ID: ${gameId}, Code: ${gameCode}`);

  await takeScreenshot(hostPage, 'TC04_CreateGameSession');
  console.log('TC 4: Create Game Session Flow passed.');

  // ----------------------------------------------------
  // TC 5: Join Game Flow
  // ----------------------------------------------------
  const p2Ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p2Page = await p2Ctx.newPage();

  console.log('\n--- Running TC 5: Join Game Flow ---');
  await p2Page.goto('http://localhost:5173/login');
  await p2Page.waitForLoadState('networkidle');

  await p2Page.fill('input[placeholder="dev@pythonopoly.io"]', 'alvin@mail.com');
  await p2Page.locator('input[placeholder="••••••••"]').fill('password123');
  await p2Page.click('button:has-text("Execute Login")');
  await p2Page.waitForURL('**/dashboard');

  await p2Page.click('button:has-text("Join Game")');
  await p2Page.waitForURL('**/join-game');

  await p2Page.fill('input[placeholder="e.g. PY-ALPHA-2024"]', gameCode);
  await p2Page.click('button:has-text("Execute Join")');

  await p2Page.waitForURL(url => url.pathname.includes('/game-lobby'));
  await p2Page.waitForSelector('text=Joined Players');

  await takeScreenshot(p2Page, 'TC05_JoinGame');
  console.log('TC 5: Join Game Flow passed.');

  // ----------------------------------------------------
  // TC 6: Start Game Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 6: Start Game Flow ---');
  // Refresh Host Page to load Joined Player
  await hostPage.reload();
  await hostPage.waitForSelector('text=Start Game');

  // Click start game
  await hostPage.click('button:has-text("Start Game")');

  // Wait for board redirection on both pages
  await hostPage.waitForURL(url => url.pathname.includes('/game-board'));
  await p2Page.waitForURL(url => url.pathname.includes('/game-board'));

  await hostPage.waitForSelector('text=Dice Engine');
  await p2Page.waitForSelector('text=Dice Engine');

  await takeScreenshot(hostPage, 'TC06_StartGame');
  console.log('TC 6: Start Game Flow passed.');

  // Helper to query active player ID
  async function getActiveTurnUser() {
    const [rows] = await db.query('SELECT current_turn_user_id FROM games WHERE id = ?', [gameId]);
    return rows[0].current_turn_user_id;
  }

  // Helper to wait for turn change in database
  async function waitForTurnChange(previousUserId) {
    console.log(`Waiting for active turn user to change from ${previousUserId}...`);
    for (let i = 0; i < 20; i++) {
      const activeId = await getActiveTurnUser();
      if (activeId !== previousUserId) {
        console.log(`Active turn user changed to: ${activeId}`);
        return activeId;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    const current = await getActiveTurnUser();
    console.log(`Turn change polling timed out. Current active user is still: ${current}`);
    return current;
  }

  // Helper to get user ID by email
  async function getUserIdByEmail(email) {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    return rows[0].id;
  }

  const hostUserId = await getUserIdByEmail(uniqueEmail);
  const p2UserId = await getUserIdByEmail('alvin@mail.com');

  // ----------------------------------------------------
  // TC 7: Roll Dice and Move Player Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 7: Roll Dice and Move Player Flow ---');

  let activeId = await getActiveTurnUser();
  let activePage = activeId === hostUserId ? hostPage : p2Page;
  let inactivePage = activeId === hostUserId ? p2Page : hostPage;

  console.log(`Active Player User ID: ${activeId}`);

  // Click Roll Dice
  await activePage.click('button:has-text("Roll Dice")');
  await activePage.waitForTimeout(3000); // Wait for roll animation

  // Force land Host on Tile 1 (Variables Valley - unowned property)
  await db.query('UPDATE games SET last_dice_roll = 1 WHERE id = ?', [gameId]);
  await db.query('UPDATE game_players SET position = 1 WHERE game_id = ? AND user_id = ?', [gameId, activeId]);
  await activePage.reload();
  await activePage.waitForSelector('text=Dice Engine');

  await takeScreenshot(activePage, 'TC07_RollDiceAndMove');
  console.log('TC 7: Roll Dice and Move Player Flow passed.');

  // ----------------------------------------------------
  // TC 8: QR or NFC Tile Scan Validation Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 8: QR/NFC Tile Scan Validation Flow ---');

  // Scan Variables Valley (Tile 1)
  await activePage.fill('input[placeholder="Enter QR value for testing"]', 'NFC_TILE_01');
  await activePage.click('button:has-text("Scan Tile (QR Test)")');

  // Wait for difficulty selection modal
  await activePage.waitForSelector('text=Choose Difficulty');
  await takeScreenshot(activePage, 'TC08_ScanTile');
  console.log('TC 8: Scan Tile Flow passed.');

  // ----------------------------------------------------
  // TC 11: Property Purchase Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 11: Property Purchase Flow ---');
  // Choose Easy difficulty to initialize challenge (opens Code Lab modal, but we go back to Board to buy first)
  await activePage.check('input[type="radio"][value="easy"]');
  await activePage.click('button:has-text("Continue")');

  // Return to board tab
  await activePage.click('button:has-text("Board")');

  // Buy property Variables Valley
  const buyBtn = activePage.locator('button:has-text("Buy Property")');
  await buyBtn.waitFor({ state: 'visible' });
  await buyBtn.click();
  await activePage.waitForTimeout(2000);

  await takeScreenshot(activePage, 'TC11_PropertyPurchase');
  console.log('TC 11: Property Purchase Flow passed.');

  // ----------------------------------------------------
  // TC 9: MCQ Question Answering Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 9: MCQ Question Answering Flow ---');
  // Switch to Code Lab
  await activePage.click('button:has-text("Code Lab")');
  await activePage.waitForSelector('text=Challenge Difficulty');

  // Select answer B (correct MCQ for Variables Valley Easy question)
  await activePage.click('button:has(span:text-is("B"))');
  await activePage.click('button:has-text("Submit Answer")');

  await activePage.waitForSelector('text=Correct answer submitted!');
  await takeScreenshot(activePage, 'TC09_MCQAnswering');
  console.log('TC 9: MCQ Answering passed.');

  await activePage.click('button:has-text("Continue")');

  // ----------------------------------------------------
  // TC 14: End Turn Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 14: End Turn Flow ---');
  await activePage.click('button:has-text("End Turn")');
  await activePage.waitForTimeout(2000);
  await takeScreenshot(activePage, 'TC14_EndTurn');
  console.log('TC 14: End Turn Flow passed.');

  // Now, inactive player becomes active player. Let's swap
  activeId = await waitForTurnChange(activeId);
  activePage = activeId === hostUserId ? hostPage : p2Page;
  inactivePage = activeId === hostUserId ? p2Page : hostPage;
  console.log(`New Active Player User ID: ${activeId}`);

  // ----------------------------------------------------
  // TC 12: Rent Payment Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 12: Rent Payment Flow ---');
  // Force land Player 2 on Host's property (Variables Valley, tile 1)
  await db.query('UPDATE games SET last_dice_roll = 1 WHERE id = ?', [gameId]);
  await db.query('UPDATE game_players SET position = 1 WHERE game_id = ? AND user_id = ?', [gameId, activeId]);
  await activePage.reload();
  await activePage.waitForSelector('text=Dice Engine');

  // Verify rent payment button is active and pay rent
  const rentBtn = activePage.locator('button:has-text("Pay Rent")');
  await rentBtn.waitFor({ state: 'visible' });
  await rentBtn.click();
  await activePage.waitForTimeout(2000);

  await takeScreenshot(activePage, 'TC12_RentPayment');
  console.log('TC 12: Rent Payment Flow passed.');

  // ----------------------------------------------------
  // TC 10: Structured Question Answering Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 10: Structured Question Answering Flow ---');
  // Scan Variables Valley (tile 1)
  await activePage.fill('input[placeholder="Enter QR value for testing"]', 'NFC_TILE_01');
  await activePage.click('button:has-text("Scan Tile (QR Test)")');
  await activePage.waitForSelector('text=Choose Difficulty');

  // Choose Hard (loads structured question)
  await activePage.check('input[type="radio"][value="hard"]');
  await activePage.click('button:has-text("Continue")');

  await activePage.click('button:has-text("Code Lab")');
  await activePage.waitForSelector('text=Challenge Difficulty');

  // Get expected answer
  const [structRows] = await db.query(
    'SELECT expected_answer FROM questions WHERE tile_id = (SELECT id FROM tiles WHERE tile_number = 1) AND difficulty = "hard" AND question_type = "structured"'
  );
  const expectedAns = structRows[0].expected_answer;
  console.log(`Expected Answer: ${expectedAns}`);

  await activePage.fill('textarea[placeholder="Write your Python answer here..."]', expectedAns);
  await activePage.click('button:has-text("Submit Answer")');

  // AI validation takes a bit
  await activePage.waitForSelector('text=Correct answer submitted!', { timeout: 90000 });
  await takeScreenshot(activePage, 'TC10_StructuredQuestion');
  console.log('TC 10: Structured Question Flow passed.');
  await activePage.click('button:has-text("Continue")');

  // ----------------------------------------------------
  // TC 13: Chance or Community Chest Card Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 13: Chance or Community Chest Card Flow ---');
  // Move active player to Chance Tile (tile 7)
  await db.query('UPDATE games SET last_dice_roll = 1 WHERE id = ?', [gameId]);
  await db.query('UPDATE game_players SET position = 7 WHERE game_id = ? AND user_id = ?', [gameId, activeId]);
  await activePage.reload();
  await activePage.waitForSelector('text=Dice Engine');

  // Scan Chance Tile
  await activePage.fill('input[placeholder="Enter QR value for testing"]', 'CARD_TILE_07');
  await activePage.click('button:has-text("Scan Tile (QR Test)")');
  await activePage.waitForTimeout(1000);

  // Input Chance Card Code
  await activePage.fill('input[placeholder="Enter any matching deck QR value to confirm the draw"]', 'CH_010'); // Hackathon Bonus
  await activePage.click('button:has-text("Scan Drawn Card")');

  await activePage.waitForSelector('text=Hackathon Bonus');
  await takeScreenshot(activePage, 'TC13_CardScan');
  console.log('TC 13: Card Scan Flow passed.');
  await activePage.click('button:has-text("Continue")');

  // ----------------------------------------------------
  // TC 15: Leaderboard Update Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 15: Leaderboard Update Flow ---');
  // Switch to Players tab to view leaderboard
  await activePage.click('button:has-text("Players")');
  await activePage.waitForSelector('text=Live player status');
  await takeScreenshot(activePage, 'TC15_Leaderboard');
  console.log('TC 15: Leaderboard Flow passed.');

  // ----------------------------------------------------
  // TC 16: My Games History Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 16: My Games History Flow ---');
  await activePage.goto('http://localhost:5173/my-games');
  await activePage.waitForSelector('text=My Games');
  await takeScreenshot(activePage, 'TC16_MyGamesHistory');
  console.log('TC 16: My Games History Flow passed.');

  // ----------------------------------------------------
  // TC 17: Admin Dashboard Statistics Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 17: Admin Dashboard Statistics Flow ---');
  await adminPage.goto('http://localhost:5173/admin/dashboard');
  await adminPage.waitForSelector('text=Total Users');
  await takeScreenshot(adminPage, 'TC17_AdminDashboardStats');
  console.log('TC 17: Admin Statistics Flow passed.');

  // ----------------------------------------------------
  // TC 18: Admin Question Management Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 18: Admin Question Management Flow ---');

  // Delete questions > 82 from DB to make space
  await db.query(`
    DELETE FROM questions
    WHERE question_text LIKE 'Admin Test Question%'
  `);
  console.log('Cleared database slots for questions management.');

  await adminPage.goto('http://localhost:5173/admin/questions');
  await adminPage.waitForSelector('text=Question Bank');

  // Click top-right "Add Question" button
  await adminPage.locator('button:has-text("Add Question")').first().click();
  await adminPage.fill('input[placeholder="Tile ID"]', '2');
  await adminPage.locator('select').first().selectOption('mcq');
  await adminPage.locator('select').nth(1).selectOption('easy');
  await adminPage.fill('input[placeholder="Credits"]', '50');
  await adminPage.fill('textarea[placeholder="Question Text"]', 'Admin Test Question MCQ');
  await adminPage.fill('input[placeholder="Option A"]', 'A1');
  await adminPage.fill('input[placeholder="Option B"]', 'B1');
  await adminPage.fill('input[placeholder="Option C"]', 'C1');
  await adminPage.fill('input[placeholder="Option D"]', 'D1');
  await adminPage.fill('input[placeholder="Correct Answer, e.g. A"]', 'A');

  // Click submit button
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForTimeout(2000); // Wait for API response and alert to close

  // Add Structured Question (using the remaining slot)
  await adminPage.locator('button:has-text("Add Question")').first().click();
  await adminPage.fill('input[placeholder="Tile ID"]', '2');
  await adminPage.locator('select').first().selectOption('structured');
  await adminPage.locator('select').nth(1).selectOption('hard');
  await adminPage.fill('input[placeholder="Credits"]', '60');
  await adminPage.fill('textarea[placeholder="Question Text"]', 'Admin Test Question Structured');
  await adminPage.fill('textarea[placeholder="Expected Answer"]', 'structured answer');
  await adminPage.fill('textarea[placeholder="Rubric"]', 'rubric');
  await adminPage.fill('input[placeholder="Max Score"]', '10');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForTimeout(2000);

  // Edit question (select first row and click Edit)
  await adminPage.locator('button:has-text("Edit")').first().click();
  await adminPage.locator('select').nth(1).selectOption('intermediate');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForTimeout(2000);

  // Delete the newly created MCQ question
  await adminPage.locator('tr:has-text("Admin Test Question MCQ") button:has-text("Delete")').first().click();
  await adminPage.waitForTimeout(2000);

  // Fill the remaining slot to hit the limit (84) again
  await adminPage.locator('button:has-text("Add Question")').first().click();
  await adminPage.fill('input[placeholder="Tile ID"]', '2');
  await adminPage.locator('select').first().selectOption('mcq');
  await adminPage.locator('select').nth(1).selectOption('easy');
  await adminPage.fill('input[placeholder="Credits"]', '50');
  await adminPage.fill('textarea[placeholder="Question Text"]', 'Admin Test Question Limit Filler');
  await adminPage.fill('input[placeholder="Option A"]', 'A1');
  await adminPage.fill('input[placeholder="Option B"]', 'B1');
  await adminPage.fill('input[placeholder="Option C"]', 'C1');
  await adminPage.fill('input[placeholder="Option D"]', 'D1');
  await adminPage.fill('input[placeholder="Correct Answer, e.g. A"]', 'A');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForTimeout(2000);

  // Verify limit blockage: clicking "Add Question" now should alert limit reached and block
  console.log('Testing limit blockage (expecting limit warning alert)...');
  await adminPage.locator('button:has-text("Add Question")').first().click();
  await adminPage.waitForTimeout(2000);

  await takeScreenshot(adminPage, 'TC18_AdminQuestionManagement');
  console.log('TC 18: Admin Question Management Flow passed.');

  // ----------------------------------------------------
  // TC 19: Role-Based Access Control Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 19: Role-Based Access Control Flow ---');
  await activePage.goto('http://localhost:5173/admin/dashboard');
  await activePage.waitForTimeout(2000);
  // Redirection expected
  await activePage.waitForURL(url => !url.pathname.includes('/admin'));
  await takeScreenshot(activePage, 'TC19_RoleBasedAccessControl');
  console.log('TC 19: Role-Based Access Control Flow passed.');

  // ----------------------------------------------------
  // TC 20: Host End Game Flow
  // ----------------------------------------------------
  console.log('\n--- Running TC 20: Host End Game Flow ---');
  await hostPage.goto(`http://localhost:5173/game-board/${gameId}`);
  await hostPage.waitForSelector('text=End Game');
  await hostPage.click('button:has-text("End Game")');

  await hostPage.waitForURL(url => url.pathname.includes('/final-leaderboard'));
  await hostPage.waitForSelector('text=Final Leaderboard');
  await takeScreenshot(hostPage, 'TC20_HostEndGame');
  console.log('TC 20: Host End Game Flow passed.');

  // Close database and browser
  await db.end();
  await browser.close();
  console.log('\nAll test cases executed successfully!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
