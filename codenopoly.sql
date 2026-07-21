-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: codenopoly
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `card_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_type` enum('community_chest','chance') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `effect_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `effect_value` int DEFAULT NULL,
  `target_tile_number` bigint unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cards_card_code_unique` (`card_code`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (1,'CC_001','community_chest','Debugging Help','Gain 40 credits.','credits_add',40,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(2,'CC_002','community_chest','Peer Support Session','Gain 30 credits.','credits_add',30,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(3,'CC_003','community_chest','Completed Practice Quiz','Gain 50 credits.','credits_add',50,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(4,'CC_004','community_chest','Code Review Bonus','Gain 60 credits.','credits_add',60,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(5,'CC_005','community_chest','Refactored Your Code Successfully','Gain 40 credits.','credits_add',40,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(6,'CC_006','community_chest','Syntax Mistake Found Early','Gain 20 credits.','credits_add',20,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(7,'CC_007','community_chest','Asked Lecturer for Help','Gain 30 credits.','credits_add',30,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(8,'CC_008','community_chest','Version Backup Saved You','Gain 50 credits.','credits_add',50,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(9,'CC_009','community_chest','Extra Lab Participation','Gain 40 credits.','credits_add',40,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(10,'CC_010','community_chest','Library Study Session','Gain 30 credits.','credits_add',30,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(11,'CC_011','community_chest','Late Submission Penalty','Lose 20 credits.','credits_deduct',20,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(12,'CC_012','community_chest','Forgot Semicolon... Wait, Python Doesn\'t Need It','Gain 20 credits.','credits_add',20,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(13,'CC_013','community_chest','Internet Connection Issue During Practice','Lose 30 credits.','credits_deduct',30,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(14,'CC_014','community_chest','Keyboard Shortcut Mastery','Gain 25 credits.','credits_add',25,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(15,'CC_015','community_chest','Memory Leak Avoided','Gain 40 credits.','credits_add',40,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(16,'CH_001','chance','Advance to Go','Move to GO and collect reward.','move_to_go',NULL,0,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(17,'CH_002','chance','Advance to Nearest Railroad','Move to the nearest railroad.','move_to_tile',NULL,5,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(18,'CH_003','chance','Advance to Nearest Utility','Move to the nearest utility.','move_to_tile',NULL,12,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(19,'CH_004','chance','Jump to Class City','Move to Class City.','move_to_tile',NULL,37,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(20,'CH_005','chance','Jump to Variables Valley','Move to Variables Valley.','move_to_tile',NULL,1,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(21,'CH_006','chance','Jump to Debugging Depot','Move to Debugging Depot.','move_to_tile',NULL,5,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(22,'CH_007','chance','Unexpected Bug Appears','Lose 50 credits.','credits_deduct',50,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(23,'CH_008','chance','Runtime Error','Lose 40 credits.','credits_deduct',40,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(24,'CH_009','chance','Found a Hidden Optimization','Gain 80 credits.','credits_add',80,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(25,'CH_010','chance','Hackathon Bonus','Gain 100 credits.','credits_add',100,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(26,'CH_011','chance','Laptop Battery Died','Lose 60 credits.','credits_deduct',60,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(27,'CH_012','chance','Code Compiled on First Try','Gain 70 credits.','credits_add',70,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(28,'CH_013','chance','Infinite Loop Trap','Move back 3 spaces.','move_backward',3,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(29,'CH_014','chance','Exam Week Stress','Lose 40 credits.','credits_deduct',40,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(30,'CH_015','chance','Open Source Contribution Accepted','Gain 90 credits.','credits_add',90,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(31,'CH_016','chance','Corrupted File','Lose 50 credits.','credits_deduct',50,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47'),(32,'CH_017','chance','Lucky Stack Overflow Search','Gain 60 credits.','credits_add',60,NULL,1,'2026-04-24 13:54:47','2026-04-24 13:54:47');
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_players`
--

DROP TABLE IF EXISTS `game_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_players` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `game_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `credits` int NOT NULL DEFAULT '100',
  `total_credits` int NOT NULL DEFAULT '100',
  `position` int NOT NULL DEFAULT '0',
  `skip_turns` int unsigned NOT NULL DEFAULT '0',
  `last_rent_paid_turn` bigint unsigned DEFAULT NULL,
  `last_rent_paid_property_id` bigint unsigned DEFAULT NULL,
  `last_house_bought_turn` bigint unsigned DEFAULT NULL,
  `last_house_bought_property_id` bigint unsigned DEFAULT NULL,
  `last_property_bought_turn` bigint unsigned DEFAULT NULL,
  `last_property_bought_property_id` bigint unsigned DEFAULT NULL,
  `last_question_answered_turn` int unsigned DEFAULT NULL,
  `last_card_scanned_turn` int unsigned DEFAULT NULL,
  `last_hotel_purchase_turn` bigint unsigned DEFAULT NULL,
  `joined_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `game_players_game_id_user_id_unique` (`game_id`,`user_id`),
  KEY `game_players_user_id_foreign` (`user_id`),
  CONSTRAINT `game_players_game_id_foreign` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `game_players_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_players`
--

LOCK TABLES `game_players` WRITE;
/*!40000 ALTER TABLE `game_players` DISABLE KEYS */;
INSERT INTO `game_players` VALUES (1,1,2,100,100,15,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-13 05:20:09','2026-05-13 05:20:09','2026-05-13 05:25:28'),(2,1,3,0,100,8,0,NULL,NULL,NULL,NULL,4,5,NULL,NULL,NULL,'2026-05-13 05:23:59','2026-05-13 05:23:59','2026-05-13 05:25:59'),(3,2,2,140,140,25,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-13 05:43:33','2026-05-13 05:43:33','2026-05-13 06:00:16'),(4,2,3,100,100,28,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-13 05:44:23','2026-05-13 05:44:23','2026-05-13 06:00:28'),(5,3,2,52,212,14,0,NULL,NULL,NULL,NULL,30,10,NULL,NULL,NULL,'2026-05-13 06:01:22','2026-05-13 06:01:22','2026-05-13 06:25:08'),(6,3,3,138,320,14,0,31,10,NULL,NULL,28,2,NULL,NULL,NULL,'2026-05-13 06:02:10','2026-05-13 06:02:10','2026-05-13 06:25:08'),(7,4,2,100,100,13,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-13 06:25:46','2026-05-13 06:25:46','2026-05-13 06:26:59'),(8,4,3,100,100,14,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-13 06:25:51','2026-05-13 06:25:51','2026-05-13 06:27:10'),(9,5,1,100,100,10,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-28 09:51:07','2026-05-28 09:51:07','2026-05-28 09:57:31'),(10,5,2,140,140,5,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-28 09:56:55','2026-05-28 09:56:55','2026-05-28 10:02:11'),(11,6,1,100,100,4,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-03 11:32:43','2026-06-03 11:32:43','2026-06-03 11:36:41'),(12,6,2,300,300,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-03 11:36:11','2026-06-03 11:36:11','2026-06-03 11:41:07'),(13,7,3,100,100,9,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-05 14:52:44','2026-06-05 14:52:44','2026-06-05 15:04:10'),(14,7,1,100,100,4,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-05 14:53:07','2026-06-05 14:53:07','2026-06-05 15:04:28'),(15,8,5,100,100,5,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-30 07:24:20','2026-06-30 07:24:20','2026-06-30 07:24:49'),(16,8,2,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-30 07:24:30','2026-06-30 07:24:30','2026-06-30 07:24:30'),(17,9,6,140,140,1,0,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-30 07:28:18','2026-06-30 07:28:18','2026-06-30 07:29:00'),(18,9,2,100,100,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-30 07:28:31','2026-06-30 07:28:31','2026-06-30 07:28:31'),(19,10,7,140,140,1,0,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-30 07:32:17','2026-06-30 07:32:17','2026-06-30 07:33:10'),(20,10,2,200,200,1,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,'2026-06-30 07:32:30','2026-06-30 07:32:30','2026-06-30 07:34:04'),(21,11,8,80,140,1,0,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,'2026-06-30 07:37:11','2026-06-30 07:37:11','2026-06-30 07:37:59'),(22,11,2,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-30 07:37:25','2026-06-30 07:37:25','2026-06-30 07:37:25'),(23,12,9,82,142,1,0,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,'2026-06-30 07:41:16','2026-06-30 07:41:16','2026-06-30 07:42:10'),(24,12,2,298,300,7,0,2,1,NULL,NULL,NULL,NULL,2,2,NULL,'2026-06-30 07:41:24','2026-06-30 07:41:24','2026-06-30 07:42:49'),(25,13,10,82,142,1,0,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,'2026-06-30 07:46:16','2026-06-30 07:46:16','2026-06-30 07:47:16'),(26,13,2,298,300,7,0,2,1,NULL,NULL,NULL,NULL,2,2,NULL,'2026-06-30 07:46:30','2026-06-30 07:46:30','2026-06-30 07:47:39'),(27,14,11,82,142,1,0,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,'2026-06-30 07:50:53','2026-06-30 07:50:53','2026-06-30 07:51:51'),(28,14,2,298,300,7,0,2,1,NULL,NULL,NULL,NULL,2,2,NULL,'2026-06-30 07:51:07','2026-06-30 07:51:07','2026-06-30 07:52:09'),(29,15,12,82,142,1,0,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,'2026-06-30 07:55:13','2026-06-30 07:55:13','2026-06-30 07:56:09'),(30,15,2,298,300,7,0,2,1,NULL,NULL,NULL,NULL,2,2,NULL,'2026-06-30 07:55:23','2026-06-30 07:55:23','2026-06-30 07:56:37'),(31,16,13,82,142,1,0,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,'2026-06-30 08:00:15','2026-06-30 08:00:15','2026-06-30 08:01:02'),(32,16,2,298,300,7,0,2,1,NULL,NULL,NULL,NULL,2,2,NULL,'2026-06-30 08:00:28','2026-06-30 08:00:28','2026-06-30 08:01:18'),(33,17,14,82,142,1,0,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,'2026-06-30 08:05:30','2026-06-30 08:05:30','2026-06-30 08:06:46'),(34,17,2,198,200,1,0,2,1,NULL,NULL,NULL,NULL,2,NULL,NULL,'2026-06-30 08:05:45','2026-06-30 08:05:45','2026-06-30 08:07:21'),(35,18,15,82,142,1,0,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,'2026-06-30 08:10:39','2026-06-30 08:10:39','2026-06-30 08:11:56'),(36,18,2,298,300,7,0,2,1,NULL,NULL,NULL,NULL,2,2,NULL,'2026-06-30 08:10:53','2026-06-30 08:10:53','2026-06-30 08:12:18'),(37,19,2,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-01 01:29:12','2026-07-01 01:29:12','2026-07-01 01:29:12'),(38,19,1,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-01 01:29:19','2026-07-01 01:29:19','2026-07-01 01:29:19'),(39,20,1,86,540,18,0,33,13,19,3,29,1,5,31,NULL,'2026-07-01 14:49:42','2026-07-01 14:49:42','2026-07-01 15:12:50'),(40,20,2,14,494,31,0,NULL,NULL,NULL,NULL,30,12,6,32,NULL,'2026-07-01 14:49:52','2026-07-01 14:49:52','2026-07-01 15:13:39'),(42,22,1,20,160,11,0,NULL,NULL,NULL,NULL,3,7,1,NULL,NULL,'2026-07-02 02:47:27','2026-07-02 02:47:27','2026-07-02 02:57:38'),(43,22,2,100,100,9,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,'2026-07-02 02:48:16','2026-07-02 02:48:16','2026-07-02 02:56:02'),(44,23,2,160,160,13,0,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,'2026-07-02 05:14:24','2026-07-02 05:14:24','2026-07-02 05:20:30'),(45,23,1,100,100,14,0,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,'2026-07-02 05:15:13','2026-07-02 05:15:13','2026-07-02 05:22:40'),(46,24,1,100,100,15,0,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-07-02 06:45:29','2026-07-02 06:45:29','2026-07-02 06:51:44'),(47,24,2,100,100,7,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-02 06:45:38','2026-07-02 06:45:38','2026-07-02 06:51:55'),(48,25,1,100,100,21,0,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-07-02 09:05:10','2026-07-02 09:05:10','2026-07-02 09:09:52'),(49,25,2,140,140,19,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,'2026-07-02 09:05:51','2026-07-02 09:05:51','2026-07-02 09:10:14'),(50,26,1,10,160,28,0,NULL,NULL,NULL,NULL,10,21,4,NULL,NULL,'2026-07-03 10:46:32','2026-07-03 10:46:32','2026-07-03 10:54:44'),(51,26,2,100,300,10,0,NULL,NULL,NULL,NULL,8,3,5,8,NULL,'2026-07-03 10:46:38','2026-07-03 10:46:38','2026-07-03 10:54:49'),(52,26,3,140,140,20,0,NULL,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,'2026-07-03 10:46:44','2026-07-03 10:46:44','2026-07-03 10:54:32'),(53,27,1,100,100,32,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-03 11:00:09','2026-07-03 11:00:09','2026-07-03 11:02:52'),(54,27,2,220,220,36,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,11,NULL,'2026-07-03 11:00:18','2026-07-03 11:00:18','2026-07-03 11:03:09'),(55,27,3,100,100,18,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-03 11:00:24','2026-07-03 11:00:24','2026-07-03 11:02:42'),(56,28,1,14,194,34,0,NULL,NULL,NULL,NULL,4,13,13,1,NULL,'2026-07-03 11:26:11','2026-07-03 11:26:11','2026-07-03 11:34:54'),(57,28,2,106,260,19,0,5,13,NULL,NULL,11,7,2,8,NULL,'2026-07-03 11:26:14','2026-07-03 11:26:14','2026-07-03 11:35:06'),(58,28,3,280,280,31,0,NULL,NULL,NULL,NULL,NULL,NULL,6,9,NULL,'2026-07-03 11:26:36','2026-07-03 11:26:36','2026-07-03 11:35:24'),(59,29,2,150,300,27,0,NULL,NULL,NULL,NULL,7,21,3,9,NULL,'2026-07-03 11:47:03','2026-07-03 11:47:03','2026-07-03 11:59:15'),(60,29,3,160,300,11,0,NULL,NULL,NULL,NULL,6,9,16,4,NULL,'2026-07-03 11:47:35','2026-07-03 11:47:35','2026-07-03 12:02:25'),(61,33,1,100,100,3,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-07 08:53:22','2026-07-07 08:53:22','2026-07-07 08:53:52'),(62,33,2,100,100,5,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-07 08:53:29','2026-07-07 08:53:29','2026-07-07 08:53:56'),(63,34,1,200,200,20,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 03:24:50','2026-07-08 03:24:50','2026-07-08 03:27:52'),(64,34,2,225,285,3,0,NULL,NULL,NULL,NULL,12,2,NULL,4,NULL,'2026-07-08 03:24:58','2026-07-08 03:24:58','2026-07-08 03:27:42'),(65,35,1,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 03:28:42','2026-07-08 03:28:42','2026-07-08 03:28:42'),(66,35,2,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 03:29:01','2026-07-08 03:29:01','2026-07-08 03:29:01'),(67,36,1,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 03:31:06','2026-07-08 03:31:06','2026-07-08 03:31:06'),(68,36,2,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 03:31:10','2026-07-08 03:31:10','2026-07-08 03:31:10'),(69,37,1,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 03:33:23','2026-07-08 03:33:23','2026-07-08 03:33:23'),(70,37,2,100,100,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 03:33:40','2026-07-08 03:33:40','2026-07-08 03:33:40'),(71,38,1,240,240,9,0,NULL,NULL,NULL,NULL,NULL,NULL,3,1,NULL,'2026-07-08 06:43:06','2026-07-08 06:43:06','2026-07-08 06:45:04'),(72,38,2,100,100,9,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 06:43:13','2026-07-08 06:43:13','2026-07-08 06:44:37'),(73,39,1,300,300,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,'2026-07-08 08:55:39','2026-07-08 08:55:39','2026-07-08 09:23:10'),(74,39,2,100,100,18,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 08:55:48','2026-07-08 08:55:48','2026-07-08 09:23:20'),(75,40,1,100,100,10,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 09:28:07','2026-07-08 09:28:07','2026-07-08 09:29:36'),(76,40,2,100,100,7,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 09:28:40','2026-07-08 09:28:40','2026-07-08 09:31:37'),(77,41,1,100,100,8,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 09:32:31','2026-07-08 09:32:31','2026-07-08 09:32:47'),(78,41,2,100,100,11,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 09:32:36','2026-07-08 09:32:36','2026-07-08 09:32:51'),(79,42,1,100,100,5,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 09:54:15','2026-07-08 09:54:15','2026-07-08 09:54:45'),(80,42,2,100,100,5,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-08 09:54:31','2026-07-08 09:54:31','2026-07-08 09:54:58'),(81,43,1,177,505,9,0,27,6,NULL,NULL,25,1,19,1,NULL,'2026-07-08 10:10:15','2026-07-08 10:10:15','2026-07-08 10:21:46'),(82,43,2,93,598,35,0,28,26,NULL,NULL,22,6,18,12,NULL,'2026-07-08 10:10:20','2026-07-08 10:10:20','2026-07-08 10:21:46'),(83,44,1,130,130,29,0,NULL,NULL,NULL,NULL,NULL,NULL,7,3,NULL,'2026-07-08 14:30:44','2026-07-08 14:30:44','2026-07-08 15:22:31'),(84,44,2,200,200,21,0,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,'2026-07-08 14:30:51','2026-07-08 14:30:51','2026-07-08 14:47:58');
/*!40000 ALTER TABLE `game_players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_properties`
--

DROP TABLE IF EXISTS `game_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_properties` (
  `game_id` bigint unsigned NOT NULL,
  `property_id` bigint unsigned NOT NULL,
  `owner_user_id` bigint unsigned DEFAULT NULL,
  `houses` int NOT NULL DEFAULT '0',
  `has_hotel` tinyint(1) NOT NULL DEFAULT '0',
  `purchased_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `game_properties_game_id_property_id_unique` (`game_id`,`property_id`),
  KEY `game_properties_property_id_foreign` (`property_id`),
  KEY `game_properties_owner_user_id_foreign` (`owner_user_id`),
  CONSTRAINT `game_properties_game_id_foreign` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `game_properties_owner_user_id_foreign` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `game_properties_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_properties`
--

LOCK TABLES `game_properties` WRITE;
/*!40000 ALTER TABLE `game_properties` DISABLE KEYS */;
INSERT INTO `game_properties` VALUES (1,5,3,0,0,'2026-05-13 05:25:59','2026-05-13 05:25:59','2026-05-13 05:25:59'),(3,1,3,4,1,'2026-05-13 06:19:26','2026-05-13 06:19:26','2026-05-13 06:22:26'),(3,2,3,0,0,'2026-05-13 06:23:17','2026-05-13 06:23:17','2026-05-13 06:23:17'),(3,10,2,0,0,'2026-05-13 06:23:49','2026-05-13 06:23:49','2026-05-13 06:23:49'),(9,1,NULL,0,0,NULL,'2026-06-30 07:29:09','2026-06-30 07:29:09'),(10,1,NULL,0,0,NULL,'2026-06-30 07:33:28','2026-06-30 07:33:28'),(11,1,8,0,0,'2026-06-30 07:37:58','2026-06-30 07:37:57','2026-06-30 07:37:58'),(12,1,9,0,0,'2026-06-30 07:41:56','2026-06-30 07:41:56','2026-06-30 07:41:56'),(13,1,10,0,0,'2026-06-30 07:47:02','2026-06-30 07:47:02','2026-06-30 07:47:02'),(14,1,11,0,0,'2026-06-30 07:51:40','2026-06-30 07:51:40','2026-06-30 07:51:40'),(15,1,12,0,0,'2026-06-30 07:55:56','2026-06-30 07:55:56','2026-06-30 07:55:56'),(16,1,13,0,0,'2026-06-30 08:00:54','2026-06-30 08:00:54','2026-06-30 08:00:54'),(17,1,14,0,0,'2026-06-30 08:06:33','2026-06-30 08:06:33','2026-06-30 08:06:33'),(18,1,15,0,0,'2026-06-30 08:11:34','2026-06-30 08:11:34','2026-06-30 08:11:34'),(20,1,1,0,0,'2026-07-01 15:09:48','2026-07-01 15:09:48','2026-07-01 15:09:48'),(20,3,1,1,0,'2026-07-01 15:00:23','2026-07-01 15:00:23','2026-07-01 15:05:32'),(20,6,2,0,0,'2026-07-01 15:09:31','2026-07-01 15:09:31','2026-07-01 15:09:31'),(20,7,1,0,0,'2026-07-01 15:06:46','2026-07-01 15:06:46','2026-07-01 15:06:46'),(20,12,2,0,0,'2026-07-01 15:10:07','2026-07-01 15:10:07','2026-07-01 15:10:07'),(20,13,2,0,0,'2026-07-01 14:58:58','2026-07-01 14:58:58','2026-07-01 14:58:58'),(22,7,1,0,0,'2026-07-02 02:57:38','2026-07-02 02:57:38','2026-07-02 02:57:38'),(26,3,2,0,0,'2026-07-03 10:53:35','2026-07-03 10:53:35','2026-07-03 10:53:35'),(26,21,1,0,0,'2026-07-03 10:54:44','2026-07-03 10:54:44','2026-07-03 10:54:44'),(28,7,2,0,0,'2026-07-03 11:33:23','2026-07-03 11:33:22','2026-07-03 11:33:23'),(28,12,NULL,0,0,NULL,'2026-07-03 11:29:05','2026-07-03 11:29:05'),(28,13,1,0,0,'2026-07-03 11:28:01','2026-07-03 11:28:01','2026-07-03 11:28:01'),(28,14,NULL,0,0,NULL,'2026-07-03 11:35:13','2026-07-03 11:35:13'),(28,21,NULL,0,0,NULL,'2026-07-03 11:33:08','2026-07-03 11:33:08'),(29,9,3,0,0,'2026-07-03 11:56:59','2026-07-03 11:56:59','2026-07-03 11:56:59'),(29,21,2,0,0,'2026-07-03 11:57:16','2026-07-03 11:57:16','2026-07-03 11:57:16'),(34,2,2,0,0,'2026-07-08 03:27:42','2026-07-08 03:27:42','2026-07-08 03:27:42'),(43,1,1,0,0,'2026-07-08 10:21:15','2026-07-08 10:21:15','2026-07-08 10:21:15'),(43,2,1,0,0,'2026-07-08 10:15:39','2026-07-08 10:15:39','2026-07-08 10:15:39'),(43,3,2,0,0,'2026-07-08 10:16:45','2026-07-08 10:16:45','2026-07-08 10:16:45'),(43,6,2,0,0,'2026-07-08 10:20:52','2026-07-08 10:20:52','2026-07-08 10:20:52'),(43,10,2,0,0,'2026-07-08 10:17:29','2026-07-08 10:17:29','2026-07-08 10:17:29'),(43,26,1,0,0,'2026-07-08 10:14:49','2026-07-08 10:14:49','2026-07-08 10:14:49');
/*!40000 ALTER TABLE `game_properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `host_id` bigint unsigned NOT NULL,
  `current_turn_user_id` bigint unsigned DEFAULT NULL,
  `game_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'waiting',
  `turn_number` int NOT NULL DEFAULT '1',
  `last_dice_roll` int DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `games_game_code_unique` (`game_code`),
  KEY `games_current_turn_user_id_foreign` (`current_turn_user_id`),
  CONSTRAINT `games_current_turn_user_id_foreign` FOREIGN KEY (`current_turn_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,2,3,'RIRNGQ','ended',4,6,'2026-05-13 05:24:44','2026-05-13 05:26:16','2026-05-13 05:20:09','2026-05-13 05:26:16'),(2,2,3,'G2MWDN','ended',8,4,'2026-05-13 05:44:29','2026-05-13 06:00:59','2026-05-13 05:43:32','2026-05-13 06:00:59'),(3,2,2,'XCFJE1','ended',32,NULL,'2026-05-13 06:02:17','2026-05-13 06:25:36','2026-05-13 06:01:22','2026-05-13 06:25:36'),(4,2,3,'KX78GF','ended',4,7,'2026-05-13 06:26:02','2026-05-13 06:28:22','2026-05-13 06:25:46','2026-05-13 06:28:22'),(5,1,1,'ZOEWVR','ended',3,NULL,'2026-05-28 09:57:12','2026-05-28 10:02:40','2026-05-28 09:51:07','2026-05-28 10:02:40'),(6,1,1,'0J74NU','ended',3,NULL,'2026-06-03 11:36:27','2026-06-03 11:42:00','2026-06-03 11:32:43','2026-06-03 11:42:00'),(7,2,3,'5PXJDW','ended',3,NULL,'2026-06-05 14:53:23','2026-06-05 15:22:55','2026-06-05 14:48:38','2026-06-05 15:22:55'),(8,5,5,'U3UKPA','started',1,5,'2026-06-30 07:24:41',NULL,'2026-06-30 07:24:20','2026-06-30 07:24:49'),(9,6,2,'FGRT0B','started',2,NULL,'2026-06-30 07:28:44',NULL,'2026-06-30 07:28:18','2026-06-30 07:29:09'),(10,7,2,'PDVNAE','started',2,1,'2026-06-30 07:32:43',NULL,'2026-06-30 07:32:17','2026-06-30 07:33:28'),(11,8,2,'HNHQSK','started',2,NULL,'2026-06-30 07:37:39',NULL,'2026-06-30 07:37:11','2026-06-30 07:38:02'),(12,9,2,'ZJNN2M','started',2,1,'2026-06-30 07:41:38',NULL,'2026-06-30 07:41:16','2026-06-30 07:42:01'),(13,10,2,'WED6NS','started',2,1,'2026-06-30 07:46:43',NULL,'2026-06-30 07:46:16','2026-06-30 07:47:07'),(14,11,2,'HTZ69C','started',2,1,'2026-06-30 07:51:19',NULL,'2026-06-30 07:50:53','2026-06-30 07:51:44'),(15,12,2,'VVUQFP','started',2,1,'2026-06-30 07:55:36',NULL,'2026-06-30 07:55:13','2026-06-30 07:56:01'),(16,13,2,'OXVFC9','ended',2,1,'2026-06-30 08:00:41','2026-06-30 08:02:05','2026-06-30 08:00:15','2026-06-30 08:02:05'),(17,14,14,'PV6TWK','started',3,NULL,'2026-06-30 08:06:03',NULL,'2026-06-30 08:05:30','2026-07-01 01:33:59'),(18,15,2,'SEUHSX','ended',2,1,'2026-06-30 08:11:09','2026-06-30 08:13:28','2026-06-30 08:10:39','2026-06-30 08:13:28'),(19,2,2,'VQKFLR','ended',1,NULL,'2026-07-01 01:29:40','2026-07-01 01:33:18','2026-07-01 01:29:12','2026-07-01 01:33:18'),(20,1,1,'YWH5M2','ended',35,NULL,'2026-07-01 14:50:09','2026-07-01 15:14:08','2026-07-01 14:49:42','2026-07-01 15:14:08'),(22,1,2,'PXPFY9','ended',4,NULL,'2026-07-02 02:48:33','2026-07-02 03:00:38','2026-07-02 02:47:27','2026-07-02 03:00:38'),(23,2,2,'1TNUZE','ended',5,NULL,'2026-07-02 05:16:08','2026-07-02 05:22:55','2026-07-02 05:14:24','2026-07-02 05:22:55'),(24,1,2,'9ZMDGB','ended',4,2,'2026-07-02 06:45:52','2026-07-02 06:52:02','2026-07-02 06:45:29','2026-07-02 06:52:02'),(25,1,1,'JGJXTA','ended',5,NULL,'2026-07-02 09:06:18','2026-07-02 09:10:28','2026-07-02 09:05:10','2026-07-02 09:10:28'),(26,1,3,'ZIDZNF','ended',12,NULL,'2026-07-03 10:46:48','2026-07-03 10:55:29','2026-07-03 10:46:32','2026-07-03 10:55:29'),(27,1,2,'HXWMHQ','ended',11,10,'2026-07-03 11:00:42','2026-07-03 11:05:41','2026-07-03 11:00:09','2026-07-03 11:05:41'),(28,1,3,'5FBZGV','ended',15,4,'2026-07-03 11:26:38','2026-07-03 11:35:37','2026-07-03 11:26:11','2026-07-03 11:35:37'),(29,1,2,'KWNQMT','ended',17,NULL,'2026-07-03 11:47:39','2026-07-03 12:02:47','2026-07-03 11:46:57','2026-07-03 12:02:47'),(33,1,1,'SQTOTR','ended',3,NULL,'2026-07-07 08:53:48','2026-07-07 08:54:03','2026-07-07 08:53:22','2026-07-07 08:54:03'),(34,1,2,'8JGSSB','ended',14,NULL,'2026-07-08 03:25:02','2026-07-08 03:28:02','2026-07-08 03:24:47','2026-07-08 03:28:02'),(35,1,1,'WZWWSM','ended',1,NULL,'2026-07-08 03:29:09','2026-07-08 03:29:52','2026-07-08 03:28:42','2026-07-08 03:29:52'),(36,1,1,'SPPZNG','ended',1,NULL,'2026-07-08 03:31:23','2026-07-08 03:32:30','2026-07-08 03:31:06','2026-07-08 03:32:30'),(37,1,1,'E7GSVQ','ended',1,NULL,'2026-07-08 03:33:45','2026-07-08 03:33:50','2026-07-08 03:33:23','2026-07-08 03:33:50'),(38,1,2,'XCUY5Z','ended',4,NULL,'2026-07-08 06:43:25','2026-07-08 06:45:38','2026-07-08 06:43:06','2026-07-08 06:45:38'),(39,1,1,'YPSOMW','ended',5,NULL,'2026-07-08 08:56:05','2026-07-08 09:23:39','2026-07-08 08:55:39','2026-07-08 09:23:39'),(40,1,2,'EMOUS9','ended',2,7,'2026-07-08 09:28:44','2026-07-08 09:32:23','2026-07-08 09:28:07','2026-07-08 09:32:23'),(41,1,1,'JFLJ1V','ended',3,NULL,'2026-07-08 09:32:40','2026-07-08 09:33:12','2026-07-08 09:32:31','2026-07-08 09:33:12'),(42,1,2,'HVH3FZ','ended',2,5,'2026-07-08 09:54:34','2026-07-08 15:28:10','2026-07-08 09:54:15','2026-07-08 15:28:10'),(43,1,2,'RVW2FY','ended',28,11,'2026-07-08 10:10:22','2026-07-08 10:21:58','2026-07-08 10:10:15','2026-07-08 10:21:58'),(44,1,2,'1V6Z0S','ended',8,NULL,'2026-07-08 14:30:53','2026-07-08 15:22:39','2026-07-08 14:30:44','2026-07-08 15:22:39');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2026_04_20_140900_create_games_table',1),(6,'2026_04_20_141051_create_game_players_table',1),(7,'2026_04_20_145853_create_tiles_table',1),(8,'2026_04_20_145903_create_questions_table',1),(9,'2026_04_21_055246_create_player_answers_table',1),(10,'2026_04_21_062905_create_properties_table',1),(11,'2026_04_21_063043_create_game_properties_table',1),(12,'2026_04_21_074332_add_turn_fields_to_games_table',1),(13,'2026_04_21_074424_add_position_to_game_players_table',1),(14,'2026_04_24_111721_add_rent_tracking_to_game_players_table',2),(15,'2026_04_24_113125_add_last_hotel_purchase_turn_to_game_players_table',3),(16,'2026_04_24_113442_add_house_tracking_to_game_players_table',4),(17,'2026_04_24_135304_create_cards_table',5),(18,'2026_04_24_150521_add_property_purchase_tracking_to_game_players_table',6),(19,'2026_04_24_153317_add_skip_turns_to_game_players_table',7),(20,'2026_05_05_081808_add_profile_photo_path_to_users_table',8),(21,'2026_05_08_093255_update_selected_answer_column_in_player_answers_table',8),(22,'2026_06_10_131006_add_role_to_users_table',9),(23,'2026_06_23_082805_add_turn_action_fields_to_game_players_table',10);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'api-token','1cee6677a8f20db8c9467341fa21aaf5d21c71a60fff44ace8bb83b71a9b21a2','[\"*\"]',NULL,'2026-04-22 00:57:17','2026-04-22 00:57:17'),(2,'App\\Models\\User',1,'api-token','fc064d19ac77095e121fe299082b9f17c6f54cda31e1dc7dc730fad9b268dd90','[\"*\"]',NULL,'2026-04-22 00:57:27','2026-04-22 00:57:27'),(3,'App\\Models\\User',1,'api-token','3cf8774004e0c93aa0b72e41cdcc1245c3d401a954750e6720e319a871b51ce8','[\"*\"]',NULL,'2026-04-22 01:00:10','2026-04-22 01:00:10'),(4,'App\\Models\\User',1,'api-token','ca0c9b165e014fdff9f8db9bc39124d9caafb653a246ad4f37d3a7bf9c94a17c','[\"*\"]',NULL,'2026-04-22 01:04:20','2026-04-22 01:04:20'),(5,'App\\Models\\User',1,'api-token','0edf980b83dfe79b1a69b9673d0cf165df26d9dbdd5891853465bd983b31e036','[\"*\"]',NULL,'2026-04-22 01:04:42','2026-04-22 01:04:42'),(6,'App\\Models\\User',3,'expo_mobile','c31b6f89908795dba9a0673730462a5147545edcac76a8f45b1389c1774c6b31','[\"*\"]',NULL,'2026-04-29 01:00:32','2026-04-29 01:00:32'),(7,'App\\Models\\User',1,'expo_mobile','528014b3af6a9d4b3b1954b4598d0c042d9cd30fa07e9058d7190474fbd9e023','[\"*\"]','2026-04-29 01:27:27','2026-04-29 01:00:39','2026-04-29 01:27:27'),(8,'App\\Models\\User',3,'expo_mobile','8191502d31912b3e763f3663e182dbf276b0d716ede1dabb56994eeeffb41866','[\"*\"]','2026-04-29 01:20:01','2026-04-29 01:19:16','2026-04-29 01:20:01'),(9,'App\\Models\\User',1,'expo_mobile','a9e80c5dd09ab9ad8192db85492178a1eebc6f96624366150d89ae7f948416d2','[\"*\"]','2026-04-29 01:27:00','2026-04-29 01:26:39','2026-04-29 01:27:00'),(11,'App\\Models\\User',1,'iphone','1f5cd8357c9b451c08fb6775c73f0a65f6eb9788aa1f5bce62728f8c8c90356b','[\"*\"]',NULL,'2026-05-13 05:13:37','2026-05-13 05:13:37'),(13,'App\\Models\\User',3,'expo_mobile_web','31dbc979403dc63c084c34cf7ffbef71c1eb6eb1a095a1c700d6352d2e073d5f','[\"*\"]',NULL,'2026-05-28 09:55:46','2026-05-28 09:55:46'),(20,'App\\Models\\User',3,'expo_mobile_android','c17649ee3feb328f43e5bcf1d32348dddf2fd9fdd185aa8380316bb7c27f1edc','[\"*\"]','2026-07-03 12:02:48','2026-07-03 11:47:24','2026-07-03 12:02:48'),(30,'App\\Models\\User',2,'expo_mobile_android','6d769638ba07b0ea33702b614373825d7455713a55c679cb398185517a886ab7','[\"*\"]','2026-07-08 10:22:01','2026-07-08 07:59:04','2026-07-08 10:22:01'),(38,'App\\Models\\User',2,'expo_mobile_web','5ade8ad902ff4a62eb101cfbb4dbc7f53112524ee709495692051a8e967ebf87','[\"*\"]','2026-07-08 10:02:24','2026-07-08 09:28:34','2026-07-08 10:02:24');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player_answers`
--

DROP TABLE IF EXISTS `player_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player_answers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `game_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `question_id` bigint unsigned NOT NULL,
  `selected_answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `earned_credits` int NOT NULL DEFAULT '0',
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `answered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `player_answers_game_id_foreign` (`game_id`),
  KEY `player_answers_user_id_foreign` (`user_id`),
  KEY `player_answers_question_id_foreign` (`question_id`),
  CONSTRAINT `player_answers_game_id_foreign` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `player_answers_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `player_answers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_answers`
--

LOCK TABLES `player_answers` WRITE;
/*!40000 ALTER TABLE `player_answers` DISABLE KEYS */;
INSERT INTO `player_answers` VALUES (1,2,2,10,'B',1,40,'Correct answer!','2026-05-13 05:45:14','2026-05-13 05:45:14','2026-05-13 05:45:14'),(2,2,3,40,'D',0,0,'Incorrect answer.','2026-05-13 05:53:46','2026-05-13 05:53:46','2026-05-13 05:53:46'),(3,2,3,49,'B',0,0,'Incorrect answer.','2026-05-13 05:57:47','2026-05-13 05:57:47','2026-05-13 05:57:47'),(4,3,3,20,'B',1,60,'Correct answer!','2026-05-13 06:03:28','2026-05-13 06:03:28','2026-05-13 06:03:28'),(5,3,3,31,'A',0,0,'Incorrect answer.','2026-05-13 06:14:16','2026-05-13 06:14:16','2026-05-13 06:14:16'),(6,4,3,30,'Print()',0,0,'The student\'s code does not create a list from range(1, 10, 3) and print it correctly. The expected result is [1, 4, 7], but the student\'s output is an empty string.','2026-05-13 06:28:04','2026-05-13 06:28:04','2026-05-13 06:28:04'),(7,5,2,7,'B',1,40,'Correct answer!','2026-05-28 10:02:11','2026-05-28 10:02:11','2026-05-28 10:02:11'),(8,9,6,19,'B',1,40,'Correct answer!','2026-06-30 07:29:00','2026-06-30 07:29:00','2026-06-30 07:29:00'),(9,10,7,13,'C',1,40,'Correct answer!','2026-06-30 07:33:10','2026-06-30 07:33:10','2026-06-30 07:33:10'),(10,10,2,3,'Python variables do not require fixed type declarations. A variable can first store one type of value and later store another type. Example: x = 10, then x = \"Hello\".',1,100,'The student\'s explanation is correct but lacks a valid example.','2026-06-30 07:34:04','2026-06-30 07:34:04','2026-06-30 07:34:04'),(11,11,8,1,'B',1,40,'Correct answer!','2026-06-30 07:37:59','2026-06-30 07:37:59','2026-06-30 07:37:59'),(12,12,9,1,'B',1,40,'Correct answer!','2026-06-30 07:41:58','2026-06-30 07:41:58','2026-06-30 07:41:58'),(13,12,2,3,'Python variables do not require fixed type declarations. A variable can first store one type of value and later store another type. Example: x = 10, then x = \"Hello\".',1,100,'The student\'s explanation is correct but lacks a valid example.','2026-06-30 07:42:30','2026-06-30 07:42:30','2026-06-30 07:42:30'),(14,13,10,1,'B',1,40,'Correct answer!','2026-06-30 07:47:04','2026-06-30 07:47:04','2026-06-30 07:47:04'),(15,13,2,3,'Python variables do not require fixed type declarations. A variable can first store one type of value and later store another type. Example: x = 10, then x = \"Hello\".',1,100,'The student\'s explanation is correct but lacks a valid example.','2026-06-30 07:47:23','2026-06-30 07:47:23','2026-06-30 07:47:23'),(16,14,11,1,'B',1,40,'Correct answer!','2026-06-30 07:51:41','2026-06-30 07:51:41','2026-06-30 07:51:41'),(17,14,2,3,'Python variables do not require fixed type declarations. A variable can first store one type of value and later store another type. Example: x = 10, then x = \"Hello\".',1,100,'The student\'s explanation is correct but lacks a valid example.','2026-06-30 07:51:59','2026-06-30 07:51:59','2026-06-30 07:51:59'),(18,15,12,1,'B',1,40,'Correct answer!','2026-06-30 07:55:58','2026-06-30 07:55:58','2026-06-30 07:55:58'),(19,15,2,3,'Python variables do not require fixed type declarations. A variable can first store one type of value and later store another type. Example: x = 10, then x = \"Hello\".',1,100,'The student\'s explanation is correct but lacks a valid example.','2026-06-30 07:56:19','2026-06-30 07:56:19','2026-06-30 07:56:19'),(20,16,13,1,'B',1,40,'Correct answer!','2026-06-30 08:00:56','2026-06-30 08:00:56','2026-06-30 08:00:56'),(21,16,2,3,'Python variables do not require fixed type declarations. A variable can first store one type of value and later store another type. Example: x = 10, then x = \"Hello\".',1,100,'The student\'s explanation is correct but lacks a valid example.','2026-06-30 08:01:11','2026-06-30 08:01:11','2026-06-30 08:01:11'),(22,17,14,1,'B',1,40,'Correct answer!','2026-06-30 08:06:35','2026-06-30 08:06:35','2026-06-30 08:06:35'),(23,17,2,3,'Python variables do not require fixed type declarations. A variable can first store one type of value and later store another type. Example: x = 10, then x = \"Hello\".',1,100,'The student\'s explanation is correct but lacks a valid example.','2026-06-30 08:07:21','2026-06-30 08:07:21','2026-06-30 08:07:21'),(24,18,15,1,'B',1,40,'Correct answer!','2026-06-30 08:11:41','2026-06-30 08:11:41','2026-06-30 08:11:41'),(25,18,2,3,'Python variables do not require fixed type declarations. A variable can first store one type of value and later store another type. Example: x = 10, then x = \"Hello\".',1,100,'The student\'s explanation is correct but lacks a valid example.','2026-06-30 08:12:06','2026-06-30 08:12:06','2026-06-30 08:12:06'),(26,20,1,16,'C',1,40,'Correct answer!','2026-07-01 14:51:01','2026-07-01 14:51:01','2026-07-01 14:51:01'),(27,20,2,4,'B',1,40,'Correct answer!','2026-07-01 14:52:17','2026-07-01 14:52:17','2026-07-01 14:52:17'),(28,20,1,31,'A',0,0,'Incorrect answer.','2026-07-01 14:53:15','2026-07-01 14:53:15','2026-07-01 14:53:15'),(29,20,2,19,'B',1,40,'Correct answer!','2026-07-01 14:54:52','2026-07-01 14:54:52','2026-07-01 14:54:52'),(30,20,1,56,'B',1,60,'Correct answer!','2026-07-01 14:55:58','2026-07-01 14:55:58','2026-07-01 14:55:58'),(31,20,2,26,'B',1,60,'Correct answer!','2026-07-01 14:57:02','2026-07-01 14:57:02','2026-07-01 14:57:02'),(32,22,1,11,'B',1,60,'Correct answer!','2026-07-02 02:52:17','2026-07-02 02:52:17','2026-07-02 02:52:17'),(33,22,2,18,'x = []\nprint(x)',0,0,'The student\'s code does not store any value in a variable and does not print the data type of that variable. It simply prints an empty list, which is not what is required by the question.','2026-07-02 02:56:02','2026-07-02 02:56:02','2026-07-02 02:56:02'),(34,23,2,14,'B',1,60,'Correct answer!','2026-07-02 05:17:58','2026-07-02 05:17:58','2026-07-02 05:17:58'),(35,23,2,27,'not sure',0,0,'The student\'s answer does not use a for loop or range(3). It is incomplete and does not print any numbers.','2026-07-02 05:20:30','2026-07-02 05:20:30','2026-07-02 05:20:30'),(36,23,1,30,'UH OH IDK',0,0,'The student\'s answer does not contain any code that creates a list from range(1, 10, 3) or prints the result.','2026-07-02 05:22:40','2026-07-02 05:22:40','2026-07-02 05:22:40'),(37,24,1,15,'NOT SURE',0,0,'The student\'s answer is incomplete and does not include the necessary steps to convert the input into an integer.','2026-07-02 06:50:51','2026-07-02 06:50:51','2026-07-02 06:50:51'),(38,25,1,21,'NOT SURE',0,0,'The student\'s answer is not a valid Python if statement that checks whether x is greater than 3 and prints \'Yes\' when true. The code provided does not contain the necessary syntax for an if statement, variable declaration, or print function call.','2026-07-02 09:08:53','2026-07-02 09:08:53','2026-07-02 09:08:53'),(39,25,2,16,'C',1,40,'Correct answer!','2026-07-02 09:09:41','2026-07-02 09:09:41','2026-07-02 09:09:41'),(40,26,1,22,'A',0,0,'Incorrect answer.','2026-07-03 10:47:40','2026-07-03 10:47:40','2026-07-03 10:47:40'),(41,26,3,10,'B',1,40,'Correct answer!','2026-07-03 10:48:56','2026-07-03 10:48:56','2026-07-03 10:48:56'),(42,26,1,29,'B',1,60,'Correct answer!','2026-07-03 10:49:38','2026-07-03 10:49:38','2026-07-03 10:49:38'),(43,26,2,39,'When a value cannot be changed',1,100,'The student\'s explanation is correct and provides an example of when tuples are preferred over lists due to immutability.','2026-07-03 10:50:58','2026-07-03 10:50:58','2026-07-03 10:50:58'),(44,26,3,36,'Not sure',0,0,'The student\'s answer is not provided.','2026-07-03 10:51:53','2026-07-03 10:51:53','2026-07-03 10:51:53'),(45,28,2,17,'C',1,60,'Correct answer!','2026-07-03 11:27:16','2026-07-03 11:27:16','2026-07-03 11:27:16'),(46,28,3,35,'C',1,60,'Correct answer!','2026-07-03 11:29:32','2026-07-03 11:29:32','2026-07-03 11:29:32'),(47,28,1,48,'x = \"python\"\nprint(upper(x))',0,0,'The student\'s code does not convert the string to uppercase and print it correctly. The correct code should use the upper() method on a string, not apply it directly to a variable.','2026-07-03 11:31:10','2026-07-03 11:31:10','2026-07-03 11:31:10'),(48,28,1,75,'idk',0,0,'The student\'s answer is incorrect because it does not contain the required Python code to open a file for reading using with open(...). The expected answer uses \'with open(','2026-07-03 11:34:54','2026-07-03 11:34:54','2026-07-03 11:34:54'),(49,29,2,7,'B',1,40,'Correct answer!','2026-07-03 11:48:20','2026-07-03 11:48:20','2026-07-03 11:48:20'),(50,29,2,23,'B',1,60,'Correct answer!','2026-07-03 11:48:55','2026-07-03 11:48:55','2026-07-03 11:48:55'),(51,29,3,41,'D',0,0,'Incorrect answer.','2026-07-03 11:58:15','2026-07-03 11:58:15','2026-07-03 11:58:15'),(52,29,3,19,'B',1,40,'Correct answer!','2026-07-03 12:02:25','2026-07-03 12:02:25','2026-07-03 12:02:25'),(53,38,1,16,'C',1,40,'Correct answer!','2026-07-08 06:45:04','2026-07-08 06:45:04','2026-07-08 06:45:04'),(54,43,2,91,'A',1,50,'Correct answer!','2026-07-08 10:11:25','2026-07-08 10:11:25','2026-07-08 10:11:25'),(55,43,1,19,'B',1,40,'Correct answer!','2026-07-08 10:12:13','2026-07-08 10:12:13','2026-07-08 10:12:13'),(56,43,1,44,'C',1,60,'Correct answer!','2026-07-08 10:12:46','2026-07-08 10:12:46','2026-07-08 10:12:46'),(57,43,2,38,'A',0,0,'Incorrect answer.','2026-07-08 10:13:38','2026-07-08 10:13:38','2026-07-08 10:13:38'),(58,43,2,53,'A',1,60,'Correct answer!','2026-07-08 10:14:32','2026-07-08 10:14:32','2026-07-08 10:14:32'),(59,43,2,71,'C',1,60,'Correct answer!','2026-07-08 10:15:27','2026-07-08 10:15:27','2026-07-08 10:15:27'),(60,43,1,32,'A',0,0,'Incorrect answer.','2026-07-08 10:17:19','2026-07-08 10:17:19','2026-07-08 10:17:19'),(61,43,1,50,'B',0,0,'Incorrect answer.','2026-07-08 10:17:59','2026-07-08 10:17:59','2026-07-08 10:17:59'),(62,43,2,47,'B',1,60,'Correct answer!','2026-07-08 10:18:32','2026-07-08 10:18:32','2026-07-08 10:18:32'),(63,43,1,56,'A',0,0,'Incorrect answer.','2026-07-08 10:19:04','2026-07-08 10:19:04','2026-07-08 10:19:04'),(64,43,2,68,'B',1,60,'Correct answer!','2026-07-08 10:19:36','2026-07-08 10:19:36','2026-07-08 10:19:36'),(65,43,1,65,'D',0,0,'Incorrect answer.','2026-07-08 10:20:23','2026-07-08 10:20:23','2026-07-08 10:20:23'),(66,44,1,24,'func greet {\n print(\"Hello\")\n}',0,0,'The student\'s code does not define a function named \'greet\' using def; it uses \'func\'. The function name should be \'greet\', and the print statement should be inside the function body.','2026-07-08 14:32:58','2026-07-08 14:32:58','2026-07-08 14:32:58'),(67,44,2,36,'# Create an empty list called items\nitems = []\n\n# Add \"apple\" to the end of the list\nitems.append(\"apple\")\n\nprint(items)\n# Output: [\'apple\']',1,100,'The student\'s code creates a list called items and adds \'apple\' to the end of the list, which is correct according to the rubric.','2026-07-08 14:34:55','2026-07-08 14:34:55','2026-07-08 14:34:55'),(68,44,1,66,'not sure',0,0,'The student\'s answer does not define a function named \'f\' or return 5, nor does it call and print the result of calling \'f()\'.','2026-07-08 15:22:31','2026-07-08 15:22:31','2026-07-08 15:22:31');
/*!40000 ALTER TABLE `player_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tile_id` bigint unsigned NOT NULL,
  `property_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost` int NOT NULL,
  `house_cost` int NOT NULL DEFAULT '0',
  `hotel_cost` int NOT NULL DEFAULT '0',
  `rent` int NOT NULL DEFAULT '0',
  `rent_1_house` int NOT NULL DEFAULT '0',
  `rent_2_houses` int NOT NULL DEFAULT '0',
  `rent_3_houses` int NOT NULL DEFAULT '0',
  `rent_4_houses` int NOT NULL DEFAULT '0',
  `rent_hotel` int NOT NULL DEFAULT '0',
  `color_group` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `properties_tile_id_foreign` (`tile_id`),
  CONSTRAINT `properties_tile_id_foreign` FOREIGN KEY (`tile_id`) REFERENCES `tiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,1,'Variables Valley',60,50,50,2,10,30,90,160,250,'brown'),(2,2,'Syntax Street',60,50,50,4,20,60,180,320,450,'brown'),(3,3,'Debugging Depot',200,0,0,25,50,100,200,0,0,'railroad'),(4,4,'Print Path',100,50,50,6,30,90,270,400,550,'light_blue'),(5,5,'Input Avenue',100,50,50,6,30,90,270,400,550,'light_blue'),(6,6,'Data Type District',120,50,50,8,40,100,300,450,600,'light_blue'),(7,7,'Condition Corner',140,100,100,10,50,150,450,625,750,'pink'),(8,8,'Function Flow Utility',150,0,0,0,0,0,0,0,0,'utility'),(9,9,'Loop Lane',140,100,100,10,50,150,450,625,750,'pink'),(10,10,'Range Road',160,100,100,12,60,180,500,700,900,'pink'),(11,11,'Logic Line',200,0,0,25,50,100,200,0,0,'railroad'),(12,12,'List Lake',180,100,100,14,70,200,550,750,950,'orange'),(13,13,'Tuple Town',180,100,100,14,70,200,550,750,950,'orange'),(14,14,'Dictionary Dock',200,100,100,16,80,220,600,800,1000,'orange'),(15,15,'Set Station',220,150,150,18,90,250,700,875,1050,'red'),(16,16,'String Square',220,150,150,18,90,250,700,875,1050,'red'),(17,17,'Slice Street',240,150,150,20,100,300,750,925,1100,'red'),(18,18,'Runtime Rail',200,0,0,25,50,100,200,0,0,'railroad'),(19,19,'Function Forest',260,150,150,22,110,330,800,975,1150,'yellow'),(20,20,'Parameter Plaza',260,150,150,22,110,330,800,975,1150,'yellow'),(21,21,'Water Works Utility',150,0,0,0,0,0,0,0,0,'utility'),(22,22,'Return Route',280,150,150,24,120,360,850,1025,1200,'yellow'),(23,23,'Module Mountain',300,200,200,26,130,390,900,1100,1275,'green'),(24,24,'Exception Estate',300,200,200,26,130,390,900,1100,1275,'green'),(25,25,'File Handling Harbor',320,200,200,28,150,450,1000,1200,1400,'green'),(26,26,'Compiler Crossing',200,0,0,25,50,100,200,0,0,'railroad'),(27,27,'Class City',350,200,200,35,175,500,1100,1300,1500,'dark_blue'),(28,28,'Inheritance Heights',400,200,200,50,200,600,1400,1700,2000,'dark_blue');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tile_id` bigint unsigned NOT NULL,
  `question_type` enum('mcq','structured') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mcq',
  `question_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_a` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option_b` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option_c` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option_d` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correct_answer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expected_answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rubric` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `max_score` int NOT NULL DEFAULT '10',
  `credits` int NOT NULL DEFAULT '10',
  `difficulty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `questions_tile_id_foreign` (`tile_id`),
  CONSTRAINT `questions_tile_id_foreign` FOREIGN KEY (`tile_id`) REFERENCES `tiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,1,'mcq','Which symbol is used to assign a value to a variable in Python?','==','=',':=','!=','B',NULL,NULL,10,40,'easy',NULL,NULL),(2,1,'mcq','What will be the value of x after: x = 5; x = x + 2?','5','2','7','52','C',NULL,NULL,10,60,'intermediate',NULL,NULL),(3,1,'structured','Explain why Python variables can be reassigned to different data types. Give a short example.',NULL,NULL,NULL,NULL,NULL,'Python variables do not require fixed type declarations. A variable can first store one type of value and later store another type. Example: x = 10, then x = \"Hello\".','Must explain dynamic typing or reassignment; must mention different data types; should include a valid example.',100,100,'hard',NULL,NULL),(4,2,'mcq','Which line is valid Python syntax?','print \"Hello\"','print(\"Hello\")','echo(\"Hello\")','printf(\"Hello\")','B',NULL,NULL,10,40,'easy',NULL,NULL),(5,2,'mcq','What happens if Python code has incorrect indentation?','It runs normally','It gives an indentation error','It skips the line','It auto-corrects it','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(6,2,'structured','Explain why indentation is important in Python. Give an example of a code block that uses indentation.',NULL,NULL,NULL,NULL,NULL,'Indentation defines code blocks in Python, such as the body of an if statement, loop, or function. Example: if x > 0:\n    print(\"Positive\").','Must state that indentation defines code blocks; should mention if, loop, or function blocks; should include valid indented code.',100,100,'hard',NULL,NULL),(7,3,'mcq','What is a bug in programming?','A computer virus','An error in code','A keyboard issue','A Python package','B',NULL,NULL,10,40,'easy',NULL,NULL),(8,3,'mcq','Which of these is commonly used to inspect variable values while debugging?','print()','erase()','stop()','redo()','A',NULL,NULL,10,60,'intermediate',NULL,NULL),(9,3,'structured','Explain the main purpose of debugging and describe one debugging technique you can use in Python.',NULL,NULL,NULL,NULL,NULL,'Debugging is the process of finding and fixing errors in code. A common technique is using print() statements to inspect variable values or program flow.','Must explain finding and fixing errors; should include at least one debugging technique such as print(), debugger, or checking error messages.',100,100,'hard',NULL,NULL),(10,4,'mcq','Which function displays output in Python?','show()','print()','display()','echo()','B',NULL,NULL,10,40,'easy',NULL,NULL),(11,4,'mcq','What is the output of print(2 + 3)?','23','5','2 + 3','Error','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(12,4,'structured','Write a Python statement that prints the text \"Hello\" together with the value stored in a variable called name.',NULL,NULL,NULL,NULL,NULL,'print(\"Hello\", name)','Must use print(); must include the text \"Hello\"; must include the variable name.',100,100,'hard',NULL,NULL),(13,5,'mcq','Which function gets user input in Python?','read()','scan()','input()','enter()','C',NULL,NULL,10,40,'easy',NULL,NULL),(14,5,'mcq','What type of data does input() return by default?','int','string','float','boolean','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(15,5,'structured','Write Python code that asks the user to enter their age and converts the input into an integer.',NULL,NULL,NULL,NULL,NULL,'age = int(input(\"Enter your age: \"))','Must use input(); must convert using int(); should store the result in a variable.',100,100,'hard',NULL,NULL),(16,6,'mcq','Which of the following is an integer?','\"7\"','7.5','7','True','C',NULL,NULL,10,40,'easy',NULL,NULL),(17,6,'mcq','Which data type is used for True or False values?','int','str','bool','float','C',NULL,NULL,10,60,'intermediate',NULL,NULL),(18,6,'structured','Write Python code that stores any value in a variable and prints the data type of that variable.',NULL,NULL,NULL,NULL,NULL,'x = 10\nprint(type(x))','Must use type(); must print or display the type; should include a variable assignment.',100,100,'hard',NULL,NULL),(19,7,'mcq','Which keyword is used to start a condition in Python?','for','if','case','switch','B',NULL,NULL,10,40,'easy',NULL,NULL),(20,7,'mcq','Which keyword is used when the first condition is false and another condition should be checked?','elseif','elif','else if','otherwise','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(21,7,'structured','Write a Python if statement that checks whether x is greater than 3 and prints \"Yes\" if the condition is true.',NULL,NULL,NULL,NULL,NULL,'if x > 3:\n    print(\"Yes\")','Must use if; must check x > 3; must print \"Yes\" when true; indentation should be correct.',100,100,'hard',NULL,NULL),(22,8,'mcq','Which keyword defines a function in Python?','function','define','def','func','C',NULL,NULL,10,40,'easy',NULL,NULL),(23,8,'mcq','What do we call the values passed into a function?','returns','arguments','loops','classes','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(24,8,'structured','Write a Python function named greet that prints \"Hello\". The function does not need to return a value.',NULL,NULL,NULL,NULL,NULL,'def greet():\n    print(\"Hello\")','Must define a function using def; function name should be greet; should print \"Hello\"; return is optional.',100,100,'hard',NULL,NULL),(25,9,'mcq','Which loop repeats while a condition is true?','for','repeat','while','loop','C',NULL,NULL,10,40,'easy',NULL,NULL),(26,9,'mcq','Which keyword stops a loop immediately?','skip','break','stop','exit','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(27,9,'structured','Write a Python for loop using range(3) that prints the numbers 0, 1, and 2.',NULL,NULL,NULL,NULL,NULL,'for i in range(3):\n    print(i)','Must use for loop; must use range(3); must print loop variable; expected output should be 0, 1, 2.',100,100,'hard',NULL,NULL),(28,10,'mcq','What does range(5) start from by default?','1','5','0','-1','C',NULL,NULL,10,40,'easy',NULL,NULL),(29,10,'mcq','How many numbers are produced by range(2, 6)?','3','4','5','6','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(30,10,'structured','Write Python code that creates a list from range(1, 10, 3) and prints the result.',NULL,NULL,NULL,NULL,NULL,'numbers = list(range(1, 10, 3))\nprint(numbers)','Must use range(1, 10, 3); must convert to list or print list result; expected result is [1, 4, 7].',100,100,'hard',NULL,NULL),(31,11,'mcq','Which operator means AND in Python?','&&','and','&','AND','B',NULL,NULL,10,40,'easy',NULL,NULL),(32,11,'mcq','Which operator means OR in Python?','||','or','OR','|','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(33,11,'structured','Explain the result of the expression True and False or True in Python.',NULL,NULL,NULL,NULL,NULL,'The result is True. In Python, and is evaluated before or. True and False becomes False, then False or True becomes True.','Must identify result as True; must explain and before or precedence; should show intermediate evaluation.',100,100,'hard',NULL,NULL),(34,12,'mcq','Which syntax creates a list in Python?','(1,2,3)','{1,2,3}','[1,2,3]','<1,2,3>','C',NULL,NULL,10,40,'easy',NULL,NULL),(35,12,'mcq','How do you access the first item in a list items?','items(0)','items[1]','items[0]','items.first()','C',NULL,NULL,10,60,'intermediate',NULL,NULL),(36,12,'structured','Write Python code that creates a list called items and adds the value \"apple\" to the end of the list.',NULL,NULL,NULL,NULL,NULL,'items = []\nitems.append(\"apple\")','Must create or use a list; must use append(); must add \"apple\" to the end.',100,100,'hard',NULL,NULL),(37,13,'mcq','Which symbol is mainly used to define a tuple?','[]','()','{}','<>','B',NULL,NULL,10,40,'easy',NULL,NULL),(38,13,'mcq','Which statement about tuples is true?','They are mutable','They are immutable','They store only strings','They cannot contain numbers','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(39,13,'structured','Explain one situation where using a tuple is better than using a list.',NULL,NULL,NULL,NULL,NULL,'A tuple is preferred when the data should not change, such as coordinates or fixed configuration values.','Must explain immutability; must describe fixed or unchanging data; example is recommended.',100,100,'hard',NULL,NULL),(40,14,'mcq','Which structure stores key-value pairs?','list','tuple','dictionary','set','C',NULL,NULL,10,40,'easy',NULL,NULL),(41,14,'mcq','How do you access the value for key \"age\" in dictionary d?','d.age','d(\"age\")','d[\"age\"]','d->age','C',NULL,NULL,10,60,'intermediate',NULL,NULL),(42,14,'structured','Write Python code that creates a dictionary called student with keys \"name\" and \"age\", then prints all the keys.',NULL,NULL,NULL,NULL,NULL,'student = {\"name\": \"Ali\", \"age\": 20}\nprint(student.keys())','Must create or use a dictionary; must use keys(); should print or return the keys.',100,100,'hard',NULL,NULL),(43,15,'mcq','What is special about a set in Python?','It keeps duplicates','It stores key-value pairs','It does not allow duplicates','It is always sorted','C',NULL,NULL,10,40,'easy',NULL,NULL),(44,15,'mcq','Which syntax creates a set with values 1 and 2?','[1,2]','(1,2)','{1,2}','{\"1\":\"2\"}','C',NULL,NULL,10,60,'intermediate',NULL,NULL),(45,15,'structured','Explain what happens when the set {1, 2, 2, 3} is created in Python.',NULL,NULL,NULL,NULL,NULL,'The duplicate value is removed because sets do not allow duplicates. The result is {1, 2, 3}.','Must explain that sets remove duplicates; must identify result as {1, 2, 3}.',100,100,'hard',NULL,NULL),(46,16,'mcq','Which data type is used for text?','int','str','bool','float','B',NULL,NULL,10,40,'easy',NULL,NULL),(47,16,'mcq','What is the result of \"Py\" + \"thon\"?','Py thon','Python','Error','Py+thon','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(48,16,'structured','Write Python code that converts the string \"python\" to uppercase and prints the result.',NULL,NULL,NULL,NULL,NULL,'text = \"python\"\nprint(text.upper())','Must use upper(); must apply it to a string; should print or store the uppercase result.',100,100,'hard',NULL,NULL),(49,17,'mcq','Which syntax is used to slice a sequence?','()','{}','[:]','<>','C',NULL,NULL,10,40,'easy',NULL,NULL),(50,17,'mcq','What does \"python\"[0:2] return?','py','pyt','ython','pt','A',NULL,NULL,10,60,'intermediate',NULL,NULL),(51,17,'structured','Explain what nums[::-1] does in Python. Give a short example.',NULL,NULL,NULL,NULL,NULL,'nums[::-1] returns the sequence in reverse order. Example: nums = [1, 2, 3], nums[::-1] gives [3, 2, 1].','Must explain reverse slicing; should include example; expected reversed sequence should be correct.',100,100,'hard',NULL,NULL),(52,18,'mcq','What does runtime mean?','Time taken while the program executes','The size of the file','The name of a loop','The type of a variable','A',NULL,NULL,10,40,'easy',NULL,NULL),(53,18,'mcq','Which choice can affect runtime performance?','Algorithm choice','Variable name length only','Comment spacing','Font size in editor','A',NULL,NULL,10,60,'intermediate',NULL,NULL),(54,18,'structured','Explain why Big-O notation is useful when comparing algorithms.',NULL,NULL,NULL,NULL,NULL,'Big-O notation describes how time or space usage grows as input size increases. It helps compare algorithm efficiency without focusing on exact runtime.','Must explain growth of time or space complexity; should mention input size; should relate to algorithm comparison.',100,100,'hard',NULL,NULL),(55,19,'mcq','Which keyword creates a function?','def','func','class','loop','A',NULL,NULL,10,40,'easy',NULL,NULL),(56,19,'mcq','What is a parameter?','A value returned from a function','An input listed in a function definition','A loop counter','A module name','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(57,19,'structured','Explain what recursion means and write a simple recursive function example.',NULL,NULL,NULL,NULL,NULL,'Recursion is when a function calls itself. Example:\ndef countdown(n):\n    if n <= 0:\n        return\n    print(n)\n    countdown(n - 1)','Must define recursion as a function calling itself; should include a base case; should include a recursive call.',100,100,'hard',NULL,NULL),(58,20,'mcq','Where are parameters written?','Inside square brackets','In the function definition','Only in print()','In comments','B',NULL,NULL,10,40,'easy',NULL,NULL),(59,20,'mcq','What is an argument?','The value passed into a function call','A syntax error','A return keyword','A file object','A',NULL,NULL,10,60,'intermediate',NULL,NULL),(60,20,'structured','Explain the difference between parameters and arguments using a simple Python function example.',NULL,NULL,NULL,NULL,NULL,'Parameters are variables listed in a function definition. Arguments are actual values passed when calling the function. Example: def greet(name): uses parameter name; greet(\"Ali\") passes \"Ali\" as an argument.','Must explain parameters are in function definition; arguments are passed during function call; should include example.',100,100,'hard',NULL,NULL),(61,21,'mcq','Which keyword is used to define a function in Python?','func','function','def','define','C',NULL,NULL,10,40,'easy',NULL,'2026-06-10 14:20:30'),(62,21,'mcq','Reading from a file is an example of:','input','output','looping','inheritance','A',NULL,NULL,10,60,'intermediate',NULL,NULL),(63,21,'structured','Write the Python keyword used to create a function.',NULL,NULL,NULL,NULL,'def','Files should be closed to release system resources and ensure data is saved properly. Using with open(...) automatically closes the file.','Must mention closing files or resource release; should mention with open() as good practice; should relate to safe file handling.',100,100,'hard',NULL,'2026-06-10 14:21:58'),(64,22,'mcq','Which keyword sends a value back from a function?','send','yield','return','break','C',NULL,NULL,10,40,'easy',NULL,NULL),(65,22,'mcq','What does return do if no value is specified?','Returns None','Returns 0','Returns False','Causes syntax error','A',NULL,NULL,10,60,'intermediate',NULL,NULL),(66,22,'structured','Write a Python function f that returns 5, then print the result of calling f().',NULL,NULL,NULL,NULL,NULL,'def f():\n    return 5\n\nprint(f())','Must define function f; must return 5; must call and print f().',100,100,'hard',NULL,NULL),(67,23,'mcq','Which statement imports a module?','include math','using math','import math','require math','C',NULL,NULL,10,40,'easy',NULL,NULL),(68,23,'mcq','Which module is commonly used for random numbers?','math','random','os','time','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(69,23,'structured','Explain what from math import sqrt allows you to do. Give a short code example.',NULL,NULL,NULL,NULL,NULL,'from math import sqrt allows sqrt to be used directly without writing math.sqrt. Example: from math import sqrt\nprint(sqrt(25))','Must explain direct use of sqrt; should include valid import statement; should include a valid sqrt example.',100,100,'hard',NULL,NULL),(70,24,'mcq','Which keyword is used to handle an exception?','catch','except','error','rescue','B',NULL,NULL,10,40,'easy',NULL,NULL),(71,24,'mcq','Which block is used to test code that might fail?','if','for','try','def','C',NULL,NULL,10,60,'intermediate',NULL,NULL),(72,24,'structured','Write a Python try-except-finally example and explain when the finally block runs.',NULL,NULL,NULL,NULL,NULL,'try:\n    x = int(\"abc\")\nexcept ValueError:\n    print(\"Invalid value\")\nfinally:\n    print(\"This always runs\")','Must include try, except, and finally; must explain finally always runs; code should be valid Python.',100,100,'hard',NULL,NULL),(73,25,'mcq','Which function opens a file in Python?','file()','open()','read()','load()','B',NULL,NULL,10,40,'easy',NULL,NULL),(74,25,'mcq','Which mode opens a file for writing?','r','a','w','x','C',NULL,NULL,10,60,'intermediate',NULL,NULL),(75,25,'structured','Write Python code using with open(...) to open a file for reading.',NULL,NULL,NULL,NULL,NULL,'with open(\"data.txt\", \"r\") as file:\n    content = file.read()','Must use with open(...); should use read mode \"r\"; should read or access file content.',100,100,'hard',NULL,NULL),(76,26,'mcq','Python is generally considered which type of language?','Compiled only','Interpreted','Assembly only','Binary-only','B',NULL,NULL,10,40,'easy',NULL,NULL),(77,26,'mcq','What does an interpreter do?','Runs code line by line','Builds hardware','Stores images only','Deletes syntax errors automatically','A',NULL,NULL,10,60,'intermediate',NULL,NULL),(78,26,'structured','Explain why Python is often considered beginner-friendly.',NULL,NULL,NULL,NULL,NULL,'Python is beginner-friendly because its syntax is readable, high-level, and close to natural language compared to many lower-level languages.','Must mention readable syntax or high-level nature; should explain why this helps beginners.',100,100,'hard',NULL,NULL),(79,27,'mcq','Which keyword defines a class?','object','class','def','struct','B',NULL,NULL,10,40,'easy',NULL,NULL),(80,27,'mcq','What is an object?','A loop type','An instance of a class','A module import','A print statement','B',NULL,NULL,10,60,'intermediate',NULL,NULL),(81,27,'structured','Write a simple Python class with an __init__ method that stores a name attribute.',NULL,NULL,NULL,NULL,NULL,'class Student:\n    def __init__(self, name):\n        self.name = name','Must define a class; must include __init__; must include self; must assign a name attribute.',100,100,'hard',NULL,NULL),(82,28,'mcq','Inheritance allows a class to do what?','Delete another class','Reuse from another class','Ignore objects','Only store numbers','B',NULL,NULL,10,40,'easy',NULL,NULL),(91,2,'mcq','Admin Test Question Limit Filler','A1','B1','C1','D1','A',NULL,NULL,10,50,'easy','2026-06-30 08:12:58','2026-06-30 08:12:58');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiles`
--

DROP TABLE IF EXISTS `tiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tile_number` int NOT NULL,
  `tile_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nfc_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tile_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'question',
  `difficulty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tiles_tile_number_unique` (`tile_number`),
  UNIQUE KEY `tiles_nfc_value_unique` (`nfc_value`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiles`
--

LOCK TABLES `tiles` WRITE;
/*!40000 ALTER TABLE `tiles` DISABLE KEYS */;
INSERT INTO `tiles` VALUES (1,1,'Variables Valley','NFC_TILE_01','question','mixed',NULL,NULL),(2,3,'Syntax Street','NFC_TILE_03','question','mixed',NULL,NULL),(3,5,'Debugging Depot','NFC_TILE_05','question','mixed',NULL,NULL),(4,6,'Print Path','NFC_TILE_06','question','mixed',NULL,NULL),(5,8,'Input Avenue','NFC_TILE_08','question','mixed',NULL,NULL),(6,9,'Data Type District','NFC_TILE_09','question','mixed',NULL,NULL),(7,11,'Condition Corner','NFC_TILE_11','question','mixed',NULL,NULL),(8,12,'Function Flow Utility','NFC_TILE_12','question','mixed',NULL,NULL),(9,13,'Loop Lane','NFC_TILE_13','question','mixed',NULL,NULL),(10,14,'Range Road','NFC_TILE_14','question','mixed',NULL,NULL),(11,15,'Logic Line','NFC_TILE_15','question','mixed',NULL,NULL),(12,16,'List Lake','NFC_TILE_16','question','mixed',NULL,NULL),(13,18,'Tuple Town','NFC_TILE_18','question','mixed',NULL,NULL),(14,19,'Dictionary Dock','NFC_TILE_19','question','mixed',NULL,NULL),(15,21,'Set Station','NFC_TILE_21','question','mixed',NULL,NULL),(16,23,'String Square','NFC_TILE_23','question','mixed',NULL,NULL),(17,24,'Slice Street','NFC_TILE_24','question','mixed',NULL,NULL),(18,25,'Runtime Rail','NFC_TILE_25','question','mixed',NULL,NULL),(19,26,'Function Forest','NFC_TILE_26','question','mixed',NULL,NULL),(20,27,'Parameter Plaza','NFC_TILE_27','question','mixed',NULL,NULL),(21,28,'Water Works Utility','NFC_TILE_28','question','mixed',NULL,NULL),(22,29,'Return Route','NFC_TILE_29','question','mixed',NULL,NULL),(23,31,'Module Mountain','NFC_TILE_31','question','mixed',NULL,NULL),(24,32,'Exception Estate','NFC_TILE_32','question','mixed',NULL,NULL),(25,34,'File Handling Harbor','NFC_TILE_34','question','mixed',NULL,NULL),(26,35,'Compiler Crossing','NFC_TILE_35','question','mixed',NULL,NULL),(27,37,'Class City','NFC_TILE_37','question','mixed',NULL,NULL),(28,39,'Inheritance Heights','NFC_TILE_39','question','mixed',NULL,NULL),(29,2,'Community Chest','CARD_TILE_02','community_chest',NULL,NULL,NULL),(30,7,'Chance','CARD_TILE_07','chance',NULL,NULL,NULL),(31,17,'Community Chest','CARD_TILE_17','community_chest',NULL,NULL,NULL),(32,22,'Chance','CARD_TILE_22','chance',NULL,NULL,NULL),(33,33,'Community Chest','CARD_TILE_33','community_chest',NULL,NULL,NULL),(34,36,'Chance','CARD_TILE_36','chance',NULL,NULL,NULL),(35,0,'GO','SPECIAL_TILE_00','go',NULL,NULL,NULL),(36,4,'Income Tax','SPECIAL_TILE_04','tax',NULL,NULL,NULL),(37,10,'Jail / Visiting','SPECIAL_TILE_10','jail',NULL,NULL,NULL),(38,20,'Free Parking','SPECIAL_TILE_20','free_parking',NULL,NULL,NULL),(39,30,'Go To Jail','SPECIAL_TILE_30','go_to_jail',NULL,NULL,NULL),(40,38,'Luxury Tax','SPECIAL_TILE_38','tax',NULL,NULL,NULL);
/*!40000 ALTER TABLE `tiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_photo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'player',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'jenn','jenn@mail.com','profile-photos/VcfPaB0jQU8WtSyoCSK9PVPmfsdJxtt8RUj418KO.webp',NULL,'$2y$10$xNDbLIzyG3cZa.Naj2ErxOn4/c4vo3UXph/veBtcwP5OKdLzwmQE2',NULL,'2026-04-22 00:57:17','2026-06-30 07:20:18','player'),(2,'Alvin','alvin@mail.com','profile-photos/PMoEluFHLMyLK1gUzi99CmMXhGpnVx6SdV24GQrX.png',NULL,'$2y$10$xNDbLIzyG3cZa.Naj2ErxOn4/c4vo3UXph/veBtcwP5OKdLzwmQE2',NULL,'2026-04-22 02:04:41','2026-07-09 06:34:01','player'),(3,'Mobile Test User','mobile@test.com',NULL,NULL,'$2y$10$xNDbLIzyG3cZa.Naj2ErxOn4/c4vo3UXph/veBtcwP5OKdLzwmQE2',NULL,'2026-04-29 00:57:35','2026-06-30 07:20:18','player'),(4,'Admin','admin@mail.com',NULL,NULL,'$2y$10$MZiCRRiyo0bSSeuKOaspcO0CALYu6iIA9EH6XzPvQaCFVjtQnNofa',NULL,'2026-06-10 13:24:05','2026-06-30 08:54:10','admin'),(5,'HostPlayer','host_1782804231389@mail.com',NULL,NULL,'$2y$10$PXwOqEcWIL1YU3Yi7sLVtOSbeFUBDUgROaDcM7r.f1NiT9ZH2v.C.',NULL,'2026-06-30 07:23:54','2026-06-30 07:23:54','player'),(6,'HostPlayer','host_1782804465417@mail.com',NULL,NULL,'$2y$10$ZXc.oQoM7fkPe4R0es3NV.WYHONAIKESle/D16DOeAkAGEsL5UZ5u',NULL,'2026-06-30 07:27:47','2026-06-30 07:27:47','player'),(7,'HostPlayer','host_1782804701927@mail.com',NULL,NULL,'$2y$10$eT3RfVGWZJqbvNw00mRpxem8K5jCXvS8Gtpw6ZzC05Q3jSsbe05nu',NULL,'2026-06-30 07:31:44','2026-06-30 07:31:44','player'),(8,'HostPlayer','host_1782804995354@mail.com',NULL,NULL,'$2y$10$yaGWt/J9YbpGdlBsYHQWFOvo0.potUTEv592V7..1z/Js.RsbTbSu',NULL,'2026-06-30 07:36:38','2026-06-30 07:36:38','player'),(9,'HostPlayer','host_1782805242580@mail.com',NULL,NULL,'$2y$10$yGJWPnt/8R1.BtalryC89uqSQFoVi/FKgfGaaPOK4fFq0jWDV6uwO',NULL,'2026-06-30 07:40:44','2026-06-30 07:40:44','player'),(10,'HostPlayer','host_1782805542620@mail.com',NULL,NULL,'$2y$10$N2PsuCXI3NXN7xtEEIvvk.QlCLEYIxtyIL8Mb5SLrpIRa9lxnc5F6',NULL,'2026-06-30 07:45:44','2026-06-30 07:45:44','player'),(11,'HostPlayer','host_1782805817245@mail.com',NULL,NULL,'$2y$10$WKseBvRi9Jcmy0l94KRKgOYcmY9flcfOb3FJ1PlRP7h.kvLuq.0My',NULL,'2026-06-30 07:50:20','2026-06-30 07:50:20','player'),(12,'HostPlayer','host_1782806076436@mail.com',NULL,NULL,'$2y$10$pmjrEQE7..f69FtumUFqH.5CYaNlHN8Yjg2/h5.vFS2so2jsWpm9G',NULL,'2026-06-30 07:54:39','2026-06-30 07:54:39','player'),(13,'HostPlayer','host_1782806380631@mail.com',NULL,NULL,'$2y$10$cbLDCy9pgkIGYloYOEsNU.3o.uEWTqTcYiXXaNADFxGSBvqE0OtXu',NULL,'2026-06-30 07:59:43','2026-06-30 07:59:43','player'),(14,'HostPlayer','host_1782806696301@mail.com',NULL,NULL,'$2y$10$EbORk1oAoSO/WQejEmFizebwvgzjHC3M.Zhqj204Vli0.KhNvud7i',NULL,'2026-06-30 08:04:59','2026-06-30 08:04:59','player'),(15,'HostPlayer','host_1782807002042@mail.com',NULL,NULL,'$2y$10$DU//yMROqJJAdRi7wyfYkuMbJ6vSTnFTg5tvmKCQkap5CRHBnEofO',NULL,'2026-06-30 08:10:05','2026-06-30 08:10:05','player');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'codenopoly'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-09 14:45:35
