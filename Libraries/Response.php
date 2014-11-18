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

    public static function render(Array $Data, $Themplate = NULL){

        extract($Data);

        @require_once "Modules/".$Themplate.".html";

    }

    public static function json(Array $Data){

        Response::header("json");

        exit(json_encode($Data));

    }

    public static function header($MimeType){

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

    }

} 