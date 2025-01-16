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
            let authors = elementData[1][1].split("; ");
            // add smalltext overflow functionality
            let author = `by <strong>${authors[0]}`, secondaryAuthors = ``;
            for(let i = 1; i < authors.length; i++){
                if(`${author}, ${authors[i]}`.length > 27)
                    break;
                author += `, ${authors[i]}`;
            }
            author += "<strong>";
            document.getElementById(`${classHeader}${elementData[0][1]}`).innerHTML = author;
            document.getElementById(`${classHeader}${elementData[0][2]}`).href = `${elementData[1][2]}${spotify.track_id}`;
            for(let i = 3; i < elementData[0].length; i++)
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