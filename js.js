/*
    IDEA BOARD
    - Use regex and await for delayed but responsive animation initialization;
    - Subtext init (lor[r]-esque);
    - parallax-bound imagery;
    - emphasize subs;
*/
window.onload = () => {
    document.getElementById("us2").style.top = document.getElementById("us").clientHeight + window.innerHeight * 0.02 + "px";
    function loopedLetterRand(i, elementTextP, slogan){ // for every external loop call, start from one letter further.
        let elementText = [], elementTextReady = "";
        /*if(typeof elementTextP === undefined || elementTextP == null || elementTextP.length != slogan.length){
            elementTextP = "";
            for(let j = 0; j < slogan.length; j++)
                elementTextP += "_";
        } mediocre safeguard*/
        for(let j = 0; j < elementTextP.length; j++) // deserialize
            elementText.push(elementTextP[j]); 
        for(j = i; j < elementTextP.length; j++){
            let char = ' ';
            while(char == ' ')
                char = String.fromCharCode(Math.floor((Math.random() * 100))%95 + 32); // 32 - 126
            elementText[j] = char;
        }
        elementText[i] = slogan[i];
        for(let j = 0; j < elementTextP.length; j++) // serialize
            elementTextReady += elementText[j];
        return elementTextReady;
    }
    function randomizeAddress(elementText, slogan, waitTime){
        for(let i = 0; i < slogan.length; i++)
            for(let j = 1; j < 11; j++){
                setTimeout(() => {
                    let elementTextReady = loopedLetterRand(i, elementText.textContent, slogan);
                    elementText.textContent = elementTextReady;
                }, waitTime / 3 * j * (i + 1) + 20);
            }
    }


    const ids = [], functions = [];
    function callback(entries, observer, index){
        entries.forEach(entry => {
            if(entry.isIntersecting){
                functions[index]();
                observer.disconnect();   
            }
        });
    }
    let standardIO = {
        root: null,
        rootMargin: "0px",
        threshold: 0.35
    }
    ids.forEach((value, index) => {
        let observer = new IntersectionObserver((entries, observer) => {
            callback(entries, observer, index)
        }, standardIO);
        observer.observe(document.getElementById(value));
    });
}

function subUSAnimation(){
    document.getElementById("us").classList.toggle("us-fg-hover");
    document.getElementById("us2").classList.toggle("us-bg-hover");
}