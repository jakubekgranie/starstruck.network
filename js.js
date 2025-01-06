/*
    IDEA BOARD
    - Use regex and await for delayed but responsive animation initialization; [?]
    - Subtext init (lor[r]-esque); [?]
    - parallax-bound imagery; [?]
    - emphasize subs; [?]
    - logo; [TBD]
    - animation ideas; [IN-PROGRESS]
    - sections: [1/5]
        - home, [PRIMARY WORK DONE]
        - about me, [IN-PROGRESS]
        - my skills, [TBD]
        - projects, [TBD]
        - about site; [TBD]
    - add a mirror element for the update feed to track size (see 1st comment excluding this). check if js can get computed values from such element when just stored in a variable.
      if issues with viewport sync appear, resort to more rudimentary approaches; [TBD]
    - get swap functions to two toggles if values used aren't js-dependent (calculations are, whilst classes/constant values are not). [DONE]

    AFTER 1.0
    - convert css subclasses to prefix-like names (see the .fx family).
*/
let vw = window.innerWidth * 0.01, vh = window.innerHeight * 0.01;
window.onload = () => {
    const us = document.getElementById("us"), us2 = document.getElementById("us2"), usHeight = us.clientHeight / vw - 2; // why does html generate such abhorrent spaces on resize?
    document.getElementById("us-feed").innerHTML += "<hr class='mg-0 br-us_init'>==== CHANGELOG<br>- Continued development.<br><br>==== KNOWN BUGS<br>- Unexpected line separation distance causes this element's dimensions to be inadequate when the viewport becomes bigger than initially. Fix en route.";
    const usExtendedHeight = us.clientHeight / vw - 2, us2Margin = usExtendedHeight - usHeight + "vw";
    us.style.height = usHeight + "vw";
    us2.style.top = us.clientHeight / vw - .750 +  "vw"; // resize breaks
    setInterval(() => {document.getElementById("h-writer").classList.toggle("op-0")}, 1000);
    const title = "// SHATTERWARES";
    for(let i = 0; i < title.length; i++)
        setTimeout(() => {document.getElementById("h-contents").innerHTML += title[i]}, 450 + 35 * i - Math.pow(1.1, i));
    /*function loopedLetterRand(i, elementTextP, slogan){ // for every external loop call, start from one letter further. legacy. the core component of randomizeAddress().
        let elementText = [], elementTextReady = "";
        if(typeof elementTextP === undefined || elementTextP == null || elementTextP.length != slogan.length){
            elementTextP = "";
            for(let j = 0; j < slogan.length; j++)
                elementTextP += "_";
        } mediocre safeguard
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
    }*/
    const ids = [], functions = [() => {}], params = [["-a", "-nd"]], IOs = []; //after, nondisc;
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
            us2.style.marginTop = us2Margin;
        }
        else{
            us.style.height =  usHeight + "vw";
            us2.style.marginTop = null;
        }
    }
    const feed = document.getElementById("us-main");
    feed.addEventListener("mouseover", () => {subUSAnimation(true)});
    feed.addEventListener("mouseout", () => {subUSAnimation()});
    const updateButton = document.getElementById("b-hide-feed");
    function toggleFeed(){
        if(!feed.style.display)
            feed.style.display = "none";
        else
            feed.style.display = null;
        updateButton.classList.toggle("b-update-on");
        updateButton.classList.toggle("b-update-off");
    }
    updateButton.addEventListener("click", () => {toggleFeed()});
    document.getElementById("b-hide-feed")
    const buttons = ["b-about", "b-skills", "b-projects", "b-site"], bInd = document.getElementById("b-indicator"), ov = document.getElementById("overlay");
    let isOverlaid;
    document.getElementById("b-home").addEventListener("click", () => {
        bInd.style.marginTop = null;
        if(isOverlaid){
            ov.classList.add("ov-off");
            isOverlaid = false;
        }
    }); 
    for(let i = 0; i < 4; i++)
        document.getElementById(buttons[i]).addEventListener("click", () => {
            bInd.style.marginTop = (i + 1) * 4 + "vw"; 
            if(!isOverlaid) 
                ov.classList.remove("ov-off"); 
            isOverlaid = true;
        }); 
    document.getElementById("b-about").addEventListener("click", () => {
        const cmd = document.getElementById("about-me-cmd");
        if(cmd.classList.contains("ov-off"))
            cmd.classList.remove("ov-off");
        else
            cmd.classList.add("ov-off");
    });
}
/*legacy function scrollListener(){
    vw = window.innerWidth * 0.01;
    vh = window.innerHeight * 0.01;
    const scr = window.scrollY, res = 225 - 125 * scr / (80 * vh);
    if(scr > -1 && res >= 100)
        document.body.style.backgroundSize = res + "%";
    else if(res < 100)
        document.body.style.backgroundSize = "100%"; 
}*/
document.addEventListener("scroll", () => {scrollListener()});
window.onresize = () => {
    for(let i = 0; i < 2; i++){
        document.getElementById("us").classList.toggle("t-p125");
        document.getElementById("us2").classList.toggle("t-p125");
    }
    vw = window.innerWidth * 0.01;
    vh = window.innerHeight * 0.01;
}