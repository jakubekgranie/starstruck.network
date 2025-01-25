let currentActivities = [];
async function lanyard2(){
    const socket = new WebSocket("wss://api.lanyard.rest/socket"),
          CONFIG = {
                bannedActivities : ["Custom Status", "Spotify"],
                resources_location : "\\Visual assets\\",
                imagery: {
                    "Wuthering Waves" : "wuwa.png"
                },
                max_length : 41,
                wrapper_length : 17
            };
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
        const { t : state, d : payload } = JSON.parse(data);
        if (state === "INIT_STATE" || state === "PRESENCE_UPDATE"){
            if(payload.listening_to_spotify){ // spotify tab section
                console.log(payload);
                const spotify = payload.spotify, // prevent songs from mixing
                    classHeader = "spotify-tab-",
                    elementData = [ // spotify tab element data, 0 => ids, 1 => content
                                        ["album-art", "author", "hyperlink", "header", "title", "album"], 
                                        [spotify.album_art_url, payload.spotify.artist, "https://open.spotify.com/track/", "Listening to Spotify", spotify.song, `🖸 ${spotify.album}`]
                                  ];
                document.getElementById(`${classHeader}${elementData[0][0]}`).src = elementData[1][0];
                let authors = elementData[1][1].split("; "), 
                    author = `by <strong>${authors[0]}</strong>`;
                for(let i = 1; i < authors.length; i++){ // format authors
                    if(`${author}, <strong>${authors[i]}</strong>`.length > CONFIG.max_length + i * CONFIG.wrapper_length) // 17 equals tag length, 24 + 17 = 41
                        break;
                    author += `, <strong>${authors[i]}</strong>`;
                }
                document.getElementById(`${classHeader}${elementData[0][1]}`).innerHTML = author;
                document.getElementById(`${classHeader}${elementData[0][2]}`).href = `${elementData[1][2]}${spotify.track_id}`; // create the spotify album link
                for(let i = 3; i < elementData[0].length; i++)
                    document.getElementById(`${classHeader}${elementData[0][i]}`).innerHTML = elementData[1][i]; // standard content injection
                // [ADD] a timeout changing the tab to blank after a select period with no updates
            }

            const activities = payload.activities; // shorthand, prevent arbitrary changes
            for(let i = 0; i < activities.length; i++)
                for(let j = 0; j < CONFIG.bannedActivities.length; j++)
                    if(activities[i].name == CONFIG.bannedActivities[j]){
                        activities.splice(i, 1); // remove banned activities
                        i--;
                        break;
                    }
            for(let i = currentActivities.length - 1; i > -1; i--){ // remove absent activities
                let includes = false;
                for(let j = 0; j < activities.length; j++)
                    if(currentActivities[i] == activities[j].name + (activities[j].details && ` - ${activities[j].details}`))
                        includes = true;
                if(!includes){
                    const element = document.getElementById(currentActivities[i]);
                    element.classList.add("hidden-activity-tab-icon");
                    setTimeout(() => {element.remove();}, 350); // lesson learned
                    currentActivities.splice(i, 1);
                }
            }

            let activitiesAvailable = (currentActivities.length != 0) ? true : false; // considers continuing activities
            const fragment = document.createDocumentFragment(), // limit reflows
                  maxAmount = 6 - currentActivities.length; // 6 being the maximum amount of icons onscreen - the ones currently on display
            for(let i = 0; i < activities.length && i < maxAmount; i++){
                const activity = activities[i], // shorthand
                identifier = activity.name + (activity.details) ? ` - ${activity.details}` : ``; // element's id
                /*
                    Check if the activity:
                        1 => features the required data (large_image from assets);
                        2 => isn't featured already.
                */
                if(((typeof activity.assets !== "undefined" && typeof activity.large_image === "undefined") || CONFIG.imagery[activity.name]) && !currentActivities.includes(identifier)){
                    let source;
                    if(typeof activity.assets !== "undefined" || typeof activity.large_image !== "undefined")
                        source = `https://cdn.discordapp.com/app-assets/${encodeURIComponent(activity.application_id)}/${encodeURIComponent(activity.assets.large_image)}.png`;
                    if(activity.name == "Visual Studio Code" && activities.large_text == "Idling") // special case
                        source = `${CONFIG.resources_location}vsc.png`;
                    if(CONFIG.imagery[activity.name]) // replace with a custom icon for cosmetic or replacement purposes
                        source = `${CONFIG.resources_location}${CONFIG.imagery[activity.name]}`;
                    currentActivities.push(identifier);
                    activitiesAvailable = true;
                    const activityIcon = document.createElement("img");
                    activityIcon.src = source;
                    activityIcon.classList.add("activity-tab-icon", "sidebar-image-decor");
                    activityIcon.alt = activity.name;
                    activityIcon.title = activityIcon.id = identifier;
                    fragment.appendChild(activityIcon);
                }
            }
            document.getElementById("activity-tab-feed").appendChild(fragment);
            const trueActivityTab = document.getElementById("activity-tab"),
                  activityTitle = document.getElementById("activity-tab-title");
            if(activitiesAvailable){
                trueActivityTab.style.display = "flex";
                trueActivityTab.classList.add("show-activity-tab");
                activityTitle.style.marginBottom = "0.6rem";
            }
            else{
                trueActivityTab.style.display = null;
                trueActivityTab.classList.remove("show-activity-tab");
                activityTitle.style.marginBottom = null;
            }
        }
    });

    socket.onclose = (event) => {
        try {
            console.warn("Socket closed. Attempting to reconnect in 1 second...");
            clearInterval(heartbeat);
            setTimeout(() => {
                console.log("Trying to reconnect...");
                lanyard2();
            }, 1000);
        } catch(err) {
            console.error("An unexpected error occured near socket closure.\n\n" + err);
        }
        console.warn(event);
      };
}
document.addEventListener("DOMContentLoaded", lanyard2());