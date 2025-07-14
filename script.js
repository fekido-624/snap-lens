const video = document.getElementById("camera");
const canvas = document.getElementById("snapshot");
const snapBtn = document.getElementById("snapBtn");

const imgbbApiKey = "1c69615def5fc386d033e43bf69b31f2";         // Ganti API key imgbb
const clarifaiApiKey = "bfc8a3c4c3514c15b0386b048ce9dbc7";   // Ganti API key Clarifai

// Setup kamera belakang
navigator.mediaDevices.getUserMedia({
  video: { facingMode: { ideal: "environment" } },
  audio: false
})
  .then(stream => { video.srcObject = stream; })
  .catch(err => alert("Gagal akses kamera: " + err.message));

// Bila tekan Snap
snapBtn.addEventListener("click", () => {
  // Tangkap gambar
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Tukar ke base64
  const base64Image = canvas.toDataURL("image/jpeg").split(',')[1];

  // Upload ke imgbb
  const formData = new FormData();
  formData.append("image", base64Image);

  fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const imageUrl = data.data.url;
      console.log("imgbb URL:", imageUrl);

      // Hantar ke Clarifai
      return fetch("https://api.clarifai.com/v2/models/general-image-recognition/outputs", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": "Key " + clarifaiApiKey
        },
        body: JSON.stringify({
          user_app_id: { user_id: "clarifai", app_id: "main" },
          inputs: [{ data: { image: { url: imageUrl } } }]
        })
      });
    })
    .then(res => res.json())
    .then(json => {
      const concepts = json.outputs[0].data.concepts;
      const labels = concepts.map(c => c.name.toLowerCase());

      console.log("Detected:", labels);

      // Logik if
      if (labels.includes("ram")) {
        window.location.href = "https://shopee.com.my/search?keyword=ram";
      } else if (labels.includes("keyboard")) {
        window.location.href = "https://shopee.com.my/search?keyword=keyboard";
      } else if (labels.includes("cpu")) {
        window.location.href = "https://shopee.com.my/search?keyword=cpu";
      } else if (labels.includes("power supply")) {
        window.location.href = "https://shopee.com.my/search?keyword=psu";
      } else {
        alert("Tiada padanan dikesan.");
      }
    })
    .catch(err => {
      console.error("Ralat:", err);
      alert("Ralat semasa pengesanan imej.");
    });
});
