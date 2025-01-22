/*async function lanyard(){
    const response = await fetch('https://api.lanyard.rest/v1/users/703646178536849448', {
    mode: 'cors',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
    });
    const data = await response.json();
    for(let i = 0; i < 2; i++)
        console.log(data.data.activities[i]);
}*/
/*async function getGenius(songName, artists){
    const parsedArtists = artists.split("; ");
    let link = `https://starstruck.network/proxy.php?name=${songName}`;
    for(let artist of parsedArtists)
        link += `&artists[]=${encodeURIComponent(artist)}`;
    fetch(link)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}*/
async function lanyard2(){
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
        const { t : state, d : payload } = JSON.parse(data);
        if (state === "INIT_STATE" || state === "PRESENCE_UPDATE"){
            console.log(payload);
            const spotify = payload.spotify, // prevent songs from mixing
                  classHeader = "spotify-tab-",
                  elementData = [
                                    ["album-art", "author", "hyperlink", "header", "title", "album"], 
                                    [spotify.album_art_url, payload.spotify.artist, "https://open.spotify.com/track/", "Listening to Spotify", spotify.song, `🖸 ${spotify.album}`]
                                ];
            document.getElementById(`${classHeader}${elementData[0][0]}`).src = elementData[1][0];
            let authors = elementData[1][1].split("; "), 
                author = `by <strong>${authors[0]}</strong>`;
            for(let i = 1; i < authors.length; i++){
                if(`${author}, ${authors[i]}`.length > 41 + i * 17) // 17 equals tag length, 24 + 17 = 41
                    break;
                author += `, <strong>${authors[i]}</strong>`;
            }
            document.getElementById(`${classHeader}${elementData[0][1]}`).innerHTML = author;
            document.getElementById(`${classHeader}${elementData[0][2]}`).href = `${elementData[1][2]}${spotify.track_id}`;
            for(let i = 3; i < elementData[0].length; i++)
                document.getElementById(`${classHeader}${elementData[0][i]}`).innerHTML = elementData[1][i];
            const activities = payload.activities,
                  activityTab = document.getElementById("activity-tab-feed");
            let bannedActivities = ["Custom Status", "Spotify"], // do not display these
                activitiesAvailable = false;
            activityTab.innerHTML = null;
            for(let i = 0; i < activities.length && i < 6; i++){
                let banned = false;
                for(let j in bannedActivities)
                    if(activities[i].name == bannedActivities[j]){
                        banned = true;
                        break;
                    }
                if(!banned){
                    activitiesAvailable = true;
                    bannedActivities.push(activities[i].name);
                    const activityIcon = document.createElement("img");
                    let source = `https://cdn.discordapp.com/app-assets/${encodeURIComponent(activities[i].application_id)}/${encodeURIComponent(activities[i].assets.large_image)}.png`;
                    if(activities[i].name == "Visual Studio Code" && activities.large_text == "Idling")
                        source = "\\Visual assets\\vsc.png";
                    activityIcon.src = source;
                    activityIcon.classList.add("activity-tab-icon", "sidebar-image-decor");
                    activityIcon.alt = activities[i].name;
                    activityIcon.title = activities[i].name + (activities[i].details && ` - ${activities[i].details}`);
                    activityTab.appendChild(activityIcon);
                }
            }
            const trueActivityTab = document.getElementById("activity-tab");
            if(activitiesAvailable)
                trueActivityTab.style.display = "flex";
            else
            trueActivityTab.style.display = null;
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