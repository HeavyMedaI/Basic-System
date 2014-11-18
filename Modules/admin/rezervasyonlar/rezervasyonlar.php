<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * E-Mail: musa.atalay@icloud.com
 * Date: 11.11.2014
 * Time: 09:55
 */

namespace System\Modules;

use System\Libraries\Request;
use System\Engines;
use System\Libraries;

Request::load("Libraries/Module.php");

class rezervasyonlar extends Module {

    private $MySQL;

    public function __construct()
    {

        $this->MySQL = (new Engines\MySQL())->connect();

        $this->MySQL->character("utf8");

        if (!$this->MySQL->Status()) {

            exit($MySQL->ErrorHandler()->ErrorMessage());

        }

        $Config = $this->getSystemConfig("/config");

        $this->data["config"]["title"] = $Config["project_name"];
        $this->data["config"] = array_merge($this->data["config"], $Config["administrator"]);

    }

    public function index(){

        $this->data["Rezervasyonlar"] = $this->MySQL->select("/rezervasyon")->desc("/id")->execute(["fetch" => "all"], true);

        return $this->render();

    }

    public function sil(){

        #$Delete = $this->MySQL->query("DELETE FROM rezervasyon WHERE id = ".Request::post("id"));
        $Delete = $this->MySQL->delete("/rezervasyon")->where("/id:=:".Request::post("id"));

        $Res = array("response" => false);

        if($Delete->execute()){

            $Res = array("response" => true);

        }

        Libraries\Response::header("json");

        Libraries\Response::json($Res);

    }

    public function active(){

        #$Update = $this->MySQL->query("UPDATE `rezervasyon` SET `approved` = 1 WHERE `id` = ".Request::post("id"))->execute();
        $Update = $this->MySQL->update("/rezervasyon/approved::1")->where("/id:=:".Request::post("id"));

        $Res = array("response"  => false);

        if($Update->execute()){

            $Rez = $this->MySQL->select("/rezervasyon:*")->where("/id:=:".Request::post("id"))->execute(["fetch" => "first"], true);

            $Mail = new Libraries\Smtp;

            $Mail::set();

            $Mail::is_html(false);

            $Mail::from($Mail::Conf("sender"));

            $Mail::fromname($Mail::Conf("title"));

            $Mail::sender($Mail::Conf("sender"));

            $Mail::add_reply($Mail::Conf("sender"), $Mail::Conf("title"));

            $Mail::add_address($Rez->email, $Rez->name);

            $Mail::subject("Rezervasyon Bildirimi - Onaylandı");

            $Mail::body(htmlspecialchars_decode("<a style='text-decoration: none;color: dodgerblue;' href='http://islamibalayi.com/detay?villa_id=".$Rez->villa_id."'><b style='color: dodgerblue'>".$Rez->code."</b></a> numaralı rezervasyonunuz onaylanmıştır. Bilginize."));

            $Mail::altbody($_SERVER['SERVER_NAME']." rezervasyon bilgilendirme.");

            $Mail::send();

            $Res = array("response" => true);

        }

        Libraries\Response::header("json");

        Libraries\Response::json($Res);

    }

    public function deactive(){

        #$Update = $this->MySQL->query("UPDATE villa SET active = 0 WHERE id = ".Request::post("id"));
        $Update = $this->MySQL->update("/rezervasyon/approved::0")->where("/id:=:".Request::post("id"));

        $Res = array("response" => false);

        if($Update->execute()){

            $Rez = $this->MySQL->select("/rezervasyon:*")->where("/id:=:".Request::post("id"))->execute(["fetch" => "first"], true);

            $Mail = new Libraries\Smtp;

            $Mail::set();

            $Mail::is_html(false);

            $Mail::from($Mail::Conf("sender"));

            $Mail::fromname($Mail::Conf("title"));

            $Mail::sender($Mail::Conf("sender"));

            $Mail::add_reply($Mail::Conf("sender"), $Mail::Conf("title"));

            $Mail::add_address($Rez->email, $Rez->name);

            $Mail::subject("Rezervasyon Bildirimi - İptal Edildi");

            $Mail::body(htmlspecialchars_decode("<a style='text-decoration: none;color: dodgerblue;' href='http://islamibalayi.com/detay?villa_id=".$Rez->villa_id."'><b style='color: dodgerblue;'>".$Rez->code."</b></a> numaralı rezervasyonunuz iptal edilmiştir. Bilginize."));

            $Mail::altbody($_SERVER['SERVER_NAME']." rezervasyon bilgilendirme.");

            $Mail::send();

            $Res = array("response" => true);

        }

        Libraries\Response::header("json");

        Libraries\Response::json($Res);

    }

} 