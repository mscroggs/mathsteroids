/********************************/
/*                              */
/*         Mathsteroids         */
/*                              */
/********************************/
/* This code was written        */
/*           by Matthew Scroggs */
/*  mscroggs.co.uk/mathsteroids */
/********************************/


// inputs

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if(keyName == "q"){
        show_menu()
    }
    process_key(keyName,true)
    button_styles()
});

function process_key(keyName, result){
    if(keyName == "ArrowUp" || keyName == "w"){
        upPressed=result;
    }
    if(keyName == "ArrowLeft" || keyName == "a"){
        leftPressed=result;
    }
    if(keyName == "ArrowRight" || keyName == "d"){
        rightPressed=result;
    }
    if(keyName == " " || keyName == "ArrowDown" || keyName == "s" || keyName == "k"){
        firePressed=result;
    }
}

document.addEventListener('mouseup', (event) => {
    if(mouse=="up"){
        upPressed=false;
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

document.getElementById("display_up").addEventListener('touchstart', (event) => {
    upPressed=true;
    button_styles()
});
document.getElementById("display_up").addEventListener('mousedown', (event) => {
    upPressed=true;
    mouse = "up"
    button_styles()
});

document.getElementById("display_fire").addEventListener('touchstart', (event) => {
    firePressed=true;
    button_styles()
});
document.getElementById("display_fire").addEventListener('mousedown', (event) => {
    firePressed=true;
    mouse = "fire"
    button_styles()
});

document.getElementById("display_up").addEventListener('touchend', (event) => {
    upPressed=false;
    button_styles()
});

document.getElementById("display_left").addEventListener('touchstart', (event) => {
    leftPressed=true;
    button_styles()
});
document.getElementById("display_left").addEventListener('mousedown', (event) => {
    leftPressed=true;
    mouse = "left"
    button_styles()
});

document.getElementById("display_left").addEventListener('touchend', (event) => {
    leftPressed=false;
    button_styles()
});

document.getElementById("display_right").addEventListener('touchstart', (event) => {
    rightPressed=true;
    button_styles()
});
document.getElementById("display_right").addEventListener('mousedown', (event) => {
    rightPressed=true;
    mouse = "right"
    button_styles()
});

document.getElementById("display_right").addEventListener('touchend', (event) => {
    rightPressed=false;
    button_styles()
});

document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    process_key(keyName,false)
    button_styles()
});

function button_styles(){
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