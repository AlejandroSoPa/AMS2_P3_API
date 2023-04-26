-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: containers-us-west-99.railway.app    Database: railway
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `CICLES`
--

DROP TABLE IF EXISTS `CICLES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CICLES` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` text,
  `id_families` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_families` (`id_families`),
  CONSTRAINT `CICLES_ibfk_1` FOREIGN KEY (`id_families`) REFERENCES `FAMILIES` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CICLES`
--

LOCK TABLES `CICLES` WRITE;
/*!40000 ALTER TABLE `CICLES` DISABLE KEYS */;
INSERT INTO `CICLES` VALUES (1,'Sistemes microinformatics i xarxes',1),(2,'Gestio administrativa',2),(3,'Electromecanica de vehicles automobils',3),(4,'Manteniment electromecanics',4),(5,'Mecanitzacio',5),(6,'Administracio de sistemes informatics en xarxa - orientat a Ciberseguretat',1),(7,'Desenvolupament d aplicacions multiplataforma',1),(8,'Desenvolupament d aplicacions web',1),(9,'Administracio i finances',2),(10,'Assistencia a la direccio',2),(11,'Automocio',3),(12,'Mecatronica industrial',4),(13,'Programacio de la produccio en fabricacio mecanica',5),(14,'Gestio de l aigua',6);
/*!40000 ALTER TABLE `CICLES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FAMILIES`
--

DROP TABLE IF EXISTS `FAMILIES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FAMILIES` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FAMILIES`
--

LOCK TABLES `FAMILIES` WRITE;
/*!40000 ALTER TABLE `FAMILIES` DISABLE KEYS */;
INSERT INTO `FAMILIES` VALUES (1,'Informatica'),(2,'Administratiu'),(3,'Automocio'),(4,'Manteniment i serveis a la produccio'),(5,'Fabricacio mecanica'),(6,'Aigues');
/*!40000 ALTER TABLE `FAMILIES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OCUPACIONS`
--

DROP TABLE IF EXISTS `OCUPACIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OCUPACIONS` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` text NOT NULL,
  `id_cicles` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_cicles` (`id_cicles`),
  CONSTRAINT `OCUPACIONS_ibfk_1` FOREIGN KEY (`id_cicles`) REFERENCES `CICLES` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OCUPACIONS`
--

LOCK TABLES `OCUPACIONS` WRITE;
/*!40000 ALTER TABLE `OCUPACIONS` DISABLE KEYS */;
INSERT INTO `OCUPACIONS` VALUES (1,'Personal tecnic instal·lador-reparador d equips informatics.',1),(2,'Personal tecnic de suport informatic',1),(3,'Personal tecnic de xarxes de dades.',1),(4,'Personal reparador de periferics de sistemes microinformatics',1),(5,'Comercials de microinformatica',1),(6,'Comercials de microinformatica. ',1),(7,'Personal operador de teleassistencia.',1),(8,'Personal operador de sistemes.',1),(9,'Personal auxiliar administratiu',2),(10,'Personal ajudant d oficina.',2),(11,'Personal auxiliar administratiu de cobraments i pagaments',2),(12,'Personal administratiu comercial. ',2),(13,'Personal auxiliar administratiu de gestio de personal. ',2),(14,'Personal auxiliar administratiu de les administracions publiques. ',2),(15,'Recepcionista',2),(16,'Personal empleat d atencio al client. ',2),(17,'Personal empleat de tresoreria. ',2),(18,'Personal empleat de mitjans de pagament.',2),(19,'Electronicistes de vehicles. ',3),(20,'Electricistes electronics de manteniment i reparacio en automocio. ',3),(21,'Personal mecanic d automobils.',3),(22,'Electricistes d automobils. ',3),(23,'Personal electromecanic d automobils. ',3),(24,'Personal mecanic de motors i els seus sistemes auxiliars d automobils i motocicletes. ',3),(25,'Personal reparador de sistemes pneumatics i hidraulics. ',3),(26,'Personal reparador de sistemes de transmissio i de frens. ',3),(27,'Personal reparador de sistemes de direccio i suspensio. ',3),(28,'Personal operari d ITV. ',3),(29,'Personal instal·lador d accessoris en vehicles. ',3),(30,'Personal operari d empreses dedicades a la fabricacio de recanvis. ',3),(31,'Personal electromecanic de motocicletes. ',3),(32,'Personal venedor/distribuidor de recanvis i d’equips de diagnosi.',3),(33,'Mecanic de manteniment',4),(34,'Muntador industrial',4),(35,'Muntador d equips electrics. ',4),(36,'Muntador d equips electronics.',4),(37,'Mantenidor de linia automatitzada',4),(38,'Muntador de bens d equip',4),(39,'Muntador d automatismes pneumatics i hidraulics',4),(40,'Instal·lador electricista industrial',4),(41,'Electricista de manteniment i reparació d equips de control, mesura i precisio',4),(42,'Personal ajustador operari de maquines eina.',5),(43,'Personal polidor de metalls i afilador d eines. ',5),(44,'Personal operador de maquines per treballar metalls.',5),(45,'Personal operador de maquines eina.',5),(46,'Personal operador de robots industrials',5),(47,'Personal treballador de la fabricació d eines, mecanic i ajustador, modelista matricer i similars',5),(48,'Personal torner, fresador i mandrinador.',5),(49,'Personal tecnic en administracio de sistemes.',6),(50,'Responsable d informatica.',6),(51,'Personal tecnic en serveis d Internet.',6),(52,'Personal tecnic en serveis de missatgeria electronica.',6),(53,'Personal de recolzament i suport tecnic.',6),(54,'Personal tecnic en teleassistencia.',6),(55,'Personal tecnic en administracio de base de dades.',6),(56,'Personal tecnic de xarxes.',6),(57,'Personal supervisor de sistemes.',6),(58,'Personal tecnic en serveis de comunicacions.',6),(59,'Personal tecnic en entorns web.',6),(60,'Desenvolupar aplicacions informatiques per a la gestio empresarial i de negoci.',7),(61,'Desenvolupar aplicacions de proposit general.',7),(62,'Desenvolupar aplicacions en l ambit de l entreteniment i la informatica mobil.',7),(63,'Programador web.',8),(64,'Programador multimedia.',8),(65,'Desenvolupador d aplicacions en entorns web.',8),(66,'Administratiu d oficina.',9),(67,'Administratiu comercial.',9),(68,'Administratiu financer.',9),(69,'Administratiu comptable.',9),(70,'Administratiu de logistica.',9),(71,'Administratiu de banca i d assegurances.',9),(72,'Administratiu de recursos humans.',9),(73,'Administratiu de l Administracio publica.',9),(74,'Administratiu d\'assessories juridiques, comptables, laborals, fiscals o gestories.',9),(75,'Tecnic en gestio de cobraments.',9),(76,'Responsable d atencio al client.',9),(77,'Assistent a la direccio.',10),(78,'Assistent personal.',10),(79,'Secretari de direccio.',10),(80,'Assistent de despatxos i oficines.',10),(81,'Assistent juridic.',10),(82,'Assistent en departaments de recursos humans.',10),(83,'Administratiu en les administracions i organismes publics.',10),(84,'Cap de l area d electromecanica.',11),(85,'Recepcionista de vehicles.',11),(86,'Cap de taller de vehicles de motor.',11),(87,'Personal encarregat d ITV.',11),(88,'Personal perit taxador de vehicles.',11),(89,'Cap de servei.',11),(90,'Personal encarregat d area de recanvis.',11),(91,'Personal encarregat d area comercial d equips relacionats amb els vehicles.',11),(92,'Cap de l area de carrosseria: xapa i pintura.',11),(93,'Tecnic en planificacio i programacio de processos de manteniment d instal·lacions de maquinaria i equip industrial.',12),(94,'Cap d equip de muntadors d instal·lacions de maquinaria i equip industrial.',12),(95,'Cap d equip de mantenidors d instal·lacions de maquinaria i equip industrial.',12),(96,'Tecnic o tecnica en mecanica.',13),(97,'Encarregat o encarregada d instal·lacions de processament de metalls.',13),(98,'Encarregat o encarregada d operadors de maquines per treballar metalls.',13),(99,'Encarregat o encarregada de muntadors.',13),(100,'Programador o programadora de CNC (control numeric amb ordinador).',13),(101,'Programador o programadora de sistemes automatitzats en fabricacio mecanica',13),(102,'Programador o programadora de la produccio.',13),(103,'Encarregat de muntatge de xarxes d abastament i distribucio d aigua.',14),(104,'Encarregat de muntatge de xarxes i instal·lacions de sanejament.',14),(105,'Encarregat de manteniment de xarxes d aigua.',14),(106,'Encarregat de manteniment de xarxes de sanejament.',14),(107,'Operador de planta de tractament d aigua d abastament.',14),(108,'Operador de planta de tractament d aigues residuals.',14),(109,'Tecnic en gestio de l us eficient de l aigua.',14),(110,'Tecnic en sistemes de distribució d aigua.',14);
/*!40000 ALTER TABLE `OCUPACIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RANKING`
--

DROP TABLE IF EXISTS `RANKING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RANKING` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL,
  `puntuacio` int NOT NULL,
  `temps` int NOT NULL,
  `encerts` int NOT NULL,
  `errades` int NOT NULL,
  `id_cicle` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_cicle` (`id_cicle`),
  CONSTRAINT `RANKING_ibfk_1` FOREIGN KEY (`id_cicle`) REFERENCES `CICLES` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RANKING`
--

LOCK TABLES `RANKING` WRITE;
/*!40000 ALTER TABLE `RANKING` DISABLE KEYS */;
/*!40000 ALTER TABLE `RANKING` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-26 18:05:04
