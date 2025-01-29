const styles = [
                ["#ffdbc4", "#a0f5c7", "#7ff7b7"]
            ];
let listeners = [],
    lock = false;
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
function initialize(){
    for(let i = 0; i < 53; i++){
        listeners.push([]);
        for(let j = 0; j < 100; j++)
            listeners[i].push(null);
    }
    document.getElementById("spotify-tab-hyperlink").addEventListener("mouseover", () => {animate(0)});    
}
document.addEventListener("DOMContentLoaded", initialize);