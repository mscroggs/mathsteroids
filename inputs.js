/**********************************************/
/*                                            */
/*                Mathsteroids                */
/*                                            */
/*         Created by Matthew Scroggs         */
/*         mscroggs.co.uk/mathsteroids        */
/*      github.com/mscroggs/mathsteroids      */
/*                                            */
/* This code is licensed under an MIT license */
/**********************************************/

var muteDone = false

document.addEventListener('keydown', function(event){
    const currentCode = event.which || event.code;
    var currentKey = event.key;
    if (!currentKey) {
        currentKey = String.fromCharCode(currentCode);
    }
    const keyName = "" + currentKey
    process_key(keyName,true)
    button_styles()
});

document.addEventListener('keyup', function(event){
    const currentCode = event.which || event.code;
    var currentKey = event.key;
    if (!currentKey) {
        currentKey = String.fromCharCode(currentCode);
    }
    const keyName = "" + currentKey
    process_key(keyName,false)
    button_styles()
});

function process_key(keyName, result){
    if(keyName == "q" || keyName == "Q"){
        quitPressed=result;
    }
    if(keyName == "w" || keyName == "W"){
        upPressed=result;
    }
    if(keyName == "a" || keyName == "A"){
        leftPressed=result;
    }
    if(keyName == "d" || keyName == "D"){
        rightPressed=result;
    }
    if(keyName == "k" || keyName == "K"){
        firePressed=result;
    }
    if(game_config("sound")){
        if(keyName == "m" || keyName == "M"){
            mutePressed = result
            if (result) {
                if(!muteDone) {
                    toggle_mute()
                    muteDone = true
                }
            } else {
                muteDone = false
            }
        }
    }
}

function do_gamepad(){
    if(game_config("controller") == "none") {
        return
    }

    pads = navigator.getGamepads()
    if(game_config("debug")) {
        var html = ""
        if(!!pads){
            for (var j = 0; j < pads.length; j++){
                for(var i = 0; i < pads[j].buttons.length; i++){
                    html += i
                    html += " => "
                    if(pads[j].buttons[i].pressed){html += "YES"}else{html+="NO"}
                    html += "  "
                }
                for(var i = 0; i < pads[j].axes.length; i++){
                    html += i
                    html += " => " + pads[j].axes[i] + "  "
                }
                html += "<br />"
            }
        }
        document.getElementById("debug").innerHTML = html
    }
    if(game_config("controller") == "emf") {
        gp = navigator.getGamepads()[0];
        if(!gp){return}
        if(gp.buttons[0].pressed || gp.buttons[1].pressed || gp.buttons[2].pressed || gp.buttons[3].pressed) {
            firePressed = true
        } else {
            firePressed = false
        }
        if(gp.buttons[12].pressed || gp.axes[1] < -0.8){
            upPressed = true
        } else {
            upPressed = false
        }
        if(gp.axes[0] > 0.8){
            rightPressed = true
        } else {
            rightPressed = false
        }
        if(gp.axes[0] < -0.8){
            leftPressed = true
        } else {
            leftPressed = false
        }
    } else if(game_config("controller") == "playstation") {
        gp = navigator.getGamepads()[0];
        if(!gp){return}
        if(gp.buttons[3].pressed){ //gp.buttons[5].pressed || gp.buttons[4].pressed){
            firePressed = true
        } else {
            firePressed = false
        }
        if(gp.buttons[2].pressed){
            upPressed = true
        } else {
            upPressed = false
        }
        if(gp.buttons[8].pressed){
            selectPressed = true
        } else {
            selectPressed = false
            selectDone = false
        }
        if(gp.axes[0] == 1){
            rightPressed = true
        } else {
            rightPressed = false
        }
        if(gp.axes[0] == -1){
            leftPressed = true
        } else {
            leftPressed = false
        }
    } else if(game_config("controller") == "mega-drive") {
        gp = navigator.getGamepads()[0];
        if(!gp){return}
        if(gp.buttons[1].pressed || gp.buttons[2].pressed || gp.buttons[4].pressed){
            firePressed = true
        } else {
            firePressed = false
        }
        if(gp.axes[5] == -1){
            upPressed = true
        } else {
            upPressed = false
        }
        if(gp.axes[4] == 1){
            rightPressed = true
        } else {
            rightPressed = false
        }
        if(gp.axes[4] == -1){
            leftPressed = true
        } else {
            leftPressed = false
        }
    }
    button_styles()
}

if(game_config("controller") != "none") {
    setInterval(do_gamepad, 100)
}

document.addEventListener('mouseup', function(event){
    if(mouse=="up"){
        upPressed=false;
    }
    if(mouse=="quit"){
        quitPressed=false;
    }
    if(mouse=="fire"){
        firePressed=false;
    }
    if(mouse=="right"){
        rightPressed=false;
    }
    if(mouse=="left"){
        leftPressed=false;
    }
    if(mouse=="select"){
        selectPressed=false;
        selectDone=false;
    }
    if(mouse=="mute"){
        mutePressed=false;
    }
    button_styles()
});

if(game_config("show-control-buttons")){
document.getElementById("display_up").addEventListener('touchmove', function(event){
    event.preventDefault()
});
document.getElementById("display_up").addEventListener('touchstart', function(event){
    event.preventDefault()
    upPressed=true;
    button_styles()
});
document.getElementById("display_up").addEventListener('mousedown', function(event){
    upPressed=true;
    mouse = "up"
    button_styles()
});
document.getElementById("display_up").addEventListener('touchend', function(event){
    upPressed=false;
    button_styles()
});

document.getElementById("display_quit").addEventListener('touchmove', function(event){
    event.preventDefault()
});
document.getElementById("display_quit").addEventListener('touchstart', function(event){
    event.preventDefault()
    quitPressed=true;
    button_styles()
});
document.getElementById("display_quit").addEventListener('mousedown', function(event){
    quitPressed=true;
    mouse = "quit"
    button_styles()
});
document.getElementById("display_quit").addEventListener('touchend', function(event){
    quitPressed=false;
    button_styles()
});

document.getElementById("display_select").addEventListener('touchmove', function(event){
    event.preventDefault()
});
document.getElementById("display_select").addEventListener('touchstart', function(event){
    event.preventDefault()
    selectPressed=true;
    button_styles()
});
document.getElementById("display_select").addEventListener('mousedown', function(event){
    selectPressed=true;
    mouse = "select"
    button_styles()
});
document.getElementById("display_select").addEventListener('touchend', function(event){
    selectPressed=false;
    button_styles()
});

if(game_config("sound")){
    document.getElementById("display_mute").addEventListener('touchmove', function(event){
        event.preventDefault()
    });
    document.getElementById("display_mute").addEventListener('touchstart', function(event){
        event.preventDefault()
        mutePressed=true;
        toggle_mute();
        button_styles()
    });
    document.getElementById("display_mute").addEventListener('mousedown', function(event){
        mutePressed=true;
        toggle_mute();
        mouse = "mute"
        button_styles()
    });
    document.getElementById("display_mute").addEventListener('touchend', function(event){
        mutePressed=false;
        button_styles()
    });
}
document.getElementById("display_fire").addEventListener('touchmove', function(event){
    event.preventDefault()
});
document.getElementById("display_fire").addEventListener('touchstart', function(event){
    event.preventDefault()
    firePressed=true;
    button_styles()
});
document.getElementById("display_fire").addEventListener('mousedown', function(event){
    firePressed=true;
    mouse = "fire"
    button_styles()
});
document.getElementById("display_fire").addEventListener('touchend', function(event){
    firePressed=false;
    button_styles()
});

document.getElementById("display_left").addEventListener('touchmove', function(event){
    event.preventDefault()
});
document.getElementById("display_left").addEventListener('touchstart', function(event){
    event.preventDefault()
    leftPressed=true;
    button_styles()
});
document.getElementById("display_left").addEventListener('mousedown', function(event){
    leftPressed=true;
    mouse = "left"
    button_styles()
});
document.getElementById("display_left").addEventListener('touchend', function(event){
    leftPressed=false;
    button_styles()
});

document.getElementById("display_right").addEventListener('touchmove', function(event){
    event.preventDefault()
});
document.getElementById("display_right").addEventListener('touchstart', function(event){
    event.preventDefault()
    rightPressed=true;
    button_styles()
});
document.getElementById("display_right").addEventListener('mousedown', function(event){
    rightPressed=true;
    mouse = "right"
    button_styles()
});
document.getElementById("display_right").addEventListener('touchend', function(event){
    rightPressed=false;
    button_styles()
});
}
function button_styles(){
    if(game_config("show-control-buttons")){
        if(quitPressed){
            document.getElementById("display_quit").style.backgroundColor="red"
        } else {
            document.getElementById("display_quit").style.backgroundColor="white"
        }
        if(upPressed){
            document.getElementById("display_up").style.backgroundColor="red"
        } else {
            document.getElementById("display_up").style.backgroundColor="white"
        }
        if(firePressed){
            document.getElementById("display_fire").style.backgroundColor="red"
        } else {
            document.getElementById("display_fire").style.backgroundColor="white"
        }
        if(selectPressed){
            document.getElementById("display_select").style.backgroundColor="red"
        } else {
            document.getElementById("display_select").style.backgroundColor="white"
        }
        if(game_config("sound")){
            if(mutePressed){
                document.getElementById("display_mute").style.backgroundColor="red"
            } else {
                document.getElementById("display_mute").style.backgroundColor="white"
            }
        }
        if(leftPressed){
            document.getElementById("display_left").style.backgroundColor="red"
        } else {
            document.getElementById("display_left").style.backgroundColor="white"
        }
        if(rightPressed){
            document.getElementById("display_right").style.backgroundColor="red"
        } else {
            document.getElementById("display_right").style.backgroundColor="white"
        }
    }
}
