<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 19:50
 */

namespace System\Libraries;


//use System\Libraries\Request;

class Response {

    public function __construct(){



    }

    public static function code($HttpCode = 200){

        http_response_code($HttpCode);

        return true;

    }

    /**
     * @param [Array, array] $Data
     * @param [String, Array, null] $Template
     * @param bool $Scan
     * @return bool
     *
     * ---Using---
     *
     * -Method 1
     * # Includes template file given path and name given in String $Template and applies variables
     * # Response::render(array("/Name"=>"My Name", "Surname"=>"My Surname"), "directory/file.[tmp|html|htm|php]")
     * if thirth parameter has given true(name is Scan), then the file will not be included, render() func will open the file and will read the file content with Stream Class,
     * after that, render() func will replace declared tags with variables declared in Array $Data, then render() func will put on out String prepared content data
     *
     * -Method 2
     * # Includes template file given path and name given in String $Template[tmp] and applies variables
     * # Response::render(array("/Name"=>"My Name", "Surname"=>"My Surname"), "directory/file.[tmp|html|htm|php]")
     *  if thirth parameter has given true(name is Scan), then the file will not be included, render() func will open the file and will read the file content with Stream Class,
     *  after that, render() func will replace declared tags with variables declared in Array $Data, then render() func will put on out String prepared content data
     *
     * -Method 3
     * # Directly responses the string of String $Template[template] after replaced declared tags with variables given in Array $Data
     * # Response::render(array("/Name"=>"My Name", "Surname"=>"My Surname"), array("template"=>"Hoşgeldin {{ Name }} {{ Surname }}."))
     *   You dont need to use thirth variables name is Scan in this way, bcause it is necessary, it will not make a difference
     */
    public static function render(Array $Data = null, $Template = NULL, $Scan = false){

        self::code(200);

        if(is_array($Template)){

            if(@isset($Template["tmp"])&&@!empty($Template["tmp"])){

                extract($Data);

                if(!$Scan){

                    @require_once "Modules/".$Template["tmp"].".html";

                    return true;

                }

                return true;

            }else if(@isset($Template["template"])&&@!empty($Template["template"])){

                $Rendered = $Template["template"];

                if(count($Data)>=1){

                    ksort($Data);

                    $Keywords = array_keys($Data);

                    sort($Keywords);

                    array_walk_recursive($Keywords, "array_key_designer", "/{{ {{::target::}} }}/");

                    $Keywords = Request::memory("/RenderingKeywords");

                    $Rendered = @preg_replace($Keywords, $Data, $Template["template"]);

                }

                echo $Rendered;

                return true;

            }

        }

        extract($Data);

        if(!$Scan){

            @require_once "Modules/".$Template.".html";

            return true;

        }

        return true;

    }

    public static function json(Array $Data){

        self::code();

        self::header("json");

        exit(json_encode($Data));

    }

    public static function header($MimeType){

        self::code();

        switch(strtolower($MimeType)){

            case "json":
                header("Content-Type: application/json; charset=utf-8");
                break;
            case "xml":
                header("Content-Type: application/xml; charset=utf-8");
                break;
            case "atom":
                header("Content-Type: application/atom+xml; charset=utf-8");
                break;
            case "rss":
                header("Content-Type: application/rss+xml; charset=utf-8");
                break;
            case "pdf":
                header("Content-Type: application/pdf; charset=utf-8");
                break;
            case "html":
                header("Content-Type: text/html; charset=utf-8");
                break;
            case "text":
                header("Content-Type: text/plain; charset=utf-8");
                break;
            case "css":
                header("Content-Type: text/css; charset=utf-8");
                break;
            case "js":
                header("Content-Type: text/javascript; charset=utf-8");
                break;
            case "javascript":
                header("Content-Type: text/javascript; charset=utf-8");
                break;
            case "png":
                header("Content-Type: image/png");
                break;
            case "jpeg":
                header("Content-Type: image/jpeg");
                break;
            case "jpg":
                header("Content-Type: image/jpeg");
                break;
            case "wmv":
                header("Content-Type: video/x-ms-wmv");
                break;
            case "wmv":
                header("Content-Type: video/x-ms-wmv");
                break;
            case "mpeg":
                header("Content-Type: video/mpeg");
                break;
            case "mpeg4":
                header("Content-Type: application/mp4");
                break;
            case "mp4":
                header("Content-Type: video/mp4");
                break;
            case "mp4a":
                header("Content-Type: audio/mp4");
                break;
            case "audio":
                header("Content-Type: audio/mpeg");
                break;

        }

        return true;

    }

    /**
     * @this func an alias of ::header() func
     * @param $MimeType
     * @return bool
     */
    public static function mime($MimeType){

        return self::header($MimeType);

    }

    public static function error($ErrCode){

        self::code($ErrCode);

        if(Request::load("Modules".Request::get("app")."/error/".$ErrCode.".html")){

            return true;

        }

        return Request::load("Modules/error/".$ErrCode.".html");

    }

} 