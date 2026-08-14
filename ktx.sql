-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: ktx
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contracts` (
  `end_date` date DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `student_id` int NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','CANCELED','EXPIRED','PENDING','REJECTED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKju1b0xobla9t8oexrb8lpi8jq` (`room_id`),
  KEY `FKrl96fbpbnd5exb9olcswofqmg` (`student_id`),
  CONSTRAINT `FKju1b0xobla9t8oexrb8lpi8jq` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `FKrl96fbpbnd5exb9olcswofqmg` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
INSERT INTO `contracts` VALUES ('2026-12-31',1,1,'2026-01-01',1,NULL,'ACTIVE'),('2026-12-31',2,1,'2026-01-01',2,NULL,'ACTIVE'),('2026-12-31',3,1,'2026-01-01',3,NULL,'ACTIVE'),('2026-12-31',4,2,'2026-01-01',4,NULL,'ACTIVE'),('2026-12-31',5,2,'2026-01-01',5,NULL,'ACTIVE'),('2026-12-31',6,2,'2026-01-01',6,NULL,'CANCELED'),('2026-12-31',7,3,'2026-01-01',7,'Sai thong tin','REJECTED'),('2026-12-31',8,3,'2026-01-01',8,NULL,'CANCELED'),('2026-12-31',9,4,'2026-01-01',9,'Vi pham noi quy','CANCELED'),('2026-12-31',10,4,'2026-01-01',10,NULL,'EXPIRED'),('2027-01-31',20,1,'2026-09-01',26,'đang tạm ngưng','REJECTED'),('2027-01-31',21,1,'2026-09-01',26,NULL,'CANCELED'),('2027-01-31',22,1,'2026-09-01',26,NULL,'ACTIVE');
/*!40000 ALTER TABLE `contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facility_types`
--

DROP TABLE IF EXISTS `facility_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facility_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facility_types`
--

LOCK TABLES `facility_types` WRITE;
/*!40000 ALTER TABLE `facility_types` DISABLE KEYS */;
INSERT INTO `facility_types` VALUES (1,'Quạt'),(2,'Máy lạnh'),(3,'Wifi'),(4,'Tủ lạnh'),(5,'Bàn học'),(6,'Giường tầng'),(7,'Tủ quần áo'),(8,'Máy nước nóng'),(9,'Giường'),(10,'nệm'),(11,'BẾP GA');
/*!40000 ALTER TABLE `facility_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_services`
--

DROP TABLE IF EXISTS `invoice_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `invoice_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5s99sw05tjcuhtgj6smns079v` (`invoice_id`),
  KEY `FKiujoqigc2gjtv3doefcnwl7sn` (`service_id`),
  CONSTRAINT `FK5s99sw05tjcuhtgj6smns079v` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  CONSTRAINT `FKiujoqigc2gjtv3doefcnwl7sn` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_services`
--

LOCK TABLES `invoice_services` WRITE;
/*!40000 ALTER TABLE `invoice_services` DISABLE KEYS */;
INSERT INTO `invoice_services` VALUES (26,20000,51,1),(27,15000,51,2),(28,50000,51,3),(29,100000,51,4);
/*!40000 ALTER TABLE `invoice_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `contract_id` int DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `room_price` double DEFAULT NULL,
  `service_fee` double DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL,
  `status` enum('PAID','UNPAID') DEFAULT NULL,
  `txn_ref` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKeads7q9fktwtsgdwmp1x16eqc` (`contract_id`),
  KEY `FKdyk9stbe14c67a8x3pcqg6k5f` (`room_id`),
  KEY `FKhgr2h1f3jyw86inwynpvfb9` (`student_id`),
  CONSTRAINT `FKdyk9stbe14c67a8x3pcqg6k5f` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `FKeads7q9fktwtsgdwmp1x16eqc` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`),
  CONSTRAINT `FKhgr2h1f3jyw86inwynpvfb9` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,'2026-01-10',1,1,1500000,200000,1,1700000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(2,'2026-01-10',2,1,1500000,200000,2,1700000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(3,'2026-01-10',3,1,1500000,200000,3,1700000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(4,'2026-01-10',4,2,1500000,250000,4,1750000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(5,'2026-01-10',5,2,1500000,250000,5,1750000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(6,'2026-01-10',6,2,1500000,250000,6,1750000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(7,'2026-01-10',7,3,2500000,300000,7,2800000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(8,'2026-01-10',8,3,2500000,300000,8,2800000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(9,'2026-01-10',9,4,2500000,300000,9,2800000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(10,'2026-01-10',10,4,2500000,300000,10,2800000,'2026-05-21 17:33:56.000000','2026-01','PAID',NULL),(1,'2026-06-16',11,1,1500000,350000,1,1850000,'2026-06-09 10:50:50.648084','2026-06','PAID',NULL),(2,'2026-06-16',12,1,1500000,350000,2,1850000,'2026-06-09 10:50:50.673506','2026-06','UNPAID',NULL),(3,'2026-06-16',13,1,1500000,350000,3,1850000,'2026-06-09 10:50:50.678398','2026-06','UNPAID',NULL),(4,'2026-06-16',14,2,1500000,350000,4,1850000,'2026-06-09 10:50:50.690587','2026-06','PAID',NULL),(5,'2026-06-16',15,2,1500000,350000,5,1850000,'2026-06-09 10:50:50.696573','2026-06','UNPAID',NULL),(6,'2026-06-16',16,2,1500000,350000,6,1850000,'2026-06-09 10:50:50.702308','2026-06','PAID',NULL),(8,'2026-06-16',17,3,2500000,350000,8,2850000,'2026-06-09 10:50:50.708714','2026-06','PAID',NULL),(1,'2026-07-26',19,1,1500000,350000,1,1850000,'2026-07-19 21:59:23.871568','2026-07','PAID',NULL),(2,'2026-07-26',20,1,1500000,350000,2,1850000,'2026-07-19 21:59:23.909962','2026-07','UNPAID',NULL),(3,'2026-07-26',21,1,1500000,350000,3,1850000,'2026-07-19 21:59:23.931380','2026-07','PAID',NULL),(4,'2026-07-26',22,2,1500000,350000,4,1850000,'2026-07-19 21:59:23.953283','2026-07','UNPAID',NULL),(5,'2026-07-26',23,2,1500000,350000,5,1850000,'2026-07-19 21:59:23.974968','2026-07','UNPAID',NULL),(6,'2026-07-26',24,2,1500000,350000,6,1850000,'2026-07-19 21:59:23.994694','2026-07','UNPAID',NULL),(8,'2026-07-26',25,3,2500000,350000,8,2850000,'2026-07-19 21:59:24.011647','2026-07','UNPAID',NULL),(1,'2026-08-09',43,1,1500000,35000,1,1535000,'2026-08-02 13:32:37.497214','2026-08','PAID',NULL),(2,'2026-08-09',44,1,1500000,35000,2,1535000,'2026-08-02 13:32:37.527330','2026-08','UNPAID',NULL),(3,'2026-08-09',45,1,1500000,35000,3,1535000,'2026-08-02 13:32:37.544449','2026-08','UNPAID',NULL),(4,'2026-08-09',46,2,1500000,35000,4,1535000,'2026-08-02 13:32:37.559985','2026-08','UNPAID',NULL),(5,'2026-08-09',47,2,1500000,35000,5,1535000,'2026-08-02 13:32:37.576148','2026-08','UNPAID',NULL),(6,'2026-08-09',48,2,1500000,35000,6,1535000,'2026-08-02 13:32:37.590219','2026-08','UNPAID',NULL),(8,'2026-08-09',49,3,2500000,35000,8,2535000,'2026-08-02 13:32:37.604690','2026-08','PAID',NULL),(22,'2026-08-14',51,1,200000,185000,26,385000,'2026-08-07 23:08:17.200533','2026-08','PAID','1786122726215');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `published` bit(1) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK76ko0lmh9rxbicovsjwcxkd65` (`created_by`),
  CONSTRAINT `FK76ko0lmh9rxbicovsjwcxkd65` FOREIGN KEY (`created_by`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'Hệ thống mở đăng ký phòng từ ngày 01/06 đến 31/07.','2026-06-25 00:00:00.000000',_binary '\0','Thông báo đăng ký phòng HK2',NULL),(2,'Sinh viên vui lòng thanh toán trước ngày 15 hàng tháng.','2026-06-25 00:00:00.000000',_binary '\0','Thông báo thanh toán hóa đơn',NULL),(3,'Khu A sẽ cắt điện từ 13h đến 16h ngày 30/8','2026-06-25 00:00:00.000000',_binary '','Thông báo bảo trì điện',NULL);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8s7at2kvvwjqcahv96p1svqy3` (`student_id`),
  CONSTRAINT `FKi1rostq23m0fxydy131yabmme` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residence_info`
--

DROP TABLE IF EXISTS `residence_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residence_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `ethnicity` varchar(255) DEFAULT NULL,
  `identity_issue_date` date DEFAULT NULL,
  `identity_issue_place` varchar(255) DEFAULT NULL,
  `identity_number` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `place_of_birth` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `student_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt5hmherhbq7n9193k2p75bsiy` (`student_id`),
  CONSTRAINT `FKofo5s37pn1gglu9cjq51b9t6g` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residence_info`
--

LOCK TABLES `residence_info` WRITE;
/*!40000 ALTER TABLE `residence_info` DISABLE KEYS */;
INSERT INTO `residence_info` VALUES (4,'dsdsd','','',NULL,'','','','','','','',1),(5,'Lê văn lươngd','7','Kinh','2023-02-21','TPHCM','135623552242','Việt Nam','TPHCM','HCM','Không','tân hưng',26);
/*!40000 ALTER TABLE `residence_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_facilities`
--

DROP TABLE IF EXISTS `room_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `facility_type_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2jee3360ojuskbuqnsjph2iku` (`facility_type_id`),
  KEY `FKdrxoc8cwkp0xrlcnc4scgtjmj` (`room_id`),
  CONSTRAINT `FK2jee3360ojuskbuqnsjph2iku` FOREIGN KEY (`facility_type_id`) REFERENCES `facility_types` (`id`),
  CONSTRAINT `FKdrxoc8cwkp0xrlcnc4scgtjmj` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_facilities`
--

LOCK TABLES `room_facilities` WRITE;
/*!40000 ALTER TABLE `room_facilities` DISABLE KEYS */;
INSERT INTO `room_facilities` VALUES (16,1,'GOOD',1,1),(17,1,'GOOD',3,1),(18,4,'BROKEN',5,1),(19,4,'GOOD',6,1),(20,4,'MAINTENANCE',7,1),(21,1,'GOOD',1,1),(22,1,'GOOD',3,1),(23,4,'MAINTENANCE',5,1),(24,4,'GOOD',6,1),(25,4,'GOOD',7,1),(26,1,'BROKEN',1,2),(27,1,'GOOD',3,2),(28,4,'MAINTENANCE',5,2),(29,4,'GOOD',6,2),(30,4,'GOOD',7,2),(31,1,'GOOD',2,3),(32,1,'GOOD',3,3),(33,1,'GOOD',4,3),(34,4,'GOOD',5,3),(35,4,'GOOD',6,3),(36,4,'GOOD',7,3),(37,1,'GOOD',8,3),(38,1,'GOOD',2,4),(39,1,'GOOD',3,4),(40,1,'GOOD',4,4),(41,4,'GOOD',5,4),(42,4,'GOOD',6,4),(43,4,'GOOD',7,4),(44,1,'GOOD',8,4),(45,1,'GOOD',2,5),(46,1,'GOOD',3,5),(47,1,'GOOD',4,5),(48,4,'GOOD',5,5),(49,4,'GOOD',6,5),(50,4,'GOOD',7,5),(51,1,'GOOD',8,5),(52,1,'GOOD',2,7),(53,1,'GOOD',3,7),(54,1,'GOOD',4,7),(55,4,'GOOD',5,7),(56,4,'GOOD',6,7),(57,4,'GOOD',7,7),(58,1,'GOOD',8,7);
/*!40000 ALTER TABLE `room_facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `capacity` int NOT NULL,
  `current_occupancy` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `room_name` varchar(255) NOT NULL,
  `status` enum('AVAILABLE','FULL','MAINTENANCE') DEFAULT NULL,
  `type` enum('NORMAL','PLUS') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (4,4,1,200000,'A101','FULL','NORMAL'),(4,2,2,1500000,'A102','AVAILABLE','NORMAL'),(6,0,3,2500000,'B201','AVAILABLE','PLUS'),(6,0,4,2500000,'B202','AVAILABLE','PLUS'),(8,0,5,3500000,'C301','MAINTENANCE','PLUS'),(5,0,7,500000,'ROOM 205','AVAILABLE','PLUS');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semester_registration`
--

DROP TABLE IF EXISTS `semester_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semester_registration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `contract_end_day` int DEFAULT NULL,
  `contract_end_month` int DEFAULT NULL,
  `contract_start_day` int DEFAULT NULL,
  `contract_start_month` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `register_end_day` int DEFAULT NULL,
  `register_end_month` int DEFAULT NULL,
  `register_start_day` int DEFAULT NULL,
  `register_start_month` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semester_registration`
--

LOCK TABLES `semester_registration` WRITE;
/*!40000 ALTER TABLE `semester_registration` DISABLE KEYS */;
INSERT INTO `semester_registration` VALUES (1,_binary '',31,1,1,9,'Học kỳ 1',31,8,1,8),(2,_binary '\0',30,6,1,2,'Học kỳ 2',31,1,1,12);
/*!40000 ALTER TABLE `semester_registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'nước',20000),(2,'rác',15000),(3,'điện',50000),(4,'internet',100000);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_verification`
--

DROP TABLE IF EXISTS `student_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_verification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `ma_so_sinh_vien` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','DROPPED_OUT','GRADUATED') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_verification`
--

LOCK TABLES `student_verification` WRITE;
/*!40000 ALTER TABLE `student_verification` DISABLE KEYS */;
INSERT INTO `student_verification` VALUES (2,'D21_TH01','DH52100231@student.stu.edu.vn','Nguyen Hoang Phuc','DH52100231','ACTIVE','2003-08-02'),(3,'D21_TH01','DH521003@stu.edu.vn','Le Hoang Nam','DH521003','GRADUATED','2004-02-11'),(4,'D21_TH03','DH521004@stu.edu.vn','Pham Ngoc Mai','DH521004','ACTIVE','2004-01-15'),(5,'D21_TH02','DH521005@stu.edu.vn','Vo Minh Quan','DH521005','ACTIVE','2004-03-20'),(6,'D21_TH04','DH521006@stu.edu.vn','Dang Thu Ha','DH521006','ACTIVE','2004-02-18'),(7,'D21_TH01','DH521007@stu.edu.vn','Nguyen Quoc Bao','DH521007','ACTIVE','2004-07-09'),(8,'D21_TH03','DH521008@stu.edu.vn','Tran Thanh Tung','DH521008','ACTIVE','2003-09-14'),(9,'D21_TH02','DH521009@stu.edu.vn','Do Thi Linh','DH521009','ACTIVE','2004-06-11'),(10,'D21_TH04','DH521010@stu.edu.vn','Pham Gia Huy','DH521010','ACTIVE','2003-12-01'),(11,'D22_TH01','DH521011@stu.edu.vn','Nguyen Thi Hoa','DH521011','ACTIVE','2005-01-10'),(12,'D22_TH02','DH521012@stu.edu.vn','Le Van Duc','DH521012','ACTIVE','2005-03-15'),(13,'D22_TH03','DH521013@stu.edu.vn','Pham Thi Yen','DH521013','ACTIVE','2005-06-21'),(14,'D22_TH04','DH521014@stu.edu.vn','Tran Minh Khang','DH521014','ACTIVE','2005-08-09'),(15,'D23_TH01','DH521015@stu.edu.vn','Vo Thi Ngoc','DH521015','ACTIVE','2006-02-12'),(16,'D23_TH02','DH521016@stu.edu.vn','Nguyen Quang Huy','DH521016','ACTIVE','2006-05-18'),(17,'D23_TH03','DH521017@stu.edu.vn','Le Thi Thanh','DH521017','GRADUATED','2003-04-25'),(18,'D23_TH04','DH521018@stu.edu.vn','Tran Hoang Long','DH521018','ACTIVE','2006-09-30'),(19,'D24_TH01','DH521019@stu.edu.vn','Pham Duc Anh','DH521019','ACTIVE','2007-01-14'),(20,'D24_TH02','DH521020@stu.edu.vn','Nguyen Thi Linh','DH521020','ACTIVE','2007-04-28');
/*!40000 ALTER TABLE `student_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `date_of_birth` date DEFAULT NULL,
  `gender` bit(1) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `class_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `mssv` varchar(255) NOT NULL,
  `approval_status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  `role` enum('ADMIN','STUDENT') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKakwqgcdnid3qo41cqpdu4ke01` (`mssv`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('2004-01-15',_binary '',1,'2026-05-21 17:33:56.000000','D21_TH01','an@student.stu.edu.vn','Nguyen Van AnN','123456','0901111111','SV001','APPROVED','STUDENT'),('2004-03-20',_binary '',2,'2026-05-21 17:33:56.000000','D21_TH02','bich@student.stu.edu.vn','Tran Thi Bich','123456','0902222222','SV002','APPROVED','STUDENT'),('2003-11-12',_binary '\0',3,'2026-05-21 17:33:56.000000','D21_TH01','nam@gmail.com','Le Hoang Nam','123456','0903333333','SV003','APPROVED','STUDENT'),('2004-05-25',_binary '',4,'2026-05-21 17:33:56.000000','D21_TH03','mai@gmail.com','Pham Ngoc Mai','123456','0904444444','SV004','APPROVED','STUDENT'),('2003-08-10',_binary '\0',5,'2026-05-21 17:33:56.000000','D21_TH02','quan@gmail.com','Vo Minh Quan','123456','0905555555','SV005','APPROVED','STUDENT'),('2004-02-18',_binary '',6,'2026-05-21 17:33:56.000000','D21_TH04','ha@gmail.com','Dang Thu Ha','123456','0906666666','SV006','APPROVED','STUDENT'),('2004-07-09',_binary '\0',7,'2026-05-21 17:33:56.000000','D21_TH01','bao@gmail.com','Nguyen Quoc Bao','123456','0907777777','SV007','APPROVED','STUDENT'),('2003-09-14',_binary '\0',8,'2026-05-21 17:33:56.000000','D21_TH03','tung@gmail.com','Tran Thanh Tung','123456','0908888888','SV008','APPROVED','STUDENT'),('2004-06-11',_binary '',9,'2026-05-21 17:33:56.000000','D21_TH02','linh@gmail.com','Do Thi Linh','123456','0909999999','SV009','APPROVED','STUDENT'),('2003-12-01',_binary '\0',10,'2026-05-21 17:33:56.000000','D21_TH04','huy@gmail.com','Pham Gia Huy','123456','0910000000','SV010','APPROVED','STUDENT'),(NULL,NULL,11,'2026-05-21 17:35:20.000000',NULL,'admin@gmail.com','Administrator','$2a$10$ETtlySQQZexzWPoeNl9NXe2EMie/kwVYU8MHjkBMnhic4vWFaUpsC','0834101551','admin','APPROVED','ADMIN'),('2003-08-02',_binary '\0',26,'2026-08-07 18:14:00.421000','D21_TH01','dh52100231@student.stu.edu.vn','hoàng phúc','$2a$10$Jj.it8ABoi/jexkk6NG1v.qtcujbXDJPYruK5ir.etmltip/OPVJ.','0123949294','DH52100231','APPROVED','STUDENT');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-10 11:08:46
