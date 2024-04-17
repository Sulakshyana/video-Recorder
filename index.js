$(document).ready(function() {

  $("#countdown").text("");
  $("#retryBtn").hide();
  $(".icon").hide();
  $("#submit").hide();
  $("#recording").hide();


  const timestamp = $.now();
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour12: true });
  $('#currentDate').text(formattedDate);

  $("#video_start").on("click", function() {
    $("#video_start").hide();
    start_video_Recording();
    $(".centered-text").hide();
    $("#recording").show();
  });

  $("#retryBtn").on("click", function() {
    start_video_Recording();
    startCountdown();
    $(".centered-text").hide();
    $("#recording").show();
  });


let countdownInterval;

function startCountdown() {
  let seconds = 10;

  function updateCountdown() {
    $("#countdown").text(seconds);
    $(".icon").show();
    $("#recording").show();
    seconds--;

    if (seconds < 0) {
      clearInterval(countdownInterval);
    }
  }

  // Clear previous countdown interval if it exists
  clearInterval(countdownInterval);

  updateCountdown(); // Initial update
  // Update the countdown every second
  countdownInterval = setInterval(updateCountdown, 1000);
}

function stopCountDown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    $("#countdown").text("");
    $(".icon").hide();

  }
}
const startBtn=document.getElementById("video_start");
const vidBox = document.getElementById("vidBox");

function start_video_Recording() {

  let recordingTimer;
  // stores the recorded media
  let chunksArr = [];
  let videoConstraints;

  if (window.innerWidth > 600) {
    videoConstraints = { width: 600, height: 300 };
  } else {
    videoConstraints = { width: 600, height: 400 };
  }
  // permission to access camera and microphone
  navigator.mediaDevices.getUserMedia({ audio: true, video:videoConstraints}).then((mediaStreamObj) => {
    // Create a new MediaRecorder instance
    startCountdown();
    const medRec = new MediaRecorder(mediaStreamObj);
    
    window.mediaStream = mediaStreamObj;
    window.mediaRecorder = medRec;


    // when recorded data is available then push into chunkArr array
    medRec.ondataavailable = (e) => {
      chunksArr.push(e.data);
    };

    // stop the video recording after 10 seconds
    recordingTimer = setTimeout(() => {
      stopCountDown();
      stop_Recording();
    }, 10000);

    // stop the video recording
    medRec.onstop = () => {
      clearTimeout(recordingTimer);
      const blobFile = new Blob(chunksArr, { type: 'video/webm' });
      chunksArr = []; // Clear chunks array to release memory

      // create video element and store the media which is recorded

      const recUrl = URL.createObjectURL(blobFile);

      // keep the recorded URL as source
      vidBox.src = recUrl;
  // Wait for the loadedmetadata event to get the correct video dimensions
  vidBox.addEventListener('loadedmetadata', function() {
    // Log the recorded video dimensions
    console.log('Recorded Video Width:', vidBox.videoWidth);
    console.log('Recorded Video Height:', vidBox.videoHeight);
  });
    };

    medRec.start();
// Log the applied constraints
const videoTrack = mediaStreamObj.getVideoTracks()[0];
const videoSettings = videoTrack.getSettings();
console.log('Applied Constraints:', videoSettings.width, 'x', videoSettings.height);
  }).catch((error) => {
    console.error('Error accessing media devices:', error.name, error.message);
  });
  
}

function stop_Recording() {
  console.log("stop function called");
  window.mediaRecorder.stop();
  // stop all tracks
  window.mediaStream.getTracks().forEach((track) => {
    track.stop();
  });
  stopCountDown();
  $("#countdown").text("");
  $("#retryBtn").show();
  $("#submit").show();
}
});
