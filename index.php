<?php

include("load_config.php");

load_config("config.json");

?>
<html>
<head>
<title>Mathsteroids</title>
<style type='text/css'>
    .clickbutton {border:2px solid green;display:inline-block;margin:2px;background-color:white}
    .buttongroup {text-align:center;background-color:#CCCCCC;}

    .clickbutton {width:50px;height:50px;font-size:20px;line-height:50px}

    .clickbutton#display_left {float:left}
    .clickbutton#display_right {float:left}
    .clickbutton#display_up {float:right}
    .clickbutton#display_fire {float:right}

    .buttongroup {width:800px}
    .webad {font-family:monospace;margin-top:10px;font-size:22px}
</style>
</head>
<body>
<?php
echo(game_config("pre-html"));
if(game_config("centered")) {
    echo("<center>");
}
echo("<canvas id='mathsteroids' width='800' height='450'></canvas>");

if(game_config("show-control-buttons")){
echo("
<div class='buttongroup'>
<div class='clickbutton' id='display_left'>&larr;</div>
<div class='clickbutton' id='display_up'>&uarr;</div>
<div class='clickbutton' id='display_fire'>&#x1F3F9;</div>
<div class='clickbutton' id='display_right'>&rarr;</div>
<div class='clickbutton' id='display_quit'>&#x274C;</div>
<div class='clickbutton' id='display_select'>?</div>
");
if(game_config("sound")){
    echo("<div class='clickbutton' id='display_mute'>&#x1F509;</div>
");
}
echo("</div>
");
}
if(game_config("show-instructions")){
    echo("<div>
Mathsteroids is a game based on asteroids that can be played on a selection of interesting mathematical surfaces.
Destroy the asteroids to win points.
<h3>Controls</h3>
<table>
<tr><td>Turn left</td><td>A</td></tr>
<tr><td>Turn right</td><td>D</td></tr>
<tr><td>Move forwards</td><td>W</td></tr>
<tr><td>Fire</td><td>K</td></tr>
<tr><td>Return to menu</td><td>Q</td></tr>
");
if(game_config("sound")){
echo("<tr><td>Mute/unmute sound</td><td>M</td></tr>
");
}
echo("</table>
Alternatively, you can click the buttons above to turn/move/fire/quit.
</div>");
}
if(game_config("show-webad")){
    echo("<div class='webad'>You can play this game online at <b>mscroggs.co.uk/mathsteroids</b></div>");
}
if(game_config("debug")){
    echo("<div id='debug'></div>");
}
?>
<?php
if(game_config("centered")) {
    echo("</center>");
}

echo("<script type='text/javascript'>
");
write_js_config();
echo("
var font_data = ".file_get_contents("font.json")."
var VERSION = \"".explode("\n",file_get_contents("VERSION"))[0]."\"
var game_n_start = \"");
if(isset($_GET["game"])){
    echo($_GET["game"]);
}
echo("\"
</script>");

?>
<script type='text/javascript' src='mathsteroids.js'></script>
<script type='text/javascript' src='inputs.js'></script>
<script type='text/javascript' src='titlescreen.js'></script>
</body>
</html>
