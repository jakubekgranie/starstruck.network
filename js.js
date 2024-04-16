window.onload = () => {
    function loopedLetterRand(i, elementTextP, slogan){ // for every external loop call, start from one letter further.
        let elementText = [], elementTextReady = "";
        if(typeof elementTextP === undefined || elementTextP == null || elementTextP.length != slogan.length){
            elementTextP = "";
            for(let j = 0; j < slogan.length; j++)
                elementTextP += "_";
        }
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

    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                randomizeAddress(document.getElementById("AboutMeH1"), "About_Me", 30);
                observer.disconnect();   
            }
        })
    }, {threshold: 0.1});
    observer.observe(document.getElementById("main"));

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