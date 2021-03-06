/********************************/
/*                              */
/*         Mathsteroids         */
/*                              */
/********************************/
/* This code was written        */
/*           by Matthew Scroggs */
/*  mscroggs.co.uk/mathsteroids */
/********************************/


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
    button_styles()
});

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

function button_styles(){
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
