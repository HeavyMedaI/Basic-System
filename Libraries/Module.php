<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 19:04
 */

namespace System\Modules;

use \System\Engines;
use System\Libraries\Request;

abstract class Module {

    protected $data = array();

    protected function render(){

        return $this->data;

    }

    public function getSystemConfig($Path){

        Request::load("Engines/Config.php");

        $Config = new Engines\Config;

        return $Config->get("config.yml", $Path);

    }

    public function getAppConfig($Path){

        Request::load("Engines/Config.php");

        $Config = new Engines\Config;

        return $Config->get("Modules/".Request::get("app")."/config.yml", $Path);

    }

    public function getModuleConfig($Path){

        Request::load("Engines/Config.php");

        $Config = new Engines\Config;

        return $Config->get("Modules/".Request::get("app")."/".Request::get("module")."/config.yml", $Path);

    }

    public function snapshot($Path){

        require_once $Path;

    }

} 