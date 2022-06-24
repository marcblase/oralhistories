var AUD = new Audio,
    BTNS = document.querySelectorAll("[data-audio]"),
    TIMERS = document.querySelectorAll(".audio-time"),
    timeLeftID, // ID of time container 
    timeLeft; // the container to be updated

function playPause() {
    
    // this is the curent file being played
    if (this.classList.contains("current")){ 
         
        if (AUD.paused){
            AUD.play();
            this.classList.toggle("pause"); // toggle            
        } else {
            AUD.pause();
            this.classList.toggle("pause"); // toggle
        }

    // not the curent file, reset and start over
    } else { 
        
        var src = this.dataset.audio;

        timeLeftID = this.dataset.id;
        console.log(timeLeftID);
        
        if (AUD.src !== src){
            AUD.src = src;
        }

        AUD[AUD.paused ? "play" : "pause"]();
        
        // reset classes
        BTNS.forEach(el => el.classList.remove("pause"));
        BTNS.forEach(el => el.classList.remove("current"));

        // reset audio timer markup
        TIMERS.forEach(function(el){
            var dataTime = el.dataset.time;
            el.innerHTML = dataTime;
        });
        
        this.classList.toggle("pause"); // toggle
        this.classList.toggle("current"); // toggle
    }
}

//  AUD.addEventListener("timeupdate", resetTimer); // no countdown

// Countdown
AUD.addEventListener("timeupdate", (event) => {
    
    resetTimer(); // reset timer while playing
    
    // update timeLeft
    timeLeft = document.getElementById(timeLeftID);
    
    var duration = parseInt( AUD.duration ),
        currentTime = parseInt( AUD.currentTime ),
        timeMath = duration - currentTime,
        s, 
        m;
    
            
    s = timeMath % 60;
    m = Math.floor( timeMath / 60 ) % 60;
    
    s = s < 10 ? "0"+s : s;
    // m = m < 10 ? "0"+m : m; // no need as layout doesn't have preceeding zeds
    
    // fixes the NaN flash on content change
    if (timeMath < duration){
        timeLeft.innerHTML = m+":"+s;
    }

}, false);

AUD.addEventListener("ended", playPause);

BTNS.forEach(el => el.addEventListener("click", playPause));

var idleTime = 0;

function timerIncrement() {
    
    idleTime = idleTime + 1; // increment idler
    
    var thisUrl = window.location.href, // where are we
    urlFileName = thisUrl.substring(thisUrl.lastIndexOf('/')+1); // just the last bit please
    
    if (idleTime > 1 && urlFileName !== 'index.html') { // 1 minutes and not index.html
        window.location.href = "index.html"; // back to the beginning
    }
}

// set timeout timer
var $idleInterval = setInterval(timerIncrement, 60000); // 1 minute

function resetTimer() {
    idleTime = 0;
    // console.log("timer reset");
}

// Add events to reset timer
document.onmousemove = resetTimer;
document.onmousedown = resetTimer;
document.onmousewheel = resetTimer;
document.onclick = resetTimer;
document.keypress = resetTimer;
document.ontouchstart = resetTimer;
