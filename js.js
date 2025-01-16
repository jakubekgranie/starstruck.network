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
                                    ["album-art", "hyperlink", "header", "title", "author", "album"], 
                                    [spotify.album_art_url, "https://open.spotify.com/track/", "Listening to Spotify", spotify.song, `by <strong>${spotify.artist}</strong>`, `🖸 ${spotify.album}`]
                                ];
            document.getElementById(`${classHeader}${elementData[0][0]}`).src = elementData[1][0];
            document.getElementById(`${classHeader}${elementData[0][1]}`).href = `${elementData[1][1]}${spotify.track_id}`;
            for(let i = 2; i < elementData[0].length; i++)
                document.getElementById(`${classHeader}${elementData[0][i]}`).innerHTML = elementData[1][i];
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