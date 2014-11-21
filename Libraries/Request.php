<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 15:27
 */

namespace System\Libraries;

use \System\Config;
use \System\Engines;
use \System\Libraries;

class Request {

    public function __construct(){

    }

    public static function get($Index = null, $Value = null){

        $Index = ltrim($Index, "[/\#\$\;\:]");

        if($Value===null){

            if($Index==null){

                return $_GET;

            }

            if(self::isGet($Index)){

                return $_GET[$Index];

            }

        }else{

            $_GET[$Index] = self::escape($Value);

            return true;

        }

        return false;

    }

    public static function isGet($Index){

        $Index = ltrim($Index, "[/\#\$\;\:]");

        if((isset($_GET[$Index])&&!empty($_GET[$Index]))&&($_GET[$Index]!=null&&strlen($_GET[$Index])>=1)){

            return true;

        }

        return false;

    }

    public static function post($Index = null, $Value = null){

        $Index = ltrim($Index, "[/\#\$\;\:]");

        if($Value===null){

            if($Index==null){

                return $_POST;

            }

            if(self::isPost($Index)){

                return $_POST[$Index];

            }

        }else{

            $_POST[$Index] = $Value;

            return true;

        }

        return false;

    }

    public static function isPost($Index){

        $Index = ltrim($Index, "[/\#\$\;\:]");

        if((@isset($_POST[$Index])&&!empty($_POST[$Index]))&&(@$_POST[$Index]!=null&&strlen(@$_POST[$Index])>=1)){

            return true;

        }

        return false;

    }

    public static function file($Index=null){

        $Index = ltrim($Index, "[/\#\$\;\:]");

        if($Index==null){

            return $_FILES;

        }

        if(isset($_FILES[$Index])&&!empty($_FILES[$Index])){

            return $_FILES[$Index];

        }

        return false;

    }

    public static function isFile($Index){

        $Index = ltrim($Index, "[/\#\$\;\:]");

        if((@isset($_FILES[$Index])&&!empty($_FILES[$Index]))&&(@$_FILES[$Index]!=null&&strlen(@$_FILES[$Index])>=1)){

            return true;

        }

        return false;

    }

    public static function load($Path){

        if(Stream::exist($Path)){

            require_once $Path;

            return true;

        }

        return FALSE;

    }

    public static function login($Path = NULL){

        #$Path = ($Path) ? $Path : Request::get("app");

        $Path = ($Path) ? $Path : "admin";

        Response::render(array("Path" => $Path), $Path."/login/index");

        exit;

    }

    public static function isModule($Object){

        if(class_exists($Object)){

            return true;

        }

        return false;

    }

    public static function isPage($Object, $Method){

        if(method_exists($Object, $Method)){

            return true;

        }

        return false;

    }

    public static function snapshot($Path){

        Request::load($Path);

    }

    public static function module($Module = null){

        Libraries\Session::start();

        if(Request::get("app")=="default"){

            $_GET["app"] = __DEFAULT_APP__;

        }

        if(!Request::load("Modules/".Request::get("app")."/".Request::get("module")."/".Request::get("module").__EXTENSION__)){

            Response::error(404);

            exit;

        }

        Request::load("Modules/".Request::get("app")."/config.inc");

        $FireWall =  new Engines\FireWall;

        $Conf = new Engines\Config;

        $ConfigApp = $Conf->load("Modules/".Request::get("app")."/config.yml");

        Request::load("Modules/".Request::get("app")."/".Request::get("module")."/config.inc");

        $ConfigModule = $Conf->load("Modules/".Request::get("app")."/".Request::get("module")."/config.yml");

        /*if($Conf->isPrivate()){

            Request::login(Request::get("app"));

            return FALSE;

        }*/

        if($Module != NULL){

            $Module = explode("/", $Module);

            if(!Request::isModule($Module[0])){

                Response::error(404);

                exit;

            }

            $LoadModule = new $Module[0];

            $Command = ($Module[1]) ? $Module[1] : "index";

            if(!Request::isPage($LoadModule, $Command)){

                Response::error(404);

                exit;

            }

            $Render = $LoadModule->$Command();

            if(!$Render){

                Response::error(404);

                exit;

            }else if(is_array($Render)){

                Response::render(
                    $Render,
                    Request::get("app")."/".Request::get("module")."/".Request::get("command")
                );

            }

            /*if($Render){

                Response::render(
                    $Render,
                    Request::get("app")."/".Request::get("module")."/".Request::get("command")
                );

            }*/

            return true;

        }

        $M =  "\\System\\Modules\\".Request::get("module");

        $LoadModule = new $M;

        $Command = (Request::get("command")) ? Request::get("command") : "index";

        if(!Request::isPage($LoadModule, $Command)){

            Response::error(404);

            exit;

        }

        $Render = $LoadModule->$Command();

        if(!$Render){

            Response::error(404);

            exit;

        }else if(is_array($Render)){

            Response::render(
                $Render,
                Request::get("app")."/".Request::get("module")."/".Request::get("command")
            );

        }

        return true;

    }

    public static function error($ErrCode){

        if(Request::load("Modules".Request::get("app")."/error/".$ErrCode.".html")){

            return TRUE;

        }

        return Request::load("Modules/error/".$ErrCode.".html");

    }

    public static function escape($Var){

        return htmlspecialchars($Var);

    }

    public static function decode($Var, $Type){

        $Type = strtolower($Type);

        switch($Type){
            case "base64":
                return self::base64_decode($Var);
                break;
            default:
                return self::base64_decode($Var);
                break;
        }

    }

    public static function base64_decode($Var){

        return base64_decode(str_replace(" ", "+", $Var));

    }

    public static function encode($Var, $Type){

        switch(strtolower($Type)){
            case "base64":
                return self::base64_encode($Var);
                break;
            default:
                return self::base64_encode($Var);
                break;
        }

    }

    public static function base64_encode($Var){

        return base64_encode($Var);

    }

    public static function storage($Settings){

        if(is_array($Settings)){

            if(isset($Settings["life"])&&is_bool($Settings["life"])){

                $_POST["storage"]["settings"]["status"] = $Settings["life"];

            }

            if(isset($Settings["status"])){

                $_POST["storage"]["settings"]["status"] = $Settings["status"];

            }

            if(isset($Settings["memory"])){

                if($Settings["memory"]=="clear"||$Settings["memory"]=="empty"){

                    $_POST["storage"]["memory"] = null;

                }else if($Settings["memory"]=="destroy"||$Settings["memory"]=="kill"){

                    unset($_POST["storage"]["memory"]);

                    return true;

                }

            }

            return true;

        }else if(is_string($Settings)){

            if($Settings=="start"||$Settings=="on"){

                $_POST["storage"]["settings"]["status"] = true;

               if(!@$_POST["storage"]["memory"]){

                   $_POST["storage"]["memory"] = array();

               }

                return true;

            }else if($Settings=="close"||$Settings=="off"){

                $_POST["storage"]["settings"]["status"] = false;

                return true;

            }else if($Settings=="clear"||$Settings=="empty"){

                $_POST["storage"]["memory"] = null;

                return true;

            }else if($Settings=="destroy"||$Settings=="kill"){

                 unset($_POST["storage"]["memory"]);

                return true;

            }

            return false;

        }

    }

    public static function memory($Path = null, $Value = null){

        if($_POST["storage"]["settings"]["status"]){

            $_MEMORY = $_POST["storage"]["memory"];

            $Path = ltrim($Path, "[/\#\$\;\:]");

            if($Value===null){

                $Tree = explode("/", $Path);

                foreach($Tree as $Index){

                    $_MEMORY = @$_MEMORY[$Index];

                }

                return $_MEMORY;

            }else{

                if(!self::isMemory($Path)){

                    $_POST["storage"]["memory"][$Path] = $Value;

                    return true;

                }

                if(is_array($Value)){

                    $_POST["storage"]["memory"][$Path] = array_merge($_POST["storage"]["memory"][$Path], $Value);

                    return true;

                }

            }

        }

        return false;

    }

    public static function isMemory($Index){

        $Index = ltrim($Index, "[/\#\$\;\:]");

        $_MEMORY = $_POST["storage"]["memory"];

        if((@is_array($_MEMORY[$Index]))||((@isset($_MEMORY[$Index])&&!empty($_MEMORY[$Index]))&&(@$_MEMORY[$Index]!=null&&strlen(@$_MEMORY[$Index])>=1))){

            return true;

        }

        return false;

    }

    /**
     * @this func is an alias of isMemory() func
     * @param $Index takes String
     * @return bool
     */
    public static function inMemory($Index){

        return self::isMemory($Index);

    }

} 