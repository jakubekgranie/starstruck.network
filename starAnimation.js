const styles = [
                ["#ffdbc4", "#a0f5c7", "#7ff7b7"]
            ];
let lock = false;

function animate(){
    document.getElementById("star").classList.add("star-color0-support");
    for(let i = 0; i < 53; i++)
        for(let j = 0; j < 100; j++){
            const element = document.getElementById(`unit-${i}-${j}`);
            if(typeof element !== "undefined" && element != null){
                element.style.animationDelay = `${0.005 * j + 0.005 * i}s`;
                setTimeout(() => element.style.color = styles[0][2], 5 * j + 5 * i);
                element.classList.add("star-color0");
            }
        }
    const star = document.getElementById("star");
    star.style.filter = `drop-shadow(0px 0px 0.25rem ${styles[0][0]})`;
    star.style.textShadow = `0 0 0.75rem ${styles[0][1]}`;
}

function animateName(){
    let name = "starstruck",
        limit = 0,
        randomOutput;
    const interval = setInterval(() => {
        if(++limit % 2 == 1){
            randomOutput = "";
            for(let i = 0; i < name.length; i++)
                randomOutput += String.fromCharCode(Math.floor(Math.random() * 62) + 65);
        }
        document.getElementById("name-header-feed").innerHTML = name.substring(0, limit) + randomOutput.substring(limit, randomOutput.length);
        if(limit == name.length) {
            clearInterval(interval);
            document.getElementById("name-header-underscore").classList.add("blink-forever");
        }
    }, 40);
}

function initialize(){
    document.getElementById("spotify-tab-hyperlink").addEventListener("mouseover", () => {animate()});
    animateName();
}
document.addEventListener("DOMContentLoaded", initialize);