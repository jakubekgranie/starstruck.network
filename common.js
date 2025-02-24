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
    feed.innerHTML = ""; // the name is pre-filled to handle noscript cases
    feed.appendChild(fragment);
    const interval = setInterval(() => {
        const letter = document.querySelector(".name-header-random");
        letter.innerHTML = name[++letterIndex];
        letter.removeAttribute("class"); // looks better than a stray attribute
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

/*
    contents[]:
        0 => the suffix (the base one is /home);
        1 => the description title;
        2 => possible descriptions;
        3 =>
            3.1 => the target id
            3.2 => override mouseover with click
        4 => last description used
        5 => lingering time
*/
const contents = [
    ["", "base", ["Hello, stargazer.", "Rest in pieces, peace of mind", "Make yourself at home.", "\"You only live once, but if you do it right, once is enough.\" ~ Mae West"], ["star", true], -1, 0],
    ["/spotify", "lanyard2", ["What I'm currently listening to.", "Cool stuff.", "Click me if you dare.", "Either old tunes or oversaturated hyperpop."], ["spotify-tab-hyperlink", true], -1, 0],
    ["/activities", "taskmgr", ["What I'm up to.", "Current time-burners.", "Try these sometime."], ["activity-tab", true], -1, 0],
    ["/flavor", "@", ["This won't do.", "Try again.", "Focus on the task at hand.", "Focus.", "Not much to see here."], ["directory", true], -1, 0],
    ["/about-me", "starstruck", ["Try searching me up.", "I recommend the GitHub.", "Hello.", "Does it ring a bell?", "Hey, that's me!"], ["about-me", true], -1, 0],
    ["/socials", "socials", ["More of me, elsewhere.", "How about a game of Team Fortress 2?", "See more of my projects at my GitHub.", "For inquiries, contact me via Discord.", "By the way, these are my only socials."], ["social-icons", true], -1, 0],
    ["/discord", "discordapp", ["My only Discord: <strong>jakubekgranie</strong>.<br>Please state the purpose of Your visit first; I might dismiss Your request otherwise."], ["discord", false], -1, 5000],
    ["/projects", "repos", ["The best fruits of the loom.", "Handpicked stuff from my GitHub.", "Check out what I've been working on!"], ["project-button-support", true], -1, 0]
];
let lock = false, // used for lingering
    currentInterval = null, // for optimized timed recursion
    currentPreview = -1; // prevents constant same-element regenerating

function animatedDescriptions() {
    for (let i = 0; i < contents.length; i++)
        document.getElementById(contents[i][3][0]).addEventListener((contents[i][3][1]) ? "mouseover" : "click", () => {
            if (currentPreview != i && !lock) {
                clearInterval(currentInterval);
                currentPreview = i;
                document.getElementById("directory-header").innerHTML = `/home${contents[i][0]}`;
                document.getElementById("directory-lesser-header").innerHTML = `${contents[i][1]}.desc(${((contents[i][5]) ? `lock = ${contents[i][5] / 1000}s` : ``)}):`;
                const feed = document.getElementById("directory-feed"),
                    random = document.getElementById("directory-random");
                feed.innerHTML = "";
                let letterIndex = -1,
                    currentFormatting = null,
                    randomDesc;
                do {
                    randomDesc = Math.floor(Math.random() * contents[i][2].length);
                } while (randomDesc == contents[i][4] && contents[i][2].length > 1)
                contents[i][4] = randomDesc;
                const desc = contents[i][2][randomDesc],
                    elements = [...desc.matchAll(/<[^>]+>/gi)].map(match => [match.index, match[0]]); // can't mach looks due to an onset of other issues
                currentInterval = setInterval(() => {
                    if (++letterIndex == desc.length) {
                        clearInterval(currentInterval);
                        random.innerHTML = "";
                        return;
                    }
                    for (let i = 0; i < elements.length; i++)
                        if (letterIndex == elements[i][0]) {
                            if (!currentFormatting) {
                                const tagName = elements[i][1].slice(1, elements[i][1].length - 1);
                                currentFormatting = document.createElement(tagName);
                                feed.appendChild(currentFormatting);
                                if (tagName == "br") // <br> is not a formatting tag
                                    currentFormatting = null;
                            }
                            else
                                currentFormatting = null;
                            letterIndex += elements[i][1].length;
                            elements.splice(0, 1);
                            break;
                        }
                    random.innerHTML = String.fromCharCode(Math.floor(Math.random() * 62) + 65);
                    if (!currentFormatting)
                        feed.innerHTML += desc[letterIndex];
                    else
                        currentFormatting.innerHTML += desc[letterIndex];
                }, 20);
                if (contents[i][5]) {
                    lock = true;
                    setTimeout(() => lock = false, contents[i][5]);
                }
            }
        });
}

function initialize() {
    document.getElementsByTagName("html")[0].style.fontSize = `${16 / devicePixelRatio}px`; // adjust sizes
    animatedName();
    animatedDescriptions();
}

document.addEventListener("DOMContentLoaded", initialize);