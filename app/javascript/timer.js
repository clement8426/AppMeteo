document.addEventListener("DOMContentLoaded", function () {
  // Update timer every second for each visitor
  setInterval(updateTimers, 1000);
});

function updateTimers() {
  var visitors = document.querySelectorAll("[id^=timer_]");
  visitors.forEach(function (visitor) {
    var createdTime = new Date(visitor.getAttribute("data-created-at"));
    var currentTime = new Date();
    var elapsedTimeInSeconds = Math.floor((currentTime - createdTime) / 1000);
    visitor.innerText = formatTime(elapsedTimeInSeconds);
  });
}

function formatTime(seconds) {
  if (seconds < 60) {
    return seconds + " sec";
  } else {
    var minutes = Math.floor(seconds / 60);
    return minutes + " min";
  }
}

function pad(number) {
  return (number < 10 ? "0" : "") + number;
}
