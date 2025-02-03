// https://www.npmjs.com/package/color.js
var ColorJS = function (r) { "use strict"; var a = (r, a) => { var t = r.map((r => { var t = Array.isArray(r) ? r : r.split(",").map(Number); return "hex" === a.format ? e(t) : t })); return 1 === a.amount || 1 === t.length ? t[0] : t }, t = (r, a) => { var t = Math.round(r / a) * a; return Math.min(t, 255) }, e = r => "#" + r.map((r => { var a = r.toString(16); return 1 === a.length ? "0" + a : a })).join(""), n = (r, t) => { for (var e = 4 * t.sample, n = r.length / e, o = { r: 0, g: 0, b: 0 }, g = 0; g < r.length; g += e)o.r += r[g], o.g += r[g + 1], o.b += r[g + 2]; return a([[Math.round(o.r / n), Math.round(o.g / n), Math.round(o.b / n)]], t) }, o = (r, e) => { for (var n = 4 * e.sample, o = {}, g = 0; g < r.length; g += n) { var m = [t(r[g], e.group), t(r[g + 1], e.group), t(r[g + 2], e.group)].join(); o[m] = o[m] ? o[m] + 1 : 1 } return a(Object.entries(o).sort((([r, a], [t, e]) => a > e ? -1 : 1)).slice(0, e.amount).map((([r]) => r)), e) }, g = (r, a, t) => new Promise(((e, n) => { return (o = (r => "string" == typeof r ? r : r.src)(a), new Promise(((r, a) => { var t = document.createElement("canvas"), e = t.getContext("2d"), n = new Image; n.onload = () => { t.height = n.height, t.width = n.width, e.drawImage(n, 0, 0); var a = e.getImageData(0, 0, n.width, n.height).data; r(a) }, n.onerror = () => a(Error("Image loading failed.")), n.crossOrigin = "", n.src = o }))).then((a => e(r(a, (({ amount: r = 3, format: a = "array", group: t = 20, sample: e = 10 } = {}) => ({ amount: r, format: a, group: t, sample: e }))(t))))).catch((r => n(r))); var o })); return r.average = (r, a) => g(n, r, a), r.prominent = (r, a) => g(o, r, a), r }({});

const CONFIG = {
    bannedActivities: ["Custom Status", "Spotify"],
    resources_location: "\\Visual assets\\",
    imagery: {
        "Wuthering Waves": "wuwa.png",
        "Microsoft Visual Studio": "vs2022.png",
        "VALORANT": "valorant.png"
    },
    max_length: 41,
    wrapper_length: 17,
    debounceTimeout: 250
};
let currentActivities = [],
    debounceReference = null,
    firstUpdate = true;

function parseLanyard2(payload) { // the main websocket operator
    console.log("[Lanyard2]\n", payload);
    if (payload.listening_to_spotify) { // spotify tab section
        const spotify = payload.spotify, // prevent songs from mixing
            classHeader = "spotify-tab-",
            elementData = [ // spotify tab element data, 0 => ids, 1 => content
                ["album-art", "author", "hyperlink", "header", "title", "album"],
                [spotify.album_art_url, payload.spotify.artist, "https://open.spotify.com/track/", "Listening to Spotify", spotify.song, `🖸 ${spotify.album}`]
            ];
        function setGradient(groups = 100) { // sets the gradient
            ColorJS.prominent(elementData[1][0], { amount: 3, group: groups }).then(color => {
                if (groups == 0 && color.length != 3)
                    return;
                if (color.length != 3) {
                    setGradient(groups - 20);
                    return;
                }
                color.sort();
                let gradient = `linear-gradient(to right bottom, `,
                    gradientIterations = 4;
                for (let i = 0; i < gradientIterations; i++) {
                    gradient += "rgb(";
                    for (let j = 0; j < 3; j++)
                        gradient += `${Math.floor((color[0][j] * (1 - i * 0.25) + color[1][j] * i * 0.25))}, `;
                    gradient += "0.2), ";
                }
                for (let i = gradientIterations; i > - 1; i--) {
                    gradient += "rgba(";
                    for (let j = 0; j < 3; j++)
                        gradient += `${Math.floor((color[2][j] * (1 - i * 0.25) + color[1][j] * i * 0.25))}, `;
                    gradient += "0.2), ";
                }
                gradient = gradient.substring(0, gradient.length - 2) + ")";
                gradientBlock.style.backgroundImage = gradient;
            });
        }
        const gradientBlock = document.getElementById("spotify-tab-gradient-block");
        ColorJS.average(elementData[1][0]).then(color =>
            gradientBlock.style.borderColor = `rgb(${color[0]}, ${color[1]}, ${color[2]}`
        );
        setGradient();
        document.getElementById(`${classHeader}${elementData[0][0]}`).src = elementData[1][0];
        let authors = elementData[1][1].split("; "),
            author = `by <strong>${authors[0]}</strong>`;
        for (let i = 1; i < authors.length; i++) { // format authors
            if (`${author}, <strong>${authors[i]}</strong>`.length > CONFIG.max_length + i * CONFIG.wrapper_length) // 17 equals tag length, 24 + 17 = 41
                break;
            author += `, <strong>${authors[i]}</strong>`;
        }
        document.getElementById(`${classHeader}${elementData[0][1]}`).innerHTML = author;
        document.getElementById(`${classHeader}${elementData[0][2]}`).href = `${elementData[1][2]}${spotify.track_id}`; // create the spotify album link
        for (let i = 3; i < elementData[0].length; i++)
            document.getElementById(`${classHeader}${elementData[0][i]}`).innerHTML = elementData[1][i]; // standard content injection
        // [ADD] a timeout changing the tab to blank after a select period with no updates
    }
    let activities = payload.activities; // shorthand, prevent arbitrary changes
    if (activities.length > 0) {
        activities = activities.filter(activity => !CONFIG.bannedActivities.includes(activity.name));
        for (let i = currentActivities.length - 1; i > -1; i--) { // remove absent activities
            let includes = false;
            for (let j = 0; j < activities.length; j++) {
                if (currentActivities[i] == activities[j].name + (activities[j].details ? ` - ${activities[j].details}` : ``))
                    includes = true;
            }
            if (!includes) {
                const element = document.getElementById(currentActivities[i]);
                element.classList.add("hidden-activity-tab-icon", "transparent");
                setTimeout(() => { element.remove(); }, 350); // lesson learned
                currentActivities.splice(i, 1);
            }
        }
        const trueActivityTab = document.getElementById("activity-tab"),
            activityTitle = document.getElementById("activity-tab-title");
        if (currentActivities.length == 0)
            trueActivityTab.classList.remove("show-activity-tab");
        let activitiesAvailable = currentActivities.length != 0; // considers continuing activities
        const fragment = document.createDocumentFragment(), // limit reflows
            maxAmount = 6 - currentActivities.length; // 6 being the maximum amount of icons onscreen - the ones currently on display
        for (let i = 0; i < activities.length && i < maxAmount; i++) {
            const activity = activities[i], // shorthand
                identifier = activity.name + (activity.details ? ` - ${activity.details}` : ``); // element's id
            if (!currentActivities.includes(identifier)) {
                let source = `${CONFIG.resources_location}missing-file.png`;
                if (typeof activity.assets !== "undefined")
                    source = `https://cdn.discordapp.com/app-assets/${encodeURIComponent(activity.application_id)}/${encodeURIComponent(activity.assets.large_image)}.png`;
                if (activity.name == "Visual Studio Code" && typeof activity.assets.large_text !== "undefined" && activity.assets.large_text == "Idling") // special case
                    source = `${CONFIG.resources_location}vsc.png`;
                else if (CONFIG.imagery[activity.name]) // replace with a custom icon for cosmetic or replacement purposes
                    source = `${CONFIG.resources_location}${CONFIG.imagery[activity.name]}`;
                currentActivities.push(identifier);
                activitiesAvailable = true;
                const activityIcon = document.createElement("img");
                activityIcon.src = source;
                activityIcon.classList.add("activity-tab-icon", "sidebar-image-decor");
                activityIcon.alt = activity.name;
                activityIcon.title = activityIcon.id = identifier;
                if (source === `${CONFIG.resources_location}missing-file.png`)
                    activityIcon.style.imageRendering = "pixelated";
                fragment.appendChild(activityIcon);
            }
        }
        document.getElementById("activity-tab-feed").appendChild(fragment);
        if (activitiesAvailable) {
            trueActivityTab.style.display = "flex";
            trueActivityTab.classList.add("show-activity-tab");
            activityTitle.style.marginBottom = "0.6rem";
        }
        else {
            trueActivityTab.style.display = null;
            trueActivityTab.classList.remove("show-activity-tab");
            activityTitle.style.marginBottom = null;
        }
    }
}
async function lanyard2() {
    const socket = new WebSocket("wss://api.lanyard.rest/socket");
    let heartbeat;
    socket.addEventListener("open", () => {
        socket.send(
            JSON.stringify({
                op: 2,
                d: {
                    "subscribe_to_id": "703646178536849448",
                }
            })
        );

        heartbeat = setInterval(() => {
            socket.send(
                JSON.stringify({
                    op: 3,
                })
            );
        }, 30000);
    });

    socket.addEventListener("message", ({ data }) => {
        const { t: state, d: payload } = JSON.parse(data);
        if (state === "INIT_STATE" || state === "PRESENCE_UPDATE") {
            clearTimeout(debounceReference);
            if (firstUpdate) {
                parseLanyard2(payload);
                firstUpdate = false;
            }
            else
                debounceReference = setTimeout(() => { parseLanyard2(payload) }, CONFIG.debounceTimeout);
        }
    });

    socket.onclose = (event) => {
        try {
            console.warn("[Lanyard2] Socket closed. Attempting to reconnect in 1 second...");
            clearInterval(heartbeat);
            setTimeout(() => {
                console.log("[Lanyard2] Trying to reconnect...");
                lanyard2();
            }, 1000);
        } catch (err) {
            console.error("[Lanyard2] An unexpected error occured near socket closure.\n\n" + err);
        }
        console.warn("[Lanyard2]\n", event);
    };
}
document.addEventListener("DOMContentLoaded", lanyard2);