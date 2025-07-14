const video = document.getElementById("camera");
const canvas = document.getElementById("snapshot");
const snapBtn = document.getElementById("snapBtn");

const constraints = {
  video: {
    facingMode: { ideal: "environment" }
  },
  audio: false
};

// 1. Aktifkan kamera
navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Gagal akses kamera: " + err.message);
  });

// 2. Bila user klik SNAP
snapBtn.addEventListener("click", () => {
  // 2A. Ambil gambar dari video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2B. Tukar ke base64 image
  const base64Image = canvas.toDataURL("image/jpeg").split(',')[1];

  // 2C. Upload ke imgbb
  const imgbbApiKey = "1c69615def5fc386d033e43bf69b31f2"; // Ganti dengan API key anda
  const formData = new FormData();
  formData.append("image", base64Image);

  fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      const imageUrl = data.data.url;
      console.log("Gambar berjaya dimuat naik:", imageUrl);

      // 2D. Redirect ke Google Lens
      const lensUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl)}`;
      window.location.href = lensUrl;
    })
    .catch(error => {
      console.error("Gagal upload:", error);
      alert("Gagal upload ke imgbb");
    });
});
