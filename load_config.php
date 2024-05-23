<?php

$config_defaults = Array(
    "high-scores" => false,
    "controller" => "none",
    "game-mode" => "lives",
    "pre-html" => "",
    "centered" => false,
    "show-webad" => false,
    "show-instructions" => true,
    "show-control-buttons" => true,
    "debug" => false,
    "sound" => false,
    "sound-dir" => "sounds/default",
);
$game_config = Array();

function game_config($id) {
    global $game_config;
    global $config_defaults;
    foreach($config_defaults as $i=>$j) {
        if($id == $i) {
            if(isset($game_config[$id])){
                return $game_config[$id];
            } else {
                return $j;
            }
        }
    }
    return false;
}


function load_config($file){
    global $game_config;
    if(file_exists($file)){
        foreach(json_decode(file_get_contents($file), true) as $i=>$j){
            $game_config[$i] = $j;
        }
    }
}

function to_js($value){
    if($value === true) {
        return "true";
    }
    if($value === false) {
        return "false";
    }
    return "\"".$value."\"";
}

function write_js_config(){
    global $config_defaults;
    echo("function game_config(id) {");
    foreach($config_defaults as $i=>$j){
        echo("
        if(id==\"".$i."\"){
            return ".to_js(game_config($i))."
        }");
    }
    echo("
        return false;
    }
    ");
}

?>
