<?php

namespace System\Config;

class Config{

    public static $private = FALSE;

}

use System\Libraries\Request;

Request::load("Engines/FireWall.php");