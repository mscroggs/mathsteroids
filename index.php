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
<br /><br />
<center>
<canvas id='mathsteroids' width='800' height='450'></canvas>
<div class='buttongroup'>
<div class='clickbutton' id='display_left'>&larr;</div>
<div class='clickbutton' id='display_up'>&uarr;</div>
<div class='clickbutton' id='display_fire'>&#x1F3F9;</div>
<div class='clickbutton' id='display_right'>&rarr;</div>
<div class='clickbutton' id='display_quit'>&#x274C;</div>
</div>
<div class='webad'>You can play this game online at <b>mscroggs.co.uk/mathsteroids</b></div>
</center>
<?php

echo("<script type='text/javascript'>
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
