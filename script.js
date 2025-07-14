const video = document.getElementById('camera');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Gagal akses kamera: " + err.message);
  });
