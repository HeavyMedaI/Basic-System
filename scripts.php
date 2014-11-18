<?php
/**
 * Created by PhpStorm.
 * User: musaatalay
 * Date: 25.10.2014
 * Time: 23:22
 */

if (!function_exists('spyc_load')) {
    /**
     * Parses YAML to array.
     * @param string $string YAML string.
     * @return array
     */
    function spyc_load ($string) {
        return Spyc::YAMLLoadString($string);
    }
}

if (!function_exists('spyc_load_file')) {
    /**
     * Parses YAML to array.
     * @param string $file Path to YAML file.
     * @return array
     */
    function spyc_load_file ($file) {
        return Spyc::YAMLLoad($file);
    }
}

if (!function_exists('spyc_dump')) {
    /**
     * Dumps array to YAML.
     * @param array $data Array.
     * @return string
     */
    function spyc_dump ($data) {
        return Spyc::YAMLDump($data, false, false, true);
    }
}

function array_depth(Array $array) {
    $max_depth = 1;

    foreach ($array as $value) {
        if (is_array($value)) {
            $depth = array_depth($value) + 1;

            if ($depth > $max_depth) {
                $max_depth = $depth;
            }
        }
    }

    return $max_depth;
}

?>