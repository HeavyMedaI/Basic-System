<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 14:22
 */

namespace System\Engines;

\System\Libraries\Request::load("Engines/MySQL.php");

use \System\Libraries;

class FireWall {

    //private $Session;
    private $Database;

    public function __construct(){

        //$this->Session = new Libraries\Session;

        #Libraries\Session::start();

        $this->Database = (new MySQL())->connect([
            "host" => __MySQL_HOST__,
            "database" => __MySQL_DB__,
            "user" => __MySQL_USER__,
            "password" => __MySQL_PASS__
        ]);

    }

    public function isLogged(){

        if(
            //$this->Session->get("/session/login/set") == TRUE &&
            Libraries\Session::get("/session/login/set") &&
            $this->Database->table("/users")->in([
                "/username" => Libraries\Session::get("/session/login/username"),
                "password" => Libraries\Session::get("/session/login/password")
            ])
        ){

           return true;

        }

        return false;

    }

} 