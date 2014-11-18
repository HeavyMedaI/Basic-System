<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 29.10.2014
 * Time: 13:17
 */

namespace System\Modules;

use System\Libraries\Request;

//Request::load("Libraries/Spyc.php");

Request::load("Libraries/Module.php");

Request::load("Engines/Config.php");

use System\Engines;
use System\Libraries;

class index extends Module {

    private $response = array();
    private $conn;

    public function __construct(){

        $this->response = array(
            "response" => false
        );

        $this->conn = new Engines\MySQL;

        $this->conn->connect(array(
            "host" => __MySQL_HOST__,
            "database" => __MySQL_DB__,
            "user" => __MySQL_USER__,
            "password" => __MySQL_PASS__
        ));

        $this->conn->character("utf8");

    }

    public function index(){



    }

    public function isUser(){

        if(
            $this->conn->table("/users")->in(array(
                "/username" => Request::post("username")
            )) ||
            $this->conn->table("users")->in(array(
                "email" => Request::post("email")
            ))
        ){

            $this->response["response"] = true;

        }

        Libraries\Response::json($this->response);

    }

    public function setLogin(){

        if(
            $this->conn->table("/users")->in(array(
                "/username" => Request::post("username"),
                "/password" => Libraries\Session::password(Request::post("password"))
            )) ||
            $this->conn->table("users")->in(array(
                "email" => Request::post("email"),
                "password" => Libraries\Session::password(Request::post("password"))
            ))
        ){

            $this->response["response"] = true;

            $User = $this->conn->select('/users:*/username:=:'.Request::post("username").'||email:=:'.Request::post("email").';&;password:=:'.Libraries\Session::password(Request::post("password")));

            $User->execute();

            $fetchUser = $User->fetch(Engines\MySQL::FETCH_OBJ);

            $UserSession = array(
                "login" => array(
                    "set" => true,
                    "username" => Request::post("username"),
                    "password" => Libraries\Session::password(Request::post("password"))
                )
            );

            Libraries\Session::set($UserSession);

        }

        Libraries\Response::json($this->response);

    }

    public function getUsers(){

        $getUsers = $this->conn->select("/users")->asc("/mode");

        $getUsers->execute();

        Libraries\Response::header("json");

        Libraries\Response::json($getUsers->fetchAll());

    }

} 