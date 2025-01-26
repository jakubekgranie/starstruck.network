const styles = [
                ["#ffdbc4", "#cfecb0", "#a0f5c7"]
            ];
let listeners = [],
    lock = false;
function animate(styleID){
    document.getElementById("star").classList.add("star-color0-support");
    for(let i = 0; i < 53; i++)
        for(let j = 0; j < 100; j++){
            const element = document.getElementById(`unit-${i}-${j}`);
            if(typeof element !== "undefined" && element != null){
                element.style.animationDelay = `${0.005 * j + 0.005 * i}s`;
                element.classList.add("star-color0");
            }
        }
    document.getElementById("star").style.filter = `drop-shadow(0px 0px 0.25rem ${styles[0][0]})`;
    document.getElementById("star").style.textShadow = `0 0 0.75rem ${styles[0][2]}`;
    /*document.getElementById("star").style.filter = `drop-shadow(0px 0px 0.25rem ${styles[0][0]})`;
    document.getElementById("star").style.textShadow = `0 0 0.75rem ${styles[0][2]}`;
    for(let i = 0; i < 53; i++)
        for(let j = 0; j < 100; j++){
            const element = document.getElementById(`unit-${i}-${j}`);
            if(typeof element !== "undefined" && element != null)
                for(let k = 0; k < 3; k++){
                    const timeout = 2 * i + 2 * j + 25 * (k + 1 * k + 1);
                    setTimeout(() => {element.style.color = styles[styleID][k];}, timeout);
                }
        }*/
        
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