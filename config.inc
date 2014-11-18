<?php

ob_start();

error_reporting(E_ALL);

const __EXTENSION__ = ".php";
const __PROJECT_NAME__ = "AkasyaWeb";
const __ROOT_DIR__ = "/Projects/AkasyaSystem/";
const __APPLICATIONS_DIR__ = "/Projects/AkasyaSystem/Modules/";
const __DEFAULT_APP__ = "villa";
const __SESSION_APP__ = "/Projects/AkasyaSystem/session/";

## MySQL Config ##

const __MySQL_HOST__    =   "localhost";
const __MySQL_DB__      =   "basic_system";
const __MySQL_USER__    =   "root";
const __MySQL_PASS__    =   "";

## MySQL Config END ##

## Request Config ##

## Request Config END ##

require_once "Libraries/Request.php";
require_once "Libraries/Response.php";
require_once "Libraries/Stream.php";
require_once "Libraries/Session.php";

require_once "Engines/MySQL.php";
require_once "Engines/FireWall.php";
require_once "Engines/Config.php";