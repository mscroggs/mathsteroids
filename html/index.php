<html>
<head>
<title>Mathsteroids</title>
<style type='text/css'>
    .clickbutton {border:2px solid green;display:inline-block;margin:2px;background-color:white}
    .buttongroup {text-align:center;background-color:#CCCCCC;display:inline-block}
@media (min-width:1000px){
    .clickbutton {width:80px;height:80px;line-height:80px;font-size:50px}
    .buttongroup {width:264px;height:176px}
}
@media (max-width:1000px){
    .clickbutton {width:20%}
    .buttongroup {width:100%;height:216px}
}
</style>
</head>
<body>

<canvas id='mathsteroids' width='800' height='450'></canvas>
<div class='buttongroup'><div class='clickbutton' id='display_up'>&uarr;</div><br /><div class='clickbutton' id='display_left'>&larr;</div><div class='clickbutton' id='display_fire'>&uArr;</div><div class='clickbutton' id='display_right'>&rarr;</div></div>
<?php

echo("<script type='text/javascript'>
var font_data = ".file_get_contents("font.json")."
var VERSION = ".file_get_contents("../VERSION")."
</script>");

?>
<script type='text/javascript' src='mathsteroids.js'></script>
</body>
</html>
