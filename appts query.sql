CREATE DATABASE `apptest` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `access` (
  `pk` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `resID` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orgs` (
  `orgID` int(11) NOT NULL AUTO_INCREMENT,
  `orgName` varchar(60) NOT NULL,
  `path` varchar(90) NOT NULL,
  `threshold` int(11) NOT NULL DEFAULT '30',
  `resCount` int(11) NOT NULL DEFAULT '3',
  `active` int(11) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`orgID`),
  UNIQUE KEY `orgID_UNIQUE` (`orgID`),
  UNIQUE KEY `path_UNIQUE` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `resources` (
  `resID` int(11) NOT NULL AUTO_INCREMENT,
  `orgID` int(11) NOT NULL,
  `desc` varchar(90) DEFAULT NULL,
  `first` varchar(45) DEFAULT NULL,
  `last` varchar(45) DEFAULT NULL,
  `emrID` varchar(90) NOT NULL,
  `active` varchar(45) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`resID`),
  UNIQUE KEY `provID_UNIQUE` (`resID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `orgID` int(11) NOT NULL,
  `userName` varchar(45) NOT NULL,
  `password` varchar(80) NOT NULL,
  `email` varchar(60) NOT NULL,
  `active` int(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL,
  `admin` int(1) NOT NULL DEFAULT '0',
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userID_UNIQUE` (`userID`),
  UNIQUE KEY `userName_UNIQUE` (`userName`),
  UNIQUE KEY `password_UNIQUE` (`password`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

