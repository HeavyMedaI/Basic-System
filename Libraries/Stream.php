<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 14:58
 */

namespace System\Libraries;


class Stream {

    private static $StreamTypes = array(
        "STREAM_C" => "w",
        "STREAMING_O" => "r",
        "STREAMING" => "r+",
        "WRITE_O" => "a",
    );

    public function __construct(){


    }

    public static function stream($Path, $StreamType){

        $Open =  @fopen($Path, self::$StreamTypes[$StreamType]);

        if($Open){

            return $Open;

        }

        return false;

    }

    public static function exist($Path){

        if(is_readable($Path)){ # file_exists

            return true;

        }

        return false;

    }

    public static function create($Path){

        return touch($Path, time()); # fopen($Path, "x+")

    }

    public static function read($Source){

        return @file_get_contents($Source);

    }

    public static function write($Stream, $Data){

        if(@fwrite($Stream, $Data)<=1){

            return true;

        }

        return false;

    }

} 