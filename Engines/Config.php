<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 23:25
 */

namespace System\Engines;

use \System\Libraries\Request;

Request::load("Libraries/Spyc.php");

class Config {

    private $Configrations;
    private $Private = FALSE;

    public function load($Config){

        $this->Configrations = \System\Libraries\Spyc::YAMLLoadString(\System\Libraries\Stream::read($Config));

        $this->config();

        return $this->Configrations;

    }

    private function config(){

         if(@$this->Configrations["config"]["status"]=="off"){

              return $this->lock();

         }

        if(@$this->Configrations["config"]["private"]){

            /*Request::login(Request::get("path"));

            return FALSE;*/

            //$this->Private = TRUE;

            $this->login();

        }

        if(isset($this->Configrations["load"])&&count($this->Configrations["load"])>=1){

            foreach($this->Configrations["load"] as $load){

                //Request::load($load);

                require_once $load;

            }

        }

        if(isset($this->Configrations["use"])&&count($this->Configrations["use"])>=1){

            foreach($this->Configrations["use"] AS $use){

                //use $use;

            }

        }

        return true;

    }

    private function login(){

        $FireWall = new FireWall();

        if(!$FireWall->isLogged()){

            Request::login(Request::get("path"));

            return false;

        }

        return true;

    }

    public function isPrivate(){

        return $this->Private;

    }

    private function lock(){

         exit;

    }

    public function get($Config, $Path){

        $Return = \System\Libraries\Spyc::YAMLLoadString(\System\Libraries\Stream::read($Config));

        $Path = explode("/", ltrim($Path, "[/\#\:]"));

        foreach ($Path as $loc) {

            $Return = $Return[$loc];

        }

        return $Return;


    }

} 