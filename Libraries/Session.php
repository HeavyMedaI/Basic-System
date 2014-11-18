<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 14:28
 */

namespace System\Libraries;

\System\Libraries\Request::load("Libraries/Spyc.php");

class Session {

    public function __construct(){}

    public static function start(){

        //$this->Stream = new Libraries\Stream;

        $SessionKey = (@$_COOKIE[__PROJECT_NAME__]) ? $_COOKIE[__PROJECT_NAME__] : null;

        if(!isset($_COOKIE[__PROJECT_NAME__])||empty($_COOKIE[__PROJECT_NAME__])||strlen($_COOKIE[__PROJECT_NAME__])<=8){

            $SessionKey = md5(sha1(md5(date("d-m-Y H:i:s")+time()+rand(1, 9999999999999999999))));

            setcookie(__PROJECT_NAME__, md5(sha1(md5(date("d-m-Y H:i:s")+time()+rand(1, 9999999999999999999)))), (time()+86400), "/");

        }

        return self::load($SessionKey);

    }

    private static function load($SessionKey){

        /*if($this->Stream->exist("Sessions/".@$_COOKIE[__PROJECT_NAME__])==FALSE){

             $this->Stream::create("Sessions/".@$_COOKIE[__PROJECT_NAME__]);

        }*/

        if(Stream::exist("Sessions/".@$SessionKey)==false){

            Stream::create("Sessions/".@$SessionKey);

            $Session = array(
                "login" => array(
                    "value" => array(
                        "set" => array(
                            "value" => false,
                            "path" => "/",
                            "expire" => null
                        )
                    ),
                    "path" => "/",
                    "expire" => null
                )
            );

            return Session::set($Session);

            return true;

        }

        return true;

    }

    public static function get($Path){

        if(!Stream::exist("Sessions/".@$_COOKIE[__PROJECT_NAME__])){

            return false;

        }

        $Stream = Spyc::YAMLLoadString(Stream::read("Sessions/".@$_COOKIE[__PROJECT_NAME__]));

        $Return = $Stream;

        if($Path=="/"){

            return $Return;

        }

        $Tree = explode("/", ltrim($Path, "/"));

        foreach($Tree as $Session){

             $Return = @$Return[$Session];

        }

        return $Return;

    }

    public static function set($Data){

        if(!Stream::exist("Sessions/".@$_COOKIE[__PROJECT_NAME__])){

            return false;

        }
        //var_dump($Data["login"]["value"]);
        if(is_array($Data)){

            $Data = array(
                "session" => $Data
            );

        }

        $SettedSession = Session::get("/");

        if(!is_array($SettedSession)||empty($SettedSession)){

            $SettedSession = array();

        }

        $Data = array_merge($SettedSession, $Data);

        $Streaming = substr(Spyc::YAMLDump($Data, 4, 60), 3, (strlen(Spyc::YAMLDump($Data, 4, 60))-3));

        return Stream::write(Stream::stream("Sessions/".@$_COOKIE[__PROJECT_NAME__], "STREAM_C"), $Streaming);

    }

    public static function password($Password){

        return md5(sha1(md5($Password)));

    }

} 