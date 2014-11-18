<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * E-Mail: musa.atalay@icloud.com
 * Date: 25.10.2014
 * Time: 15:27
 */

namespace System\Libraries;

use \System\Config;
use \System\Engines;

Request::load("Modules/".Request::get("app")."/config.inc");
Request::load("Engines/class.smtp.php");
Request::load("Engines/smtp.php");

class Smtp{

    private static $Mailler;
    private static $Config;

    public function __construct(){

        self::$Config = new Engines\Config;

        self::$Mailler = new Engines\PHPMailer;

        return $this;

    }

    public static function Conf($Path){

        $Configration = self::$Config->get("config.yml", "/config/smtp");

        $Return = null;

        if(isset($Configration[$Path])||!empty($Configration[$Path])){

            $Return = $Configration[$Path];

        }else{

            eval("\$Return = ".strtoupper($Path).";");

        }

        return $Return;

    }

    public static function set(){

        $Configration = self::$Config->get("config.yml", "/config/smtp");

        $IS_SMTP = ($Configration["is_smtp"]) ? $Configration["is_smtp"] : IS_SMTP;
        $MAILER = ($Configration["mailer"]) ? trim($Configration["mailer"]) : trim(MAILER);
        $KEEP_ALIVE = ($Configration["keep_alive"]) ? $Configration["keep_alive"] : KEEP_ALIVE;
        if($IS_SMTP){
            self::$Mailler->isSMTP($IS_SMTP);
        }
        self::$Mailler->SMTPKeepAlive = $KEEP_ALIVE;
        self::$Mailler->SMTPSecure = ($Configration["secure"]) ? trim($Configration["secure"]) : trim(SMTP_SECURE);
        self::$Mailler->Host     = ($Configration["host"]) ? trim($Configration["host"]) : trim(SMTP_HOST);
        self::$Mailler->SMTPAuth = ($Configration["auth"]) ? $Configration["auth"] : SMTP_AUTH;
        self::$Mailler->Username = ($Configration["username"]) ? trim($Configration["username"]) : trim(SMTP_USER);
        self::$Mailler->Password = ($Configration["password"]) ? trim($Configration["password"]) : trim(SMTP_PASSWORD);
        self::$Mailler->Port = ($Configration["port"]) ? trim($Configration["port"]) : trim(SMTP_PORT);

        $IS_HTML = ($Configration["is_html"]) ? $Configration["is_html"] : IS_HTML;
        $SENDER = ($Configration["sender"]) ? trim($Configration["sender"]) : trim(SENDER_MAIL);
        $TITLE = ($Configration["title"]) ? trim($Configration["title"]) : trim(SMTP_TITLE);
        self::$Mailler->IsHTML($IS_HTML);
        #self::$Mailler->setLanguage('tr', './class/');
        self::$Mailler->ContentType = "text/html";
        self::$Mailler->CharSet = "utf-8";
        self::$Mailler->From     = $SENDER;
        self::$Mailler->FromName = $TITLE;
        #self::$Mailler->Sender   = $SENDER;
        #self::$Mailler->AddReplyTo($SENDER, $TITLE);
        self::$Mailler->WordWrap = 50;

    }

    public static function host($Host){ # Smtp $Mailler,

        self::$Mailler->Host = trim($Host);

    }

    public static function port($Port){

        self::$Mailler->Port = trim($Port);

    }

    public static function is_smtp($isSMTP = null){

        self::$Mailler->isSMTP($isSMTP);

    }

    public static function mailer($Mailer){

        self::$Mailler->Mailer  = trim($Mailer);

    }

    public static function keep_alive($SMTPKeepAlive){

        self::$Mailler->SMTPKeepAlive = $SMTPKeepAlive;

    }

    public static function auth($Auth){

        self::$Mailler->SMTPAuth = $SMTPAuth;

    }

    public static function secure($Secure){

        self::$Mailler->SMTPSecure = trim($Secure);

    }

    public static function is_html($IS_HTML = true){

        self::$Mailler->IsHTML($IS_HTML);

        if($IS_HTML){

            self::$Mailler->Body = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n\r'.self::$Mailler->Body;

        }

    }

    public static function username($Username){

        self::$Mailler->Username = trim($Username);

    }

    public static function password($Password){

        self::$Mailler->Password = trim($Password);

    }

    public static function subject($Subject){

        self::$Mailler->Subject = $Subject;

    }

    public static function body($Body){

        self::$Mailler->Body .= $Body;

    }

    public static function get_body(){

        return self::$Mailler->Body;

    }

    public static function clear_body(){

        self::$Mailler->Body = null;

    }

    public static function altbody($AltBody){

        self::$Mailler->AltBody = $AltBody;

    }

    public static function add_address($Address, $Name = null){

        self::$Mailler->AddAddress(trim($Address), trim($Name));

    }

    public static function clear_addresses(){

        self::$Mailler->ClearAddresses();

    }

    public static function add_reply($ReplyAddress, $ReplyName = null){

        self::$Mailler->AddReplyTo(trim($ReplyAddress), trim($ReplyName));

    }

    /**
     * @param $Path : - is the path of the filename. It can be a relative one (from your script, not the PHPMailer class) or a full path to the file you want to attach.
     * @param null $Name : - is an optional parameter, used to set the name of the file that will be embedded within the e-mail. The person who will recieve your mail will then only see this name, rather than the original filename.
     * @param null $Encoding : - is a little more technical, but with this parameter you can set the type of encoding of the attachment. The default is base64. Other types that are supported include: 7bit, 8bit, binary & quoted-printable.
     * @param $Mime : - is the MIME type of the attached file. Content types are defined not necessarily by file suffixes (i.e., .GIF or .MP3), but, rather, a MIME type (MIME = Multipurpose Internet Mail Extensions) is used.
     */
    public static function add_attach($Path, $Name = null, $Encoding = null, $Mime){

        self::$Mailler->AddAttachment($Path,$Name,$Encoding,$Mime);

    }

    /**
     *
     * ::attach() is an alias of ::add_attach() method.
     *
     * @param $Path : - is the path of the filename. It can be a relative one (from your script, not the PHPMailer class) or a full path to the file you want to attach.
     * @param null $Name : - is an optional parameter, used to set the name of the file that will be embedded within the e-mail. The person who will recieve your mail will then only see this name, rather than the original filename.
     * @param null $Encoding : - is a little more technical, but with this parameter you can set the type of encoding of the attachment. The default is base64. Other types that are supported include: 7bit, 8bit, binary & quoted-printable.
     * @param $Mime : - is the MIME type of the attached file. Content types are defined not necessarily by file suffixes (i.e., .GIF or .MP3), but, rather, a MIME type (MIME = Multipurpose Internet Mail Extensions) is used.
     */
    public static function attach($Path, $Name = null, $Encoding = null, $Mime){

        self::$Mailler->AddAttachment($Path,$Name,$Encoding,$Mime);

    }

    public static function clear_attachments(){

        self::$Mailler->ClearAttachments();

    }

    public static function send(){

        return self::$Mailler->Send();

    }

    public static function wordwrap($WordWrap){

        self::$Mailler->WordWrap = $WordWrap;

    }

    public static function charset($CharSet){

        self::$Mailler->CharSet = trim($CharSet);

    }

    public static function mime($MiMe){

        self::$Mailler->ContentType = trim($MiMe);

    }

    public static function from($From){

        self::$Mailler->From = trim($From);

    }

    public static function fromname($FromName){

        self::$Mailler->FromName = trim($FromName);

    }

    public static function sender($Sender){

        self::$Mailler->Sender = trim($Sender);

    }

    public static function AddReplyTo($ReplyMail, $ReplyName){

        self::$Mailler->AddReplyTo(trim($ReplyMail), $ReplyName);

    }

    /**
     * @param int $Debug [
     *  0 = off (for production use),
     *  1: Client messages,
     *  2: Client and Server messages
     *  3: Enable verbose debug output
     * ]
     */
    public static function debug($Debug = 1){

        self::$Mailler->SMTPDebug = $Debug;

    }

    public static function error_info(){

        var_dump(self::$Mailler->ErrorInfo);

    }

    public static function ErrorInfo(){

        var_dump(self::$Mailler->ErrorInfo);

    }

    public static function dump(){

        var_dump(self::$Mailler);

    }

}

?>