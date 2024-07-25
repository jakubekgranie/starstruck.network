/*
    IDEA BOARD
    - Use regex and await for delayed but responsive animation initialization;
    - Subtext init (lor[r]-esque);
    - parallax-bound imagery;
    - emphasize subs;
    - logo
    - animation ideas
    - sections
    - about me
    - what do i do + langs
    - current projects
    - contact
*/
let vw = window.innerWidth * 0.01, vh = window.innerHeight * 0.01;
window.onload = () => {
    const us = document.getElementById("us"), us2 = document.getElementById("us2"), usHeight = us.clientHeight / vw - 2; // why does html generate such abhorrent spaces on resize?
    document.getElementById("us-feed").innerHTML += "<hr class='mg-0 br-us_init'>==== CHANGELOG<br>- Added comments to js,<br>- Optimized js,<br>- Bug fixes.<br><br>The associated update was termed '01-02-07' due to an error. The target is the second instance.";
    const usExtendedHeight = us.clientHeight / vw - 2, us2Margin = usExtendedHeight - usHeight;
    us.style.height = usHeight + "vw";
    us2.style.top = us.clientHeight + window.innerWidth * 0.01125 + "px"; // resize breaks
    function loopedLetterRand(i, elementTextP, slogan){ // for every external loop call, start from one letter further. legacy. the core component of randomizeAddress().
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
    function randomizeAddress(elementText, slogan, waitTime){ // legacy. storing for potential later use.
        for(let i = 0; i < slogan.length; i++)
            for(let j = 1; j < 11; j++){
                setTimeout(() => {
                    let elementTextReady = loopedLetterRand(i, elementText.textContent, slogan);
                    elementText.textContent = elementTextReady;
                }, waitTime / 3 * j * (i + 1) + 20);
            }
    }
    const ids = ["about-me"], functions = [() => {console.warn("This is a test trigger.")}], params = [["-a", "-nd"]], IOs = [false ,{root: null, rootMargin: "0px",threshold: 0.75}]; //after, nondisc;
    function callback(entries, observer, index){
        entries.forEach(entry => {
            let data = [false, false]; 
            params[index].forEach(param => { // parameter reader. some params may not be present, and so, using this is more efficient than multiple arrays of maximum size assuming there'll be many.
                switch(param){
                    case "-a":
                        data[0] = true;
                        break;
                    case "-nd":
                        data[1] = true;
                        break;
                }
            });
            if(entry.isIntersecting){
                functions[index]();
                if(!data[1])
                    observer.disconnect();
            }
            if(data[0] && !entry.isIntersecting)
                functions[index]();
        });
    }
    ids.forEach((value, index) => {
        let standardIO = {
            root: null,
            rootMargin: "0px",
            threshold: 0.35
        };
        if(IOs[index])
            standardIO = IOs[index];
        let observer = new IntersectionObserver((entries, observer) => {
            callback(entries, observer, index)
        }, standardIO);
        observer.observe(document.getElementById(value));
    });
    function subUSAnimation(mode = false){ 
        if(mode){
            us.style.height = usExtendedHeight + "vw";
            us2.style.marginTop = us2Margin + "vw";
        }
        else{
            us.style.height =  usHeight + "vw";
            us2.style.marginTop = null;
        }
    }
    document.getElementById("us-main").addEventListener("mouseover", () => {subUSAnimation(true)});
    document.getElementById("us-main").addEventListener("mouseout", () => {subUSAnimation()});
}
function scrollListener(reinit = false){
    if(reinit){
        vw = window.innerWidth * 0.01;
        vh = window.innerHeight * 0.01;
    }
    const scr = window.scrollY, res = 225 - 125 * scr / (80 * vh);
    if(scr > -1 && res >= 100)
        document.body.style.backgroundSize = res + "%";
    else if(res < 100)
        document.body.style.backgroundSize = "100%";
}
document.addEventListener("scroll", () => {scrollListener()});
window.onresize = () => {
    const us = document.getElementById("us"), us2 = document.getElementById("us2");
    us.classList.toggle("t-p2");
    us2.classList.toggle("t-p2");
    us2.style.top = us.clientHeight + window.innerWidth * 0.01125 + "px";
    us.classList.add("t-p2");
    us2.classList.add("t-p2");
    scrollListener(true);
}