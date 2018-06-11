/********************************/
/*                              */
/*         Mathsteroids         */
/*                              */
/********************************/
/* This code was written        */
/*           by Matthew Scroggs */
/*  mscroggs.co.uk/mathsteroids */
/********************************/


document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    process_key(keyName,true)
    button_styles()
});

function process_key(keyName, result){
    if(keyName == "q"){
        quitPressed=result;
    }
    //if(keyName == "ArrowUp" || keyName == "w"){
    if(keyName == "w"){
        upPressed=result;
    }
    //if(keyName == "ArrowLeft" || keyName == "a"){
    if(keyName == "a"){
        leftPressed=result;
    }
    //if(keyName == "ArrowRight" || keyName == "d"){
    if(keyName == "d"){
        rightPressed=result;
    }
    //if(keyName == " " || keyName == "ArrowDown" || keyName == "s" || keyName == "k"){
    if(keyName == "k"){
        firePressed=result;
    }
}

document.addEventListener('mouseup', (event) => {
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

document.getElementById("display_up").addEventListener('touchmove', (event) => {
    event.preventDefault()
});
document.getElementById("display_up").addEventListener('touchstart', (event) => {
    event.preventDefault()
    upPressed=true;
    button_styles()
});
document.getElementById("display_up").addEventListener('mousedown', (event) => {
    upPressed=true;
    mouse = "up"
    button_styles()
});
document.getElementById("display_up").addEventListener('touchend', (event) => {
    upPressed=false;
    button_styles()
});

document.getElementById("display_quit").addEventListener('touchmove', (event) => {
    event.preventDefault()
});
document.getElementById("display_quit").addEventListener('touchstart', (event) => {
    event.preventDefault()
    quitPressed=true;
    button_styles()
});
document.getElementById("display_quit").addEventListener('mousedown', (event) => {
    quitPressed=true;
    mouse = "quit"
    button_styles()
});
document.getElementById("display_quit").addEventListener('touchend', (event) => {
    quitPressed=false;
    button_styles()
});

document.getElementById("display_fire").addEventListener('touchmove', (event) => {
    event.preventDefault()
});
document.getElementById("display_fire").addEventListener('touchstart', (event) => {
    event.preventDefault()
    firePressed=true;
    button_styles()
});
document.getElementById("display_fire").addEventListener('mousedown', (event) => {
    firePressed=true;
    mouse = "fire"
    button_styles()
});
document.getElementById("display_fire").addEventListener('touchend', (event) => {
    firePressed=false;
    button_styles()
});

document.getElementById("display_left").addEventListener('touchmove', (event) => {
    event.preventDefault()
});
document.getElementById("display_left").addEventListener('touchstart', (event) => {
    event.preventDefault()
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

document.getElementById("display_right").addEventListener('touchmove', (event) => {
    event.preventDefault()
});
document.getElementById("display_right").addEventListener('touchstart', (event) => {
    event.preventDefault()
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
