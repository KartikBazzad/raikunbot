-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: zcf24f3ae-mysql.qovery.io    Database: raikundb
-- ------------------------------------------------------
-- Server version	8.0.24

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
-- Table structure for table `Banned_users`
--

DROP TABLE IF EXISTS `Banned_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Banned_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discordId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discordTag` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` longtext COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `bannedBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Banned_users_guildId_fkey` (`guildId`),
  KEY `Banned_users_bannedBy_fkey` (`bannedBy`),
  CONSTRAINT `Banned_users_bannedBy_fkey` FOREIGN KEY (`bannedBy`) REFERENCES `staffMembers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Banned_users_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Banned_users`
--

/*!40000 ALTER TABLE `Banned_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Banned_users` ENABLE KEYS */;

--
-- Table structure for table `GuildMemberLevels`
--

DROP TABLE IF EXISTS `GuildMemberLevels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GuildMemberLevels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discordId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int NOT NULL DEFAULT '1',
  `exp` int NOT NULL DEFAULT '0',
  `requiredXp` int NOT NULL DEFAULT '100',
  PRIMARY KEY (`id`),
  KEY `GuildMemberLevels_discordId_fkey` (`discordId`),
  KEY `GuildMemberLevels_guildId_fkey` (`guildId`),
  CONSTRAINT `GuildMemberLevels_discordId_fkey` FOREIGN KEY (`discordId`) REFERENCES `Members` (`discordId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `GuildMemberLevels_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GuildMemberLevels`
--

/*!40000 ALTER TABLE `GuildMemberLevels` DISABLE KEYS */;
INSERT INTO `GuildMemberLevels` VALUES (1,'606361933419118602','731090565902368768',2,3,400),(2,'231468389623660544','731090565902368768',1,1,100);
/*!40000 ALTER TABLE `GuildMemberLevels` ENABLE KEYS */;

--
-- Table structure for table `Guilds`
--

DROP TABLE IF EXISTS `Guilds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Guilds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guildId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildName` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `levels` tinyint(1) NOT NULL DEFAULT '0',
  `invitedBy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logChannel` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `muteRole` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Guilds_guildId_key` (`guildId`),
  KEY `Guilds_invitedBy_fkey` (`invitedBy`),
  CONSTRAINT `Guilds_invitedBy_fkey` FOREIGN KEY (`invitedBy`) REFERENCES `Users` (`discordId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Guilds`
--

/*!40000 ALTER TABLE `Guilds` DISABLE KEYS */;
INSERT INTO `Guilds` VALUES (1,'731090565902368768','ENMITY ESPORTS','2021-11-06 09:42:26.098','2021-11-08 08:20:13.221',1,'606361933419118602',NULL,NULL),(2,'659849495768465429','Bot Test','2021-11-08 13:32:11.121','2021-11-08 13:32:11.122',0,'231468389623660544',NULL,NULL);
/*!40000 ALTER TABLE `Guilds` ENABLE KEYS */;

--
-- Table structure for table `Members`
--

DROP TABLE IF EXISTS `Members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discordId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `discordTag` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discriminator` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Members_discordId_key` (`discordId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Members`
--

/*!40000 ALTER TABLE `Members` DISABLE KEYS */;
INSERT INTO `Members` VALUES (1,'606361933419118602','2021-11-06 09:42:37.358','2021-11-06 09:42:37.359','Kartik#8800','8800'),(2,'231468389623660544','2021-11-06 09:53:51.211','2021-11-06 09:53:51.212','GC | Michi#8019','8019');
/*!40000 ALTER TABLE `Members` ENABLE KEYS */;

--
-- Table structure for table `Temp_Banned_users`
--

DROP TABLE IF EXISTS `Temp_Banned_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Temp_Banned_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discordId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` longtext COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `bannedBy` int NOT NULL,
  `membersId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Temp_Banned_users_guildId_fkey` (`guildId`),
  KEY `Temp_Banned_users_bannedBy_fkey` (`bannedBy`),
  KEY `Temp_Banned_users_membersId_fkey` (`membersId`),
  CONSTRAINT `Temp_Banned_users_bannedBy_fkey` FOREIGN KEY (`bannedBy`) REFERENCES `staffMembers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Temp_Banned_users_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Temp_Banned_users_membersId_fkey` FOREIGN KEY (`membersId`) REFERENCES `Members` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Temp_Banned_users`
--

/*!40000 ALTER TABLE `Temp_Banned_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Temp_Banned_users` ENABLE KEYS */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discordId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `discordTag` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discriminator` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Users_discordId_key` (`discordId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'606361933419118602','2021-11-06 09:42:26.079','2021-11-06 09:42:26.079','Kartik#8800','9c04a2bed46491b3d9a207a43f02a284','8800'),(2,'231468389623660544','2021-11-08 13:32:11.098','2021-11-08 13:32:11.099','GC | Michi#8019','a73f9d7f478ec21b7670e0be3f4038ab','8019');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;

--
-- Table structure for table `muted_users`
--

DROP TABLE IF EXISTS `muted_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `muted_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discordId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` longtext COLLATE utf8mb4_unicode_ci,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roles` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `mutedBy` int NOT NULL,
  `membersId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `muted_users_guildId_fkey` (`guildId`),
  KEY `muted_users_mutedBy_fkey` (`mutedBy`),
  KEY `muted_users_membersId_fkey` (`membersId`),
  CONSTRAINT `muted_users_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `muted_users_membersId_fkey` FOREIGN KEY (`membersId`) REFERENCES `Members` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `muted_users_mutedBy_fkey` FOREIGN KEY (`mutedBy`) REFERENCES `staffMembers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muted_users`
--

/*!40000 ALTER TABLE `muted_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `muted_users` ENABLE KEYS */;

--
-- Table structure for table `staffMembers`
--

DROP TABLE IF EXISTS `staffMembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staffMembers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discordId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `promotedBy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `membersId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `staffMembers_guildId_fkey` (`guildId`),
  KEY `staffMembers_membersId_fkey` (`membersId`),
  CONSTRAINT `staffMembers_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `staffMembers_membersId_fkey` FOREIGN KEY (`membersId`) REFERENCES `Members` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staffMembers`
--

/*!40000 ALTER TABLE `staffMembers` DISABLE KEYS */;
/*!40000 ALTER TABLE `staffMembers` ENABLE KEYS */;

--
-- Table structure for table `warnedUsers`
--

DROP TABLE IF EXISTS `warnedUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warnedUsers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discordId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `warnid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `warningby` int NOT NULL,
  `guildId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` longtext COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `membersId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `warnedUsers_warningby_fkey` (`warningby`),
  KEY `warnedUsers_guildId_fkey` (`guildId`),
  KEY `warnedUsers_membersId_fkey` (`membersId`),
  CONSTRAINT `warnedUsers_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `warnedUsers_membersId_fkey` FOREIGN KEY (`membersId`) REFERENCES `Members` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `warnedUsers_warningby_fkey` FOREIGN KEY (`warningby`) REFERENCES `staffMembers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warnedUsers`
--

/*!40000 ALTER TABLE `warnedUsers` DISABLE KEYS */;
/*!40000 ALTER TABLE `warnedUsers` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-09 19:36:19
