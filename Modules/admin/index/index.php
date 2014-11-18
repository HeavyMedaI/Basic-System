<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 15:13
 */

namespace System\Modules;

use System\Libraries\Request;
use System\Engines;
use System\Libraries;

Request::load("Libraries/Module.php");

class index extends Module{

    private $MySQL;

    public function __construct(){

        $this->MySQL = (new Engines\MySQL())->connect([
            "host" => __MySQL_HOST__,
            "database" => __MySQL_DB__,
            "user" => __MySQL_USER__,
            "password" => __MySQL_PASS__
        ]);

        $this->MySQL->character("utf8");

        if(!$this->MySQL->Status()){

            exit($MySQL->ErrorHandler()->ErrorMessage());

        }

        $Config = $this->getSystemConfig("/config");

        $this->data["config"]["title"] = $Config["project_name"];
        $this->data["config"] = array_merge($this->data["config"], $Config["administrator"]);
        $this->data["config"]["user_types"] = array(
            0 => "Kullanıcı",
            1 => "Yönetici"
        );
        $this->data["config"]["user_icons"] = array(
            0 => null,
            1 => "icon-securityalt-shieldalt"
        );


    }

    public function index(){

        $this->data["Profile"] = $this->MySQL->select("/users")->where("/username:=:".Libraries\Session::get("/session/login/username"))->where("/password:=:".Libraries\Session::get("/session/login/password"))->execute(["fetch" => "first"], true);

        $ImageUploadedTime = date("Y-m-d H:i:s", filemtime("Modules/".$this->data["Profile"]->avatar));

        $this->data["ImageUploadedTime"] = Libraries\Date::tarihFormatla($ImageUploadedTime, "readable");

        return $this->render();

    }

    public function hello(){

        $this->data["isim"] = "Musa";
        $this->data["soyisim"] = "ATALAY";

        return $this->render();

    }

    public function config(){

        $Config = new Engines\Config;

        $Conf = $Config->load("Modules/".Request::get("path")."/".Request::get("module")."/config.yml");

        print_r($Conf);

        return $this->render();

    }

    public function mysql_in(){

        $MySQL = (new Engines\MySQL())->connect([
            "host" => __MySQL_HOST__,
            "database" => __MySQL_DB__,
            "user" => __MySQL_USER__,
            "password" => __MySQL_PASS__
        ]);

        if(!$MySQL->Status()){

            exit($MySQL->ErrorHandler()->ErrorMessage());
          //exit("{$MySQL->ErrNo()} : {$MySQL->Error()} in {$MySQL->Err()->getFile()} on line: {$MySQL->Err()->getLine()}");

        }

        $User = $MySQL->table("users")->in([
            "/username" => "admin",
            "/password" => "66b65567cedbc743bda3417fb813b9ba"
        ]);

        //var_dump($User);

        $Sql = $MySQL
            ->select("/users:*/(username:=:admin&&email:=:admin@admin)") //A;&&;password:=:admissn||password:=:musa
            ->where("/;&&;firstname:LIKE:Musa||lastname:LIKE:ATALAY")
            ->execute();

        /*$MySQL->select([
            "users" => array(
                array("username" => "admin"),
                "&" => array("email" => "admin@admin")
            )
        ]);

        $MySQL->select("users")->where([
            array("username" => "admin"),
            "&&" => array("email" => "admin@admin")
        ]);*/

        var_dump($Sql->fetch());

        //var_dump($Sql);

        //$MySQL->select("/users:*")->where("username:musaatalay")->where("password:");

        /*if(!$User->Status()){

          exit("Error : ".$User->ErrorHandler()->ErrorMessage());

        }*/;

        //echo "Hello World!";

    }

    public function session(){

        return false;

    }

    public function create_password(){

        $this->data["Password"] = (Request::post("pass")) ? md5(sha1(md5(Request::post("pass")))) : null;

        return $this->render();

    }

} 