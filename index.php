<html>
<head>
<title>Mathsteroids</title>
<style type='text/css'>
    .clickbutton {border:2px solid green;display:inline-block;margin:2px;background-color:white}
    .buttongroup {text-align:center;background-color:#CCCCCC;}

    .clickbutton {width:100px;height:100px;font-size:50px;line-height:100px}

    .clickbutton#display_left {float:left}
    .clickbutton#display_right {float:left}
    .clickbutton#display_up {float:right}
    .clickbutton#display_fire {float:right}

    .buttongroup {width:800px}

/*@media (min-width:1000px){
    .mathsteroids {width:800px}
    .buttongroup {width:800px}
}
@media (max-width:1000px){
    .mathsteroids {width:100%}
    .buttongroup {width:100%}
}*/
</style>
</head>
<body>

<canvas id='mathsteroids' width='800' height='450'></canvas>
<div class='buttongroup'>
<div class='clickbutton' id='display_left'>&larr;</div>
<div class='clickbutton' id='display_up'>&uarr;</div>
<div class='clickbutton' id='display_fire'>&#x1F52B;</div>
<div class='clickbutton' id='display_right'>&rarr;</div>
<div class='clickbutton' id='display_quit'>&#x274C;</div>
</div>

<div>
<h3>Controls</h3>
<table>
<tr><td>Turn left</td><td>&lt;left&gt;, A</td></tr>
<tr><td>Turn right</td><td>&lt;right&gt;, D</td></tr>
<tr><td>Move forwards</td><td>&lt;up&gt;, W</td></tr>
<tr><td>Fire</td><td>&lt;down&gt;, S, K</td></tr>
<tr><td>Return to menu</td><td>Q</td></tr>
</table>
</div>
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
