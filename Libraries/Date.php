<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 3.11.2014
 * Time: 12:23
 */

namespace System\Libraries;

class Date {

    public function __construct(){

    }

    public static function tarihFormatla($Tarih, $Type=NULL, $outType=NULL){

        $Return = NULL;

        $Months = [
            "01"=>"Ocak",
            "02"=>"Şubat",
            "03"=>"Mart",
            "04"=>"Nisan",
            "05"=>"Mayıs",
            "06"=>"Haziran",
            "07"=>"Temmuz",
            "08"=>"Ağustos",
            "09"=>"Eylül",
            "10"=>"Ekim",
            "11"=>"Kasım",
            "12"=>"Aralık"
        ];

        if($Type==NULL){

            $parseDate = explode(" ", $Tarih);

            $Return = $parseDate[2]."-".array_search($parseDate[1], $Months, TRUE)."-".$parseDate[0];

            $Return .= ($parseDate[3]) ? " " . $parseDate[3] : NULL;

            if($outType=="UNIX"){

                $Return = strtotime($Return);

            }

        }else if($Type=="readable"){

            //$pickDate = substr($Tarih, 0, 10);

            $pickDate = explode(" ", $Tarih);

            $parseDate = explode("-", $pickDate[0]);

            $Return = $parseDate[2] . " " . $Months[$parseDate[1]] . " " . $parseDate[0];

            $Time = explode(":", $pickDate[1]);

            $Return .= (count($Time)>=2) ? " " . $Time[0].":".$Time[1] : NULL;

        }else if($Type=="UNIX"){

            $Return = strtotime($Tarih);

        }

        return $Return;

    }

} 