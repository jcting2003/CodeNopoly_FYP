# Codenopoly

Codenopoly is a hybrid physical-digital programming learning game inspired by Monopoly. It combines a physical board game with a web/mobile platform where players scan QR/NFC tiles, answer Python questions, earn credits, buy properties, pay rent, and compete on a leaderboard.

The system includes AI-assisted validation using Qwen for structured Python answers and AI-generated hints to support formative learning.

---

## Features

- User registration and login
- Create and join multiplayer game sessions
- Game lobby with host start control
- Digital dice rolling
- QR/NFC tile scanning
- MCQ and structured Python questions
- AI-assisted structured answer validation using Qwen
- AI-generated hints
- Credits and total credits tracking
- Property buying, rent, houses, and hotels
- Chance and Community Chest card scanning
- Leaderboard
- User profile and profile picture upload
- Docker-based setup for easier deployment

---

## Tech Stack

### Backend

- Laravel
- MySQL
- Laravel Sanctum
- Laravel Broadcasting / Pusher
- Ollama + Qwen

### Web Frontend

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Pinia
- Axios
- Laravel Echo

### Mobile App

- Expo Go
- React Native

### DevOps / AI

- Docker
- Docker Compose
- Ollama
- Qwen `qwen2.5-coder:1.5b`

---

## Project Structure

```text
codenopoly/
├── backend/              # Laravel backend
├── web/                  # Vue frontend
├── mobile/               # Expo mobile app
├── docker-compose.yml
├── codenopoly.sql        # Database import file
└── README.md
```

---

## Docker Services

| Service | Container | URL / Port |
|---|---|---|
| Frontend | `codenopoly-frontend` | `http://localhost:5173` |
| Backend | `codenopoly-backend` | `http://localhost:8000` |
| MySQL | `codenopoly-mysql` | `localhost:3307` |
| Ollama | `codenopoly-ollama` | `http://localhost:11434` |

---

## Requirements

Before running this project, install:

- Docker Desktop
- Git, only if cloning from GitHub
- Expo Go, only if testing the mobile app

You do **not** need XAMPP when running the project with Docker.

---

# First-Time Setup Guide

Follow these steps when setting up the project for the first time.

---

## 1. Obtain the Project Files

There are two ways to obtain the project.

### Option A: Download ZIP File

If the project is submitted as a ZIP file:

1. Download the ZIP file.
2. Extract the ZIP file.
3. Open the extracted `codenopoly` folder.
4. Make sure the folder structure looks like this:

```text
codenopoly/
├── backend/
├── web/
├── mobile/
├── docker-compose.yml
├── codenopoly.sql
└── README.md
```

Then open a terminal in the extracted `codenopoly` folder before running the setup commands.

### Option B: Clone from GitHub

```bash
git clone <repository-url>
cd codenopoly
```

Replace `<repository-url>` with the actual GitHub repository link.

---

## 2. Environment Files

For the submitted ZIP version, the required `.env` files may already be included for demonstration purposes.

If the `.env` files are already included, you can continue to **Step 3**.

If the `.env` files are missing, create them manually using the sections below.

---

## 2.1 Backend Environment File

Create this file:

```text
backend/.env
```

Use the following example:

```env
APP_NAME=Codenopoly
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

FRONTEND_URL=http://localhost:5173
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=codenopoly
DB_USERNAME=codenopoly_user
DB_PASSWORD=secret

BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_APP_CLUSTER=ap1

OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=qwen2.5-coder:1.5b

CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

Important:

Inside Docker, Laravel connects to MySQL using:

```env
DB_HOST=mysql
DB_PORT=3306
```

Do **not** use `localhost` for the database inside the backend container.

---

## 2.2 Frontend Environment File

Create this file if needed:

```text
web/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_PUSHER_APP_KEY=your_pusher_app_key
VITE_PUSHER_APP_CLUSTER=ap1
```

The exact variable names may depend on the frontend implementation.

---

## 2.3 Pusher Configuration

This project uses Pusher for real-time multiplayer updates.

For the submitted ZIP version, the `.env` file may already include working Pusher credentials for demonstration purposes.

If setting up manually, update these values in `backend/.env`:

```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_APP_CLUSTER=ap1
```

For a public GitHub repository, real Pusher credentials should **not** be committed. Use `.env.example` instead.

---

## 3. Start Docker Containers

From the project root, run:

```bash
docker compose up -d --build
```

Check that all containers are running:

```bash
docker ps
```

You should see these containers:

```text
codenopoly-frontend
codenopoly-backend
codenopoly-mysql
codenopoly-ollama
```

---

## 4. Clear Laravel Cache

Run these commands after Docker starts:

```bash
docker exec -it codenopoly-backend php artisan config:clear
docker exec -it codenopoly-backend php artisan cache:clear
docker exec -it codenopoly-backend php artisan route:clear
```

---

## 5. Generate Laravel App Key

Run this only if `APP_KEY` in `backend/.env` is empty:

```bash
docker exec -it codenopoly-backend php artisan key:generate
```

If the submitted ZIP already includes a working `.env` with an `APP_KEY`, this step can be skipped.

---

## 6. Set Up the Database

There are two setup options.

Use **Option A** if you want to create a clean database using Laravel migrations and seeders.

Use **Option B** if the submitted ZIP includes `codenopoly.sql` and you want to import the prepared project data.

For ready-to-use setup, **Option B is recommended**.

---

### Option A: Use Migrations and Seeders

Run:

```bash
docker exec -it codenopoly-backend php artisan migrate
docker exec -it codenopoly-backend php artisan db:seed
```

---

### Option B: Import Existing SQL File

Make sure the SQL file is located here:

```text
codenopoly/codenopoly.sql
```

Reset the Docker database:

```powershell
docker exec -i codenopoly-mysql mysql -u root -proot -e "DROP DATABASE IF EXISTS codenopoly; CREATE DATABASE codenopoly;"
```

Import the SQL file:

```powershell
Get-Content .\codenopoly.sql | docker exec -i codenopoly-mysql mysql -u root -proot codenopoly
```

Then run migrations again to apply any newer table changes:

```bash
docker exec -it codenopoly-backend php artisan migrate
```

---

## 7. Create Laravel Storage Link

This is required for profile picture uploads.

```bash
docker exec -it codenopoly-backend php artisan storage:link
```

You only need to run this once during setup, or when the storage link is missing.

---

## 8. Pull the Qwen Model

The project uses Qwen through Ollama for structured answer validation and AI hints.

Run:

```bash
docker exec -it codenopoly-ollama ollama pull qwen2.5-coder:1.5b
```

This may take some time because the model needs to be downloaded.

---

## 9. Test Qwen Manually

Run:

```bash
docker exec -it codenopoly-ollama ollama run qwen2.5-coder:1.5b
```

Try this prompt:

```text
Check if this Python answer is correct:

Question:
Write Python code that converts the string "python" to uppercase and prints the result.

Answer:
print("python".upper())
```

To exit Qwen, type:

```text
/bye
```

---

## 10. Open the Web App

Open the frontend:

```text
http://localhost:5173
```

Backend URL:

```text
http://localhost:8000
```

---

# Quick Setup Summary

For the submitted ZIP version, the usual setup flow is:

```bash
docker compose up -d --build
docker exec -it codenopoly-backend php artisan config:clear
docker exec -it codenopoly-backend php artisan cache:clear
docker exec -it codenopoly-backend php artisan route:clear
docker exec -it codenopoly-backend php artisan storage:link
docker exec -it codenopoly-ollama ollama pull qwen2.5-coder:1.5b
```

If the database is empty, also run:

```powershell
docker exec -i codenopoly-mysql mysql -u root -proot -e "DROP DATABASE IF EXISTS codenopoly; CREATE DATABASE codenopoly;"
Get-Content .\codenopoly.sql | docker exec -i codenopoly-mysql mysql -u root -proot codenopoly
docker exec -it codenopoly-backend php artisan migrate
```

Then open:

```text
http://localhost:5173
```

---

# Running the Project After First-Time Setup

After the first-time setup is completed, you usually only need to run:

```bash
docker compose up -d
```

Then open:

```text
http://localhost:5173
```

To stop the project:

```bash
docker compose down
```

---

# AI Validation

Structured questions are validated using Qwen.

For structured questions, the backend sends the following to Qwen:

- Question text
- Expected answer
- Rubric
- Student answer

Qwen returns JSON like this:

```json
{
  "is_correct": true,
  "score": 100,
  "feedback": "The answer satisfies the question requirement."
}
```

The system controls the actual game credits.

Current rule:

```text
Correct answer → full question credits
Wrong answer → 0 credits
```

This prevents the AI from freely deciding how many credits to award.

---

# AI Hint System

Players can click **Use Hint** before submitting an answer.

The backend asks Qwen to generate a short hint based on:

- Question text
- Rubric

The hint should guide the student without revealing the full answer.

Example:

```text
Question:
Write Python code that creates a list called items and adds the value "apple" to the end of the list.

Hint:
Start by creating an empty list, then use a list method that adds a value to the end.
```

---

# Game Flow

Basic game flow:

1. Open `http://localhost:5173`
2. Register or log in
3. Create a game
4. Copy the game code
5. Open another browser
6. Log in as another user
7. Join the game using the game code
8. Host starts the game
9. Current player rolls dice
10. Player scans the tile QR/NFC value
11. Player chooses difficulty
12. Code Lab opens
13. Player answers the question
14. MCQ is checked normally or structured answer is checked by Qwen
15. Credits are awarded
16. Leaderboard updates
17. Player ends turn
18. Next player continues

---

# Testing Multiplayer

Do not use two normal windows of the same browser for different users because the same browser shares cookies and sessions.

Recommended setup:

```text
Host player: Chrome
Player 2: Edge or Firefox
Player 3: Incognito window or another browser
```

You can also test with:

```text
Host: Web browser
Player 2: Mobile app
```

---

# Database Access

You can access the Docker MySQL database using DBeaver, MySQL Workbench, TablePlus, or another MySQL client.

Connection details:

```text
Host: localhost
Port: 3307
Database: codenopoly
Username: codenopoly_user
Password: secret
```

Alternative root login:

```text
Host: localhost
Port: 3307
Database: codenopoly
Username: root
Password: root
```

If DBeaver shows `Public Key Retrieval is not allowed`, set these driver properties:

```text
allowPublicKeyRetrieval = true
useSSL = false
```

---

# Useful Database Commands

Enter MySQL:

```bash
docker exec -it codenopoly-mysql mysql -u root -proot
```

Use the database:

```sql
USE codenopoly;
```

Show all tables:

```sql
SHOW TABLES;
```

Check users:

```sql
SELECT id, name, email, profile_photo_path
FROM users;
```

Check questions:

```sql
SELECT id, tile_id, question_type, difficulty, credits, question_text
FROM questions
ORDER BY id;
```

Check structured questions:

```sql
SELECT id, tile_id, question_type, difficulty, credits, max_score, question_text
FROM questions
WHERE question_type = 'structured';
```

Check latest player answers and AI feedback:

```sql
SELECT id, game_id, user_id, question_id, selected_answer, is_correct, earned_credits, feedback, answered_at
FROM player_answers
ORDER BY id DESC
LIMIT 10;
```

---

# Running the Mobile App

The mobile app is not Dockerized.

Run it separately:

```bash
cd mobile
npm install
npx expo start
```

Use Expo Go to scan the QR code.

For mobile testing, do not use:

```text
http://localhost:8000
```

because on a phone, `localhost` means the phone itself.

Use your laptop IP address instead.

Example:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.105:8000/api
```

Replace `192.168.0.105` with your actual laptop IP address.

The phone and laptop must be connected to the same Wi-Fi network.

---

# Example Structured Answers for Testing

## Uppercase String

Question:

```text
Write Python code that converts the string "python" to uppercase and prints the result.
```

Answer:

```python
print("python".upper())
```

Alternative answer:

```python
text = "python"
print(text.upper())
```

---

## List Append

Question:

```text
Write Python code that creates a list called items and adds the value "apple" to the end of the list.
```

Answer:

```python
items = []
items.append("apple")
print(items)
```

---

## Recursion

Question:

```text
Explain what recursion means and write a simple recursive function example.
```

Answer:

```python
# Recursion means a function calls itself.

def countdown(n):
    if n <= 0:
        return
    print(n)
    countdown(n - 1)
```

---

## Square Root Import

Question:

```text
Explain what from math import sqrt allows you to do. Give a short code example.
```

Answer:

```python
from math import sqrt

result = sqrt(25)
print(result)
```

---

# Useful Docker Commands

Start containers:

```bash
docker compose up -d
```

Rebuild and start containers:

```bash
docker compose up -d --build
```

Stop containers:

```bash
docker compose down
```

Check running containers:

```bash
docker ps
```

Check backend logs:

```bash
docker logs --tail 80 codenopoly-backend
```

Check frontend logs:

```bash
docker logs --tail 80 codenopoly-frontend
```

Check Laravel logs:

```bash
docker exec -it codenopoly-backend tail -n 100 storage/logs/laravel.log
```

Clear Laravel cache:

```bash
docker exec -it codenopoly-backend php artisan config:clear
docker exec -it codenopoly-backend php artisan cache:clear
docker exec -it codenopoly-backend php artisan route:clear
```

Run migrations:

```bash
docker exec -it codenopoly-backend php artisan migrate
```

Run seeders:

```bash
docker exec -it codenopoly-backend php artisan db:seed
```

Fresh migrate and seed:

```bash
docker exec -it codenopoly-backend php artisan migrate:fresh --seed
```

Create storage link:

```bash
docker exec -it codenopoly-backend php artisan storage:link
```

Pull Qwen model:

```bash
docker exec -it codenopoly-ollama ollama pull qwen2.5-coder:1.5b
```

Run Qwen manually:

```bash
docker exec -it codenopoly-ollama ollama run qwen2.5-coder:1.5b
```

---

# Troubleshooting

## Frontend Container Keeps Restarting

Check frontend logs:

```bash
docker logs --tail 80 codenopoly-frontend
```

Common issue:

```text
/app/package.json not found
```

Fix:

Make sure the frontend service in `docker-compose.yml` points to the `web` folder:

```yaml
frontend:
  build:
    context: ./web
    dockerfile: Dockerfile
  volumes:
    - ./web:/app
    - /app/node_modules
```

---

## Backend Cannot Connect to MySQL

Make sure `backend/.env` uses:

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=codenopoly
DB_USERNAME=codenopoly_user
DB_PASSWORD=secret
```

Then clear config:

```bash
docker exec -it codenopoly-backend php artisan config:clear
```

---

## Profile Picture Does Not Show

Run:

```bash
docker exec -it codenopoly-backend php artisan storage:link
```

Check that the uploaded file exists:

```bash
docker exec -it codenopoly-backend ls storage/app/public/profile-photos
```

The image should be accessible from:

```text
http://localhost:8000/storage/profile-photos/<file-name>
```

---

## Qwen Gives 0 Credits for a Correct Answer

Check Laravel logs:

```bash
docker exec -it codenopoly-backend tail -n 100 storage/logs/laravel.log
```

Check latest answer records:

```sql
SELECT id, question_id, selected_answer, is_correct, earned_credits, feedback, answered_at
FROM player_answers
ORDER BY id DESC
LIMIT 5;
```

Possible causes:

- Qwen model is not downloaded
- Ollama container is not running
- Laravel cannot connect to Ollama
- Qwen response is not valid JSON
- The question does not have `expected_answer` or `rubric`

---

## Qwen Model Is Missing

Pull the model again:

```bash
docker exec -it codenopoly-ollama ollama pull qwen2.5-coder:1.5b
```

---

## DBeaver Cannot Connect to MySQL

Use:

```text
Host: localhost
Port: 3307
Username: codenopoly_user
Password: secret
```

If DBeaver shows public key retrieval error, add:

```text
allowPublicKeyRetrieval = true
useSSL = false
```

---

# Notes

- XAMPP is not required when using Docker.
- Docker MySQL uses host port `3307`.
- Laravel inside Docker connects to MySQL using `DB_HOST=mysql`.
- Laravel inside Docker connects to Ollama using `OLLAMA_BASE_URL=http://ollama:11434`.
- The mobile app should be run separately using Expo Go.
- Use different browsers when testing multiple players.
- Run `php artisan storage:link` only during first setup or when the storage link is missing.
- If real Pusher credentials are included in the submitted ZIP, do not publish the ZIP publicly.

---

# Project Status

Current working features:

- Docker setup
- Laravel backend
- Vue frontend
- MySQL database
- Ollama + Qwen
- MCQ question validation
- Structured question validation
- AI feedback
- AI hint generation
- Credits update
- Leaderboard update
- Profile picture upload
- Property and rent system
- Card scanning system

---

# Credits

This project was developed as a final-year software engineering project to support interactive Python programming learning through a hybrid physical-digital game experience.

The AI-assisted validation feature uses Qwen through Ollama to provide local, free, and privacy-friendly answer checking for structured programming responses.