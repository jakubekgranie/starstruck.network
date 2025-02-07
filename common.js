let currentInterval = null,
    currentPreview = 0;

const styles = ["#ffdbc4", "#a0f5c7", "#7ff7b7"];

function animatedStar() {
    document.getElementById("star").classList.add("star-color0-support");
    for (let i = 0; i < 53; i++)
        for (let j = 0; j < 100; j++) {
            const element = document.getElementById(`unit-${i}-${j}`);
            if (typeof element !== "undefined" && element != null) {
                element.style.animationDelay = `${0.005 * j + 0.005 * i}s`;
                setTimeout(() => element.style.color = styles[2], 5 * j + 5 * i);
                element.classList.add("star-color0");
            }
        }
    const star = document.getElementById("star");
    star.style.filter = `drop-shadow(0px 0px 0.25rem ${styles[0]})`;
    star.style.textShadow = `0 0 0.75rem ${styles[1]}`;
}

function animatedName() {
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
    feed.innerHTML = "";
    feed.appendChild(fragment);
    const interval = setInterval(() => {
        const letter = document.querySelector(".name-header-random");
        letter.innerHTML = name[++letterIndex];
        letter.removeAttribute("class");
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

function animatedDescriptions() {
    const contents = [
        ["", "base", ["Hello, stargazer.", "Rest in pieces, peace of mind", "Make yourself at home.", "\"You only live once, but if you do it right, once is enough.\" ~ Mae West"], ["star", true], -1],
        ["/spotify", "lanyard2", ["What I'm currently listening to.", "Cool stuff.", "Click me if you dare.", "Either old tunes or oversaturated hyperpop."], ["spotify-tab-hyperlink", true], -1],
        ["/activities", "taskmgr", ["What I'm up to.", "Current time-burners.", "Try these sometime."], ["activity-tab", true], -1],
        ["/flavor", "@", ["This won't do.", "Try again.", "Focus on the task at hand.", "Focus.", "Not much to see here."], ["directory", true], -1],
        ["/about-me", "starstruck", ["Try searching me up.", "I recommend the GitHub.", "Hello.", "Does it ring a bell?", "Hey, that's me!"], ["about-me", true], -1],
        ["/socials", "socials", ["More of me, elsewhere.", "How about a game of Team Fortress 2?", "See more of my projects at my GitHub.", "For inquiries, contact me via Discord.", "By the way, these are my only socials."], ["social-icons", true], -1],
        ["/discord", "discordapp", ["My only Discord: <strong>jakubekgranie</strong>.<br>Please state the purpose of Your visit first; I might dismiss Your request otherwise."], ["discord", false], -1]
    ];
    for (let i = 0; i < contents.length; i++)
        document.getElementById(contents[i][3][0]).addEventListener((contents[i][3][1]) ? "mouseover" : "click", () => {
            if (currentPreview != i) {
                clearInterval(currentInterval);
                currentPreview = i;
                document.getElementById("directory-header").innerHTML = `/home${contents[i][0]}`;
                document.getElementById("directory-lesser-header").innerHTML = `${contents[i][1]}.desc():`;
                const feed = document.getElementById("directory-feed"),
                    random = document.getElementById("directory-random");
                feed.innerHTML = "";
                let letterIndex = -1,
                    randomDesc;
                do {
                    randomDesc = Math.floor(Math.random() * contents[i][2].length);
                } while (randomDesc == contents[i][4] && contents[i][4].length > 1)
                contents[i][4] = randomDesc;
                const desc = contents[i][2][randomDesc],
                    elements = [...desc.matchAll(/<.*>/gi)].map(match => [match.index, match[0]]);
                currentInterval = setInterval(() => {
                    if (++letterIndex == desc.length) {
                        clearInterval(currentInterval);
                        random.innerHTML = "";
                        return;
                    }
                    let elementDetected = false;
                    for (let i = 0; i < elements.length; i++)
                        if (letterIndex == elements[i][0]) {
                            feed.innerHTML += elements[i][1];
                            letterIndex += elements[i][1].length - 1;
                            elementDetected = true;
                            break;
                        }
                    random.innerHTML = String.fromCharCode(Math.floor(Math.random() * 62) + 65);
                    if (!elementDetected)
                        feed.innerHTML += desc[letterIndex];
                }, 20);
            }
        });
}

function initialize() {
    animatedStar(); // star gradient animation
    animatedName(); //
    animatedDescriptions();
}
document.addEventListener("DOMContentLoaded", initialize);