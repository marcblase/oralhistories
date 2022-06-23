var AUD = new Audio,
      BTNS = document.querySelectorAll("[data-audio]");

var timeLeftID;

function playPause() {
    
    var src = this.dataset.audio;

    timeLeftID = this.dataset.id;
    
    if (AUD.src != src){
        AUD.src = src;
    }
    
    AUD[AUD.paused ? "play" : "pause"]();
    
    BTNS.forEach(el => el.classList.remove("pause"));
    
    this.classList.toggle("pause", !AUD.paused);
    
    console.log(timeLeftID);
    return timeLeftID;

}

AUD.addEventListener("timeupdate", resetTimer); // no countdown

// Countdown
/*AUD.addEventListener("timeupdate", function() {
    
    resetTimer(); // reset timer while playing
    
    // let timeLeft = document.getElementById('timeLeft'),
    // var timeLeft = this.querySelectorAll(':scope > .audio-time'),
    var timeLeft = document.getElementById(timeLeftID),
        duration = parseInt( AUD.duration ),
        currentTime = parseInt( AUD.currentTime ),
        timeLeft = duration - currentTime,
        s, 
        m;
            
    s = timeLeft % 60;
    m = Math.floor( timeLeft / 60 ) % 60;
    
    s = s < 10 ? "0"+s : s;
    m = m < 10 ? "0"+m : m;
    
    timeLeft.innerHTML = m+":"+s;

});*/

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
