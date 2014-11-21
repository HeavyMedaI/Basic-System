<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 14:48
 */

namespace System\Engines;


class MySQL {

    const SELECT    = 1;
    const INSERT    = 2;
    const UPDATE    = 3;
    const DELETE    = 4;
    const WHERE     = 5;

    const FETCH_LAZY = 1;
    const FETCH_ASSOC    = 2;
    const FETCH_NUM    = 3;
    const FETCH_BOTH = 4;
    const FETCH_OBJ    = 5;

    private $Conn;
    private $Status = true;
    private $ErrorHandler;
    /*
    private $Err;
    private $Error;
    private $ErrNo;
    private $ErrInfo;
    private $ErrorMessage;
    */

    public function __construct(){

        return $this;

    }

    public function connect(Array $Config = null){

        $mysql_server = (@$Config["host"]) ? $Config["host"] : __MySQL_HOST__;
        $mysql_user = (@$Config["user"]) ? $Config["user"] : __MySQL_USER__;
        $mysql_password = (@$Config["pass"]) ? $Config["pass"] : __MySQL_PASS__;
        $mysql_database = (@$Config["db"]) ? $Config["db"] : __MySQL_DB__;

        try{

            $this->Conn = new \PDO("mysql:host={$mysql_server};dbname={$mysql_database}", $mysql_user, $mysql_password);

        }catch (\PDOException $Error){

            $this->Status = false;

            $this->ErrorHandler = new MySQLErrorHandler($Error);

            //$this->ErrorHandler($Error);

        }

        return $this;

    }

    /**
     * @param $CharSet: MySQL Connection´s OutPut Character Coding ex: utf8
     */
    public function character($CharSet){

        $this->Conn->exec("set names {$CharSet}");

    }

    public function query($QueryStatement, $FETCH = \PDO::FETCH_ASSOC){

        return $this->Conn->query($QueryStatement, $FETCH);

    }

    public function table($Path){

        return new Table($this->Conn, ltrim($Path, "[/\#\$\:]"));

    }

    public function select($Path){

        return new Select($this->Conn, $Path);

    }

    public function insert($Path){

        return new Insert($this->Conn, $Path);

    }

    public function update($Path){

        return new Update($this->Conn, $Path);

    }

    public function delete($Path){

        return new Delete($this->Conn, $Path);

    }

    public function switcher($Path){

        return new Switcher($this->Conn, $Path);

    }

    /*private function ErrorHandler(\PDOException $Error){

        $this->Status = false;

        $this->Err = $Error;

        $this->ErrNo = $Error->getCode();

        $this->Error = $Error->getMessage();

        $this->ErrInfo = $Error->errorInfo;

        $this->ErrorMessage = "{$Error->getCode()} : {$Error->getMessage()} in {$Error->getFile()} on line: {$Error->getLine()}";

    }*/

    public function Status($Obj = null){

        return $this->Status;

    }

    public function ErrorHandler($Obj = null){

        return $this->ErrorHandler;

    }

}

class SqlMaker{

    private $Path;
    private $QueryType;
    private $LastSqlSet = array();
    private $Keywords = array();
    private $LastQueryString;
    private $Blocks;
    private $Set = false;

    /**
     * @param $Path
     * @param $Type
     */
    public function __construct($Path, $Type){

        $this->LastQueryString = ltrim($Path, "[/\#\$\:]");

        $this->Path = ltrim($Path, "[/\#\$\:]");

        $this->QueryType = $Type;

        $this->Keywords = array(
            "&" => " AND ",
            "&&" => " AND ",
            "|" => " OR ",
            "||" => " OR ",
            "<<" => " < ",
            ">>" => " > "
        );

        $this->Blocks = array("{","(","[","]",")","}");

        $this->LastSqlSet["QueryString"] = null;

        $this->LastSqlSet["QueryValues"] = array();

        if(is_string($this->Path)){

            return $this->StringSet();

        }else if(is_array($this->Path)){

            return $this->ArraySet();

        }

    }

    public function add($Path, $Type = null, $Set = false){

        if($Type!=null){ $this->QueryType = $Type; }

        if($this->QueryType == 2){

            if(is_string($this->Path)){

                $this->Path .= "/".ltrim($Path, "[/\#\$\:]");

                return $this->StringSet();

            }else if(is_array($Path)){

                $this->Path = array_merge($this->Path, $Path);

                return $this->ArraySet();

            }

        }

        if($this->QueryType == 3){

            if(is_string($this->Path)){

                $this->Path .= "/".ltrim($Path, "[/\#\$\:]");

                return $this->StringSet();

            }else if(is_array($Path)){

                $this->Path = array_merge($this->Path, $Path);

                return $this->ArraySet();

            }

        }

        if($this->QueryType == 5){

            $this->Path = null;

        }

        $this->LastQueryString = ltrim($Path, "[/\#\$\:]");

        preg_match("/^;(&|&&|\||\|\|);(.*)$/i", ltrim($Path, "[/\#\$\:]"), $Split);

        $Mark = "/";

        if($this->Set&&$Set==false){

            if(count($Split)>=1){

                $Mark = ";{$Split[1]};";

            }else{

                $Mark = ";&&;";

            }

        }

        $RunableString = preg_replace("/^;(&|&&|\||\|\|);/i", null, ltrim($Path, "[/\#\$\:]"));

        $this->Path .= "{$Mark}{$RunableString}";

        return $this->StringSet();

    }

    private  function StringSet($Path = null, $Set = false){

        $this->LastSqlSet["QueryString"] = null;

        $this->LastSqlSet["QueryValues"] = array();

        if($Path!=null){

           $this->Path = $Path;

        }

        $Table = null;

        $Columns = null;

        $Blocks = null;

        $Values = null;

        if($this->QueryType==1){

            $Values = array();

            $Path = explode("/", ltrim($this->Path, "[/\#\$\:]"));

            if(count($Path)>=2){

                $this->Set = true;

            }

            $Blocks .= "( ";

            $From = explode(":", $Path[0]);

            $Table = $From[0];

            $Columns = (@$From[1]) ? $From[1]." " : "* ";

            $this->LastSqlSet["QueryString"] .= "SELECT ".$Columns;

            $this->LastSqlSet["QueryString"] .=  "FROM ".$From[0]." ";

            if(((count($Path)==1||!isset($Path[1]))||(empty($Path[1])||strlen($Path[1])<=0))&&$Set==false){

                return $this;

            }

            array_shift($Path);

            $Path[1] = implode("/", $Path);

            #$PregSplitPattern = "/;([&]|[\|]);/i";

            $String = preg_split("/;/i", $Path[1]);

            for($i=0;$i<count($String);$i++){

                if($i%2<=0){

                    $Blocks .= "( ";

                    $BlockSet = false;

                    if(in_array(substr($String[$i], 0, 1), $this->Blocks)){

                        $BlockSet = true;

                        $Blocks .= "( ";

                        $String[$i] = substr($String[$i], 1, (strlen($String[$i])-2));

                    }

                    $Ands = preg_split("/&&/i", $String[$i]);

                    $BlockAnd = null;

                    foreach($Ands as $And){

                        if(strpos($And, "||")){

                            $Ors = preg_split("/\|\|/i", $And);

                            $BlockOr = null;

                            foreach ($Ors as $Or) {

                                $Where = $this->ColAndVal($Or, "string");

                                $BlockOr .= $Where["string"]." OR ";

                                $Values = array_merge($Values, $Where["value"]);

                            }

                            $BlockAnd .= rtrim($BlockOr, " OR ")." ";

                        }else{

                            $Where = $this->ColAndVal($And, "string");

                            $BlockAnd .= $Where["string"]." AND ";

                            $Values = array_merge($Values, $Where["value"]);

                        }

                    }

                    $Blocks .= rtrim($BlockAnd, " AND ")." ";

                    $Blocks .= ") ";

                    /*
                     * Don´t remove this is for blockset probabilites
                     *
                     * if(in_array(substr($String[$i], -1, 1), $this->Blocks)){

                        $Blocks .= ") ";

                    }
                    */
                    if($BlockSet){

                        $Blocks .= ") ";

                    }

                }else{

                    $Blocks .= $this->Keywords[$String[$i]]." ";

                }

            }

            $Blocks .= ") ";

            $WHERE = null;

            if(strpos($this->LastSqlSet["QueryString"], "WHERE")){

                $WHERE = "AND ".$Blocks;

            }else{

                $WHERE = "WHERE ".$Blocks;

            }

            $this->LastSqlSet["QueryString"] .= $WHERE;

            $this->LastSqlSet["QueryValues"] = array_merge($this->LastSqlSet["QueryValues"], $Values);

        }

        if($this->QueryType==2){

            $Path = explode("/", ltrim($this->Path, "[/\#\$\:]"));

            $Target = $Path[0];

            $this->LastSqlSet["QueryString"] .= "INSERT INTO ".$Target." ";

            if((count($Path)==1||!isset($Path[1]))||(empty($Path[1])||strlen($Path[1])<=0)){

                return $this;

            }

            array_shift($Path);

            $Path[1] = implode("/", $Path);

            $Packages = explode(";;", ltrim($Path[1], ";;"));

            foreach($Packages as $Package){

                if($Package == null || empty($Package)){

                    continue;

                }

                $Set = explode("::", $Package);

                $Columns .= "`{$Set[0]}`, ";

                $Values .= ":{$Set[0]},";

                $this->LastSqlSet["QueryValues"][":".$Set[0]] = $Set[1];

            }

            $Columns = rtrim($Columns, ", ");

            $Values = rtrim($Values, ", ");

            $this->LastSqlSet["QueryString"] .= "({$Columns}) VALUES ({$Values})";

        }

        if($this->QueryType==3){

            $Path = explode("/", ltrim($this->Path, "[/\#\$\:]"));

            #$this->Path = null;

            $Target = $Path[0];

            $this->LastSqlSet["QueryString"] = "UPDATE ".$Target." SET ";

            if(((count($Path)==1||!isset($Path[1]))||(empty($Path[1])||strlen($Path[1])<=0))&&$Set==false){

                return $this;

            }

            array_shift($Path);

            $Path[1] = implode("/", $Path);

            #$Packages = explode(";;", ltrim($Path[1], ";;"));
            $Packages = preg_split("/\;\;/", ltrim($Path[1], ";;"));

            foreach ($Packages as $Package) {

                #$Set = explode("::", $Package);
                 $Set = preg_split("/\:\:/", $Package);

                $VarKey = substr(md5(date("Y-m-d-H-i-s-").microtime().":".rand(9, 99999)), 3, 9);

                $Columns .= "`{$Set[0]}` = :{$Set[0]}_$VarKey, ";

                $this->LastSqlSet["QueryValues"][":{$Set[0]}_{$VarKey}"] = $Set[1];

            }

            $this->LastSqlSet["QueryString"] .= rtrim($Columns, ", ")." ";

        }

        if($this->QueryType==4){

            $Path = explode("/", ltrim($this->Path, "[/\#\$\:]"));

            $this->Path = null;

            $Target = $Path[0];

            $this->LastSqlSet["QueryString"] = "DELETE FROM ".$Target." ";

        }

        if($this->QueryType==5){

            //exit(var_dump($this->Path));

            $Values = array();

            $Path = explode("/", ltrim($this->Path, "[/\#\$\:]"));

            $this->Set = true;

            $Blocks .= "( ";

            $String = preg_split("/;/i", $Path[0]);

            for($i=0;$i<count($String);$i++){

                if($i%2<=0){

                    $Blocks .= "( ";

                    $BlockSet = false;

                    if(in_array(substr($String[$i], 0, 1), $this->Blocks)){

                        $BlockSet = true;

                        $Blocks .= "( ";

                        $String[$i] = substr($String[$i], 1, (strlen($String[$i])-2));

                    }

                    $Ands = preg_split("/&&/i", $String[$i]);

                    $BlockAnd = null;

                    foreach($Ands as $And){

                        if(strpos($And, "||")){

                            $Ors = preg_split("/\|\|/i", $And);

                            $BlockOr = null;

                            foreach ($Ors as $Or) {

                                $Where = $this->ColAndVal($Or, "string");

                                $BlockOr .= $Where["string"]." OR ";

                                $Values = array_merge($Values, $Where["value"]);

                            }

                            $BlockAnd .= rtrim($BlockOr, " OR ")." ";

                        }else{

                            $Where = $this->ColAndVal($And, "string");

                            $BlockAnd .= $Where["string"]." AND ";

                            $Values = array_merge($Values, $Where["value"]);

                        }

                    }

                    $Blocks .= rtrim($BlockAnd, " AND ")." ";

                    $Blocks .= ") ";

                    /*
                     * Don´t remove this is for blockset probabilites
                     *
                     * if(in_array(substr($String[$i], -1, 1), $this->Blocks)){

                        $Blocks .= ") ";

                    }
                    */
                    if($BlockSet){

                        $Blocks .= ") ";

                    }

                }else{

                    $Blocks .= @$this->Keywords[$String[$i]]." ";

                }

            }

            $Blocks .= ") ";

            $WHERE = null;

            if(strpos($this->LastSqlSet["QueryString"], "WHERE")){

                $WHERE = "AND ".$Blocks;

            }else{

                $WHERE = "WHERE ".$Blocks;

            }

            $this->LastSqlSet["QueryString"] .= $WHERE;

            $this->LastSqlSet["QueryValues"] = array_merge($this->LastSqlSet["QueryValues"], $Values);

        }

        //$this->LastSqlSet["QueryString"] = "SELECT {$Columns} FROM `{$Table}` WHERE ".$Blocks;

        return $this;

    }

    private function ArraySet($Path = null, $Set = true){

        if($this->QueryType==1){   # Array Type



        }

        if($this->QueryType==2){ #   Insert Query



        }

    }

    private function ColAndVal($Data, $Type){

        $Return = array();

        if($Type=="string"){

            $VarKey = substr(md5(date("Y-m-d-H-i-s-").microtime().":".rand(9, 99999)), 3, 9);

            preg_match("/:(.*):/i", $Data, $Split);

            $Parse = explode($Split[0], $Data);

            $Return["string"] = "`{$Parse[0]}` {$Split[1]} :".$Parse[0]."_".$VarKey;

            $Return["value"] = array(":{$Parse[0]}_{$VarKey}" => $Parse[1]);

            return $Return;

        }

    }

    public function SqlSet(){

        return $this->LastSqlSet;

    }

    /*private function String(){

        $Path = explode("/", ltrim($this->Path, "[/\#\$\:]"));

        $Command = (strpos(strtolower($Path[0]), "select")) ? explode(":", $Path[0]) : array($Path[0]);

        $this->LastQuery .= strtoupper($Command[0])." ";

        $Columns = null;

        if(strtolower($Command[0])=="select"){

            $Columns = ($Command[1]) ? $Command[1] : "* ";

        }

        $this->LastQuery .= $Columns


    }*/

}

class Table{

    private $Conn;
    private $Status = false;
    private $Table;
    private $LastPrepared;
    private $LastQuery;
    private $LastSql = array();
    private $ErrorHandler;

    public function __construct(\PDO $Connection, $Table){

        $this->Conn = $Connection;

        $this->Table = $Table;

    }

    public function in(Array $Path){

        $Select = "SELECT * FROM {$this->Table} WHERE ";

        $Where = null;

        $Values = array();

        foreach ($Path as $Column => $Value){

            $VAR = ltrim($Column, "[/\#\$\:]");

            $Where .= "`".$VAR."` = :".$VAR." AND ";

            $Values[":".$VAR] = $Value;

        }

        $Where = rtrim($Where, " AND ");

        $this->LastSql = array(
            "sql" => $Select.$Where,
            "values" => $Values
        );

        $this->LastQuery = $this->Conn->prepare($Select.$Where, array(\PDO::ATTR_CURSOR => \PDO::CURSOR_FWDONLY));

        $this->LastPrepared = $this->LastQuery;

        try{

            $this->LastQuery->execute($Values);

            if( $this->LastQuery->rowCount()>=1){

                $this->Status = true;

                return true;

            }else{

                $this->Status = false;

                return false;

            }

        }catch (\PDOException $Error){

            $this->ErrorHandler = new MySQLErrorHandler($Error);

            $this->Status = false;

            return false;

        }

        return $this;

    }

    public function LastQuery(){

        return $this->LastQuery;

    }

    public function LastSql(){

        return $this->LastSql;

    }

    public function LastPrepared(){

        return $this->LastPrepared;

    }

    public function Status($Obj = null){

        return $this->Status;

    }

    public function ErrorHandler($Obj = null){

        return $this->ErrorHandler;

    }

}

class Select{

    private $Conn;
    private $SqlMaker;
    private $Status;
    private $QueryString;
    private $QueryValues = array();
    private $LastSql = array();
    private $LastQuery;
    private $LastFetch;
    private $ErrorHandler;

    public function __construct(\PDO $Connection, $Path){

        $this->Conn = $Connection;

        $this->SqlMaker = new SqlMaker($Path, MySQL::SELECT);

        $this->QueryString = $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = $this->SqlMaker->SqlSet()["QueryValues"];

        return $this;

    }

    public function where($Path){

        $SqlMaker = $this->SqlMaker->add($Path);

        $this->SqlMaker = $SqlMaker;

        $this->QueryString = $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = $this->SqlMaker->SqlSet()["QueryValues"];

        return $this;

    }

    public function group($Path){

        $Path = "GROUP BY ".ltrim($Path, "[/\#\$\:]");

        $this->QueryString .= $Path." ";

        return $this;

    }

    public function order($Path){

        $Path = "ORDER BY ".ltrim($Path, "[/\#\$\:]");

        $this->QueryString .= $Path." ";

        return $this;

    }

    public function asc($Path){

        $Path = ltrim($Path, "[/\#\$\:]");

        if(preg_match_all("/(asc|ASC|desc|DESC)/i", $this->QueryString, $xxx)>=1){

            $this->QueryString = preg_replace("/(desc|DESC|asc|ASC)/i", "ASC", $this->QueryString);

            $this->QueryString = preg_replace("/(.*)ORDER BY (.*) ASC(.*)/", "$1ORDER BY ".$Path." ASC$3", $this->QueryString);

        }else{

            $this->QueryString .= "ORDER BY ".ltrim($Path, "[/\#\$\:]")." ASC ";

        }

        return $this;

    }

    public function desc($Path){

        $Path = ltrim($Path, "[/\#\$\:]");

        if(preg_match_all("/(asc|ASC|desc|DESC)/i", $this->QueryString, $xxx)>=1){

            $this->QueryString = preg_replace("/(desc|DESC|asc|ASC)/i", "DESC", $this->QueryString);

            $this->QueryString = preg_replace("/(.*)ORDER BY (.*) DESC(.*)/", "$1ORDER BY ".$Path." DESC$3", $this->QueryString);

        }else{

            $this->QueryString .= "ORDER BY ".ltrim($Path, "[/\#\$\:]")." DESC ";

        }

        return $this;

    }

    public function limit($Path){

        $Path = preg_split("/;|\//i", $Path);

        if(count($Path)>=3){

            return false;

        }

        $Path = "LIMIT ".implode(", ", $Path);;

        $this->QueryString .= $Path." ";

        return $this;

    }

    public function execute(Array $Settings = null, $ReturnFetch = false){

        $Settings["return"] = (@$Settings["return"]) ? @$Settings["return"] : MySQL::FETCH_OBJ;

        $Settings["fetch"] = (@$Settings["fetch"]) ? strtolower(@$Settings["fetch"]) : "all";

        try{

            $this->LastQuery = $this->Conn->prepare($this->QueryString, array(\PDO::ATTR_CURSOR => \PDO::CURSOR_FWDONLY));

            $this->LastQuery->execute($this->QueryValues);

            $Selected = $this->LastQuery;

            if($ReturnFetch){

                $this->LastFetch = ($Settings["fetch"]=="first") ? $this->LastQuery->fetch($Settings["return"]) : $this->LastQuery->fetchAll($Settings["return"]);

                return $this->LastFetch;

            }

            return new Selected($this->Conn, $Selected->fetchAll(MySQL::FETCH_OBJ));

        }catch (\PDOException $Error){

            $this->ErrorHandler = new MySQLErrorHandler($Error);

            $this->Status = false;

            return $this;

        }

        return $this;

    }

    public function fetch($FETCH_TYPE = null){

        if($FETCH_TYPE==null){

            $FETCH_TYPE = MySQL::FETCH_OBJ;

        }

        $this->LastQuery->execute($this->QueryValues);

        $this->LastFetch = $this->LastQuery->fetch($FETCH_TYPE);

        return $this->LastFetch;

    }

    public function fetchAll($FETCH_TYPE = null){

        if($FETCH_TYPE==null){

            $FETCH_TYPE = MySQL::FETCH_OBJ;

        }

        $this->LastQuery->execute($this->QueryValues);

        $this->LastFetch = $this->LastQuery->fetchAll($FETCH_TYPE);

        return $this->LastFetch;

    }

    public function Status($Obj = null){

        return $this->Status;

    }

    public function LastFetch($Obj = null){

        return $this->LastFetch;

    }

    public function QueryString($Obj = null){

        return $this->QueryString;

    }

    public function QueryValues($Obj = null){

        return $this->QueryValues;

    }

    public function ErrorHandler($Obj = null){

        return $this->ErrorHandler;

    }

}

class Selected{

    private $Conn;
    private $Source;
    private $Status = false;
    private $LastPrepared;
    private $LastQuery;
    private $LastSql = array();
    #private $SelectedRow;
    private $ErrorHandler;

    public function __construct(\PDO $Connection, Array $Source){

        $this->Conn = $Connection;

        $this->Source = $Source;

        return $this;

    }

    public function rowCount(){

        return count($this->Source);

    }

    public function row($Index){

        return $this->SelectedRow = new Row($this->Conn, $this->Source[$Index]);

    }

    public function merge($Data1, $Data2 = null){

        if((($Data1=="this"||$Data1===true)&&is_array($Data2))){

            $this->Source = array_merge($this->Source, $Data2);

        }else if((($Data2===null||$Data2===false)&&is_array($Data1))){

            $this->Source = array_merge($this->Source, $Data1);

        }else if((($Data2==="this"||$Data2===true)&&is_array($Data1))){

            $this->Source = array_merge($Data1, $this->Source);

        }

        return $this;

    }

    public function add($Data1, $Data2 = null){

        return $this->merge($Data1, $Data2);

    }

    public function get(){

        return $this->Source;

    }

}

class Row{

    private $Conn;
    private $Source;
    private $Status = false;
    private $LastPrepared;
    private $LastQuery;
    private $LastSql = array();
    private $SelectedCol;
    private $ErrorHandler;

    public function __construct(\PDO $Connection, $Source){

        $this->Conn = $Connection;

        $this->Source = $Source;

        return $this;

    }

    public function col($Names){

        $Path = preg_split("/;|\//i", $Names);

        $Cols = array();

        foreach ($this->Source as $Col => $Value) {

            if(in_array($Col, $Path)){

                if(is_numeric($Col)){

                    continue;

                }

                $Cols = array_merge($Cols, array($Col => $Value));

            }

        }

        return new Column($this->Conn, $Cols);

    }

    public function get(){

        return $this->Source;

    }

    public function dump(){

        var_dump($this->Source);

    }

}

class Column{

    private $Conn;
    private $Source;
    private $Status = false;
    private $LastPrepared;
    private $LastQuery;
    private $QueryString;
    private $QueryValues;
    private $LastSql = array();
    private $SqlMaker;
    private $ErrorHandler;

    public function __construct(\PDO $Connection, Array $Source){

        $this->Conn = $Connection;

        $this->Source = $Source;

        return $this;

    }

    public function select($Path){

        $Path = explode("/", ltrim($Path, "[/\#\$\:]"));

        $SelectedPath = $Path[0];

        if(strpos($Path[0], "{")>-1&&strpos($Path[0], "}")>-1){

            $Path[0] = str_replace(array("{","}"), null, $Path[0]);

            $Path[0] = trim($Path[0]);

            $Path[0] = explode(":", $Path[0]);

            $Path[0][0] = $this->Source[$Path[0][0]];

        }else{

            $Path[0] = explode(":", $Path[0]);

        }

        $Path[0][1] = (@$Path[0][1]) ? $Path[0][1] : "*";

        if(count($Path)>1){

            foreach ($this->Source as $Col => $Val) {

                //$Path[1] = preg_replace("/(.*):(.*):".$Col."(.*)/i", "$0 :: $1:$2:".$Val."$3", $Path[1]);

                $Path[1] = str_replace(":".$Col, ":".$Val, $Path[1]);

            }

        }

        $Path = $Path[0][0].":".$Path[0][1]."/".$Path[1];

        return new Select($this->Conn, $Path);

        /*$this->SqlMaker = new SqlMaker($Path, MySQL::SELECT);

        $this->QueryString = $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = $this->SqlMaker->SqlSet()["QueryValues"];

        return $this;*/

    }

    public function get(){

        return implode(" ", $this->Source);

    }

    public function dump(){

        var_dump($this->Source);

    }

    public function __toString(){

        return implode(" ", $this->Source);

    }

}

class Insert{

    private $Conn;
    private $SqlMaker;
    private $Status;
    private $QueryString;
    private $QueryValues = array();
    private $LastSql = array();
    private $LastQuery;
    #private $LastFetch;
    private $ErrorHandler;

    public function __construct(\PDO $Connection, $Path){

        $this->Conn = $Connection;

        $this->SqlMaker = new SqlMaker(ltrim($Path, "[/\#\$\:]"), MySQL::INSERT);

        $this->QueryString = $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = $this->SqlMaker->SqlSet()["QueryValues"];

        return $this;

    }

    public function data($Path){

        $this->SqlMaker->add($Path);

        $this->QueryString = $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = $this->SqlMaker->SqlSet()["QueryValues"];

        return $this;

    }

    /**
     * @param array $Settings
     * @param bool $ReturnFetch
     * @return $this|bool
     */
    public function execute(Array $Settings = null, $ReturnFetch = false){

        $Settings["return"] = (@$Settings["return"]) ? @$Settings["return"] : MySQL::FETCH_OBJ;

        $Settings["fetch"] = (@$Settings["fetch"]) ? strtolower(@$Settings["fetch"]) : "all";

        try{

            $this->LastQuery = $this->Conn->prepare($this->QueryString, array(\PDO::ATTR_CURSOR => \PDO::CURSOR_FWDONLY));

            $Execute = $this->LastQuery->execute($this->QueryValues);

            if($this->LastQuery->errorCode()!="00000"){

                throw new \PDOException;

            }

            return $Execute;

            /*$Selected = $this->LastQuery;

            if($ReturnFetch){

                $this->LastFetch = ($Settings["fetch"]=="first") ? $this->LastQuery->fetch($Settings["return"]) : $this->LastQuery->fetchAll($Settings["return"]);

                return $this->LastFetch;

            }

            return new Selected($this->Conn, $Selected->fetchAll(MySQL::FETCH_OBJ));*/

        }catch (\PDOException $Error){

            $this->ErrorHandler = new MySQLErrorHandler($Error);

            $this->Status = false;

            return $this;

        }

        return $this;

    }

    public function insertId($Object = null){

        return $this->Conn->lastInsertId(null);

    }

    public function Status($Obj = null){

        return $this->Status;

    }

    /*public function LastFetch($Obj = null){

        return $this->LastFetch;

    }*/

    public function QueryString($Obj = null){

        return $this->QueryString;

    }

    public function QueryValues($Obj = null){

        return $this->QueryValues;

    }

    public function ErrorHandler($Obj = null){

        return $this->ErrorHandler;

    }

}

class Update{

    private $Conn;
    private $SqlMaker;
    private $Status;
    private $QueryString;
    private $QueryValues = array();
    private $LastSql = array();
    private $LastQuery;
    #private $LastFetch;
    private $ErrorHandler;

    public function __construct(\PDO $Connection, $Path){

        $this->Conn = $Connection;

        $this->SqlMaker = new SqlMaker(ltrim($Path, "[/\#\$\:]"), MySQL::UPDATE);

        $this->QueryString = $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = $this->SqlMaker->SqlSet()["QueryValues"];

        return $this;

    }

    public function data($Path){

        $this->SqlMaker->add($Path, MySQL::UPDATE);

        $this->QueryString = $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = $this->SqlMaker->SqlSet()["QueryValues"];

        return $this;

    }

    public function where($Path){

        $this->SqlMaker->add($Path, MySQL::WHERE, true);

        $this->QueryString .= $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = array_merge($this->QueryValues, $this->SqlMaker->SqlSet()["QueryValues"]);

        return $this;

    }

    /**
     * @param array $Settings
     * @param bool $ReturnFetch
     * @return $this|bool
     */
    public function execute(Array $Settings = null, $ReturnFetch = false){

        $Settings["return"] = (@$Settings["return"]) ? @$Settings["return"] : MySQL::FETCH_OBJ;

        $Settings["fetch"] = (@$Settings["fetch"]) ? strtolower(@$Settings["fetch"]) : "all";

        try{

            $this->LastQuery = $this->Conn->prepare($this->QueryString, array(\PDO::ATTR_CURSOR => \PDO::CURSOR_FWDONLY));

            $Execute = $this->LastQuery->execute($this->QueryValues);

            if($this->LastQuery->errorCode()!="00000"){

                throw new \PDOException;

            }

            return $Execute;

            /*$Selected = $this->LastQuery;

            if($ReturnFetch){

                $this->LastFetch = ($Settings["fetch"]=="first") ? $this->LastQuery->fetch($Settings["return"]) : $this->LastQuery->fetchAll($Settings["return"]);

                return $this->LastFetch;

            }

            return new Selected($this->Conn, $Selected->fetchAll(MySQL::FETCH_OBJ));*/

        }catch (\PDOException $Error){

            $this->ErrorHandler = new MySQLErrorHandler($Error);

            $this->Status = false;

            return $this;

        }

        return $this;

    }

    public function insertId($Object = null){

        return $this->Conn->lastInsertId(null);

    }

    public function Status($Obj = null){

        return $this->Status;

    }

    /*public function LastFetch($Obj = null){

        return $this->LastFetch;

    }*/

    public function QueryString($Obj = null){

        return $this->QueryString;

    }

    public function QueryValues($Obj = null){

        return $this->QueryValues;

    }

    public function ErrorHandler($Obj = null){

        return $this->ErrorHandler;

    }

}

class Delete{

    private $Conn;
    private $SqlMaker;
    private $Status;
    private $QueryString;
    private $QueryValues = array();
    private $LastSql = array();
    private $LastQuery;
    #private $LastFetch;
    private $ErrorHandler;

    public function __construct(\PDO $Connection, $Path){

        $this->Conn = $Connection;

        $this->SqlMaker = new SqlMaker(ltrim($Path, "[/\#\$\:]"), MySQL::DELETE);

        $this->QueryString = $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = $this->SqlMaker->SqlSet()["QueryValues"];

        return $this;

    }

    public function where($Path){

        $this->SqlMaker->add($Path, MySQL::WHERE, true);

        $this->QueryString .= $this->SqlMaker->SqlSet()["QueryString"];

        $this->QueryValues = array_merge($this->QueryValues, $this->SqlMaker->SqlSet()["QueryValues"]);

        return $this;

    }

    /**
     * @param array $Settings
     * @param bool $ReturnFetch
     * @return $this|bool
     */
    public function execute(Array $Settings = null, $ReturnFetch = false){

        $Settings["return"] = (@$Settings["return"]) ? @$Settings["return"] : MySQL::FETCH_OBJ;

        $Settings["fetch"] = (@$Settings["fetch"]) ? strtolower(@$Settings["fetch"]) : "all";

        try{

            $this->LastQuery = $this->Conn->prepare($this->QueryString, array(\PDO::ATTR_CURSOR => \PDO::CURSOR_FWDONLY));

            $Execute = $this->LastQuery->execute($this->QueryValues);

            if($this->LastQuery->errorCode()!="00000"){

                throw new \PDOException;

            }

            return $Execute;

            /*$Selected = $this->LastQuery;

            if($ReturnFetch){

                $this->LastFetch = ($Settings["fetch"]=="first") ? $this->LastQuery->fetch($Settings["return"]) : $this->LastQuery->fetchAll($Settings["return"]);

                return $this->LastFetch;

            }

            return new Selected($this->Conn, $Selected->fetchAll(MySQL::FETCH_OBJ));*/

        }catch (\PDOException $Error){

            $this->ErrorHandler = new MySQLErrorHandler($Error);

            $this->Status = false;

            return $this;

        }

        return $this;

    }

    public function insertId($Object = null){

        return $this->Conn->lastInsertId(null);

    }

    public function Status($Obj = null){

        return $this->Status;

    }

    /*public function LastFetch($Obj = null){

        return $this->LastFetch;

    }*/

    public function QueryString($Obj = null){

        return $this->QueryString;

    }

    public function QueryValues($Obj = null){

        return $this->QueryValues;

    }

    public function ErrorHandler($Obj = null){

        return $this->ErrorHandler;

    }

}

class Switcher{

    private $Conn;
    private $Path;
    private $Poles;
    private $SqlMaker;
    private $Status;
    private $QueryString;
    private $QueryValues = array();
    private $LastSql = array();
    private $LastQuery;
    private $Target = array();
    private $OldQuery;
    private $OldSQL;
    private $NewQuery;
    private $NewSQL;
    private $SwitchTable;
    private $SwitchCol;
    private $ErrorHandler;

    public function __construct(\PDO $Connection, $Path) {

        $this->Target = array(
            "public" => null,
            "point" => null
        );

        $this->Conn = $Connection;

        $this->Path = ltrim($Path, "[/\#\$\:]");

        $ParsePath = explode("/", ltrim($Path, "[/\#\$\:]"));

        $this->SwitchTable = $ParsePath[0];

        $this->OldSQL = "/".$ParsePath[0];

        $this->NewSQL = "/".$ParsePath[0];

        if(count($ParsePath)==2){

            $this->Target["public"] = $ParsePath[1];

        }

        $this->Poles = array(
            0=>"0",
            1 =>"1"
        );

    }

    public function poles($Path){

        $this->Poles = preg_split("/(\||\/|\:|\;|\,)/i", $Path);

        $this->OldSQL = "/".$this->SwitchTable."/".$this->SwitchCol."::".$this->Poles[0];

        $this->NewSQL = "/".$this->SwitchTable."/".$this->SwitchCol."::".$this->Poles[1];

        return $this;

    }

    public function on($Path){

        $ParsePath = explode("/", ltrim($Path, "[/\#\$\:]"));

        $this->SwitchCol =  $ParsePath[0];

        $this->OldSQL = "/".$this->SwitchTable."/".$ParsePath[0]."::".$this->Poles[0];

        $this->NewSQL = "/".$this->SwitchTable."/".$ParsePath[0]."::".$this->Poles[1];

        if(count($ParsePath)==2){

            $this->Target["public"] = $ParsePath[1];

        }

        return $this;

    }

    public function to($Path){

        $this->Target["point"] = ltrim(($this->Target["public"]."&&".ltrim($Path, "[/\#\$\:]")), "[\&&\||]");

        return $this;

    }

    public function execute(Array $Settings = null, $ReturnFetch = false){

        $Execute = false;

        $Settings["return"] = (@$Settings["return"]) ? @$Settings["return"] : MySQL::FETCH_OBJ;

        $Settings["fetch"] = (@$Settings["fetch"]) ? strtolower(@$Settings["fetch"]) : "all";

        try{

            $this->OldQuery = (new Update($this->Conn, $this->OldSQL))->where($this->Target["public"])->execute();

            $Execute = true;

            if(!$this->OldQuery){

                $Execute = false;

                throw new \PDOException;

            }

            $this->NewQuery = (new Update($this->Conn, $this->NewSQL))->where($this->Target["point"])->execute();

            $Execute = true;

            if(!$this->NewQuery){

                $Execute = false;

                throw new \PDOException;

            }

            return $Execute;

        }catch (\PDOException $Error){

            $this->ErrorHandler = new MySQLErrorHandler($Error);

            $this->Status = false;

            return $this;

        }

        return $this;

    }

    public function Status($Obj = null){

        return $this->Status;

    }

    public function QueryString($Obj = null){

        return $this->QueryString;

    }

    public function QueryValues($Obj = null){

        return $this->QueryValues;

    }

    public function ErrorHandler($Obj = null){

        return $this->ErrorHandler;

    }

}

class MySQLErrorHandler{

    private $Err;
    private $Error;
    private $ErrNo;
    private $ErrInfo;
    private $ErrorMessage;

    public function __construct(\PDOException $Error){

        $this->Err = $Error;

        $this->ErrNo = $Error->getCode();

        $this->Error = $Error->getMessage();

        $this->ErrInfo = $Error->errorInfo;

        $this->ErrorMessage = "{$Error->getCode()} : {$Error->getMessage()} in {$Error->getFile()} on line: {$Error->getLine()}";

    }

    public function Err($Obj = null){

        return $this->Err;

    }

    public function Error($Obj = null){

        return $this->Error;

    }

    public function ErrNo($Obj = null){

        return $this->ErrNo;

    }

    public function ErrorInfo($Obj = null){

        return $this->ErrInfo;

    }

    public function ErrorMessage($Obj = null){

        return $this->ErrorMessage;

    }

}