const video = document.getElementById("camera");

const constraints = {
  video: {
    facingMode: { ideal: "environment" } // Kamera belakang
  },
  audio: false
};

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Gagal akses kamera: " + err.message);
    console.error(err);
  });
