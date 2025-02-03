const styles = [
    ["#ffdbc4", "#a0f5c7", "#7ff7b7"]
];

function animate() {
    document.getElementById("star").classList.add("star-color0-support");
    for (let i = 0; i < 53; i++)
        for (let j = 0; j < 100; j++) {
            const element = document.getElementById(`unit-${i}-${j}`);
            if (typeof element !== "undefined" && element != null) {
                element.style.animationDelay = `${0.005 * j + 0.005 * i}s`;
                setTimeout(() => element.style.color = styles[0][2], 5 * j + 5 * i);
                element.classList.add("star-color0");
            }
        }
    const star = document.getElementById("star");
    star.style.filter = `drop-shadow(0px 0px 0.25rem ${styles[0][0]})`;
    star.style.textShadow = `0 0 0.75rem ${styles[0][1]}`;
}

function animateName() {
    let name = "starstruck",
        letterIndex = -1;
    const feed = document.getElementById("name-header-feed"),
        fragment = document.createDocumentFragment();
    for (let i = 0; i < name.length; i++) {
        const element = document.createElement("span");
        element.innerHTML = String.fromCharCode(Math.floor(Math.random() * 62) + 65);
        element.classList.add("name-header-random");
        fragment.appendChild(element);
    }
    feed.appendChild(fragment);
    const interval = setInterval(() => {
        const letter = document.querySelector(".name-header-random");
        letter.innerHTML = name[++letterIndex];
        letter.classList.remove("name-header-random");
        if (letterIndex % 2 == 1) {
            const lettersToRandomize = document.querySelectorAll(".name-header-random");
            for (let i = 0; i < lettersToRandomize.length; i++)
                lettersToRandomize[i].innerHTML = String.fromCharCode(Math.floor(Math.random() * 62) + 65);
        }
        if (letterIndex == name.length - 1) {
            clearInterval(interval);
            document.getElementById("name-header-underscore").classList.add("blink-forever");
        }
    }, 40);
}

function initialize() {
    animate();
    animateName();
}
document.addEventListener("DOMContentLoaded", initialize);