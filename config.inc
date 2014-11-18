<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * E-Mail: musa.atalay@icloud.com
 * Date: 25.10.2014
 * Time: 14:22
 */

ob_start(); # Specifying Header settings for PHP
ini_set('display_errors', 1); # Specifying Error work style in php.ini file => Opened: 1  or Closed: 0
error_reporting(E_ALL); # Specifying Error work style => Opened: E_ALL, ...  or Closed: 0

## System Config ##

const __SITE__  =   "www.example.com"; # Declaring work domain for System
const __EXTENSION__ = ".php"; # Declaring main extension for Contollers, it must used which has been declared
const __PROJECT_NAME__ = "ExampleProject"; # Session Main Key in Cookies, it mustn´t contain any spical characters or SPACE
const __ROOT_DIR__ = "/"; # Declaring root direction for System
const __APPLICATIONS_DIR__ = "/Modules/"; # Declaring root direction for Applications
const __DEFAULT_APP__ = "villa"; # Declaring root direction for Default Application
const __SESSION_APP__ = "/session/"; # Declaring root direction for Session Application

## System Config END ##
### ------------------------------------------------------------- ###
## MySQL Config ##

const __MySQL_HOST__    =   "MYSQL HOST";
const __MySQL_DB__      =   "MYSQL DATABASE";
const __MySQL_USER__    =   "MYSQL USERNAME";
const __MySQL_PASS__    =   "MYSQL PASSWORD";

## MySQL Config END ##
### ------------------------------------------------------------- ###
## SMTP Config ##

const IS_HTML    =   "MAIN SETTING OF MAIL FORMAT -> BOOLEAN";
const IS_SMTP   =   "MAIN SETTING OF SMTP CONNECTION -> BOOLEAN";
const MAILER    =   " MAIN SETTING OF SENDING PROTOCOL -> DEFAULT IS 'smtp'";
const SMTP_AUTH    =   "MAIN SETTING OF SMTP AUTH -> BOOLEAN";
const KEEP_ALIVE    =   "MAIN SETTING OF SMTP CONNECTION LIFE -> BOOLEAN";
const SMTP_SECURE      =   "SMTP SECURE SOCKET";
const SMTP_HOST    =   "SMTP HOST";
const SMTP_PORT    =   "SMTP PORT";
const SMTP_USER    =   "SMTP USERNAME";
const SMTP_PASSWORD    =   "SMTP PASSWORD";

const SMTP_TITLE    =   "SMTP TITLE";
const SENDER_MAIL    =   "MAIN SETTING OF MAIL SENDER";
const ADMIN_MAIL    =   "MAIN SETTING OF MAIL ADMIN";

## SMTP Config END ##
### ------------------------------------------------------------- ###
## Request Config ##

## Request Config END ##
### ------------------------------------------------------------- ###
## Including Objects ##

require_once "Libraries/Request.php";
require_once "Libraries/Response.php";
require_once "Libraries/Stream.php";
require_once "Libraries/Session.php";

require_once "Engines/MySQL.php";
require_once "Engines/FireWall.php";
require_once "Engines/Config.php";