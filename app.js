import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAW1rG5UOdmsI3aSGhmSvVtH7TEZlFsK_U",
  authDomain: "watchify-4f64d.firebaseapp.com",
  databaseURL: "https://watchify-4f64d-default-rtdb.firebaseio.com",
  projectId: "watchify-4f64d",
  storageBucket: "watchify-4f64d.firebasestorage.app",
  messagingSenderId: "201200324089",
  appId: "1:201200324089:web:94386fbc088420e5c80128",
  measurementId: "G-FBZQZGW8KR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// عناصر
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const videoInput = document.getElementById("videoUpload");
const thumbInput = document.getElementById("thumbUpload");
const uploadBtn = document.getElementById("uploadBtn");
const feed = document.getElementById("videoFeed");

// Upload logic
uploadBtn.addEventListener("click", async () => {
  const title = titleInput.value;
  const description = descInput.value;
  const videoFile = videoInput.files[0];
  const thumbFile = thumbInput.files[0];

  if (!videoFile || !thumbFile || !title) {
    alert("Fill everything");
    return;
  }

  // Upload video
  const videoRef = ref(storage, "videos/" + Date.now() + "_" + videoFile.name);
  await uploadBytes(videoRef, videoFile);
  const videoURL = await getDownloadURL(videoRef);

  // Upload thumbnail
  const thumbRef = ref(storage, "thumbnails/" + Date.now() + "_" + thumbFile.name);
  await uploadBytes(thumbRef, thumbFile);
  const thumbURL = await getDownloadURL(thumbRef);

  // Save data
  await addDoc(collection(db, "videos"), {
    title,
    description,
    videoURL,
    thumbURL,
    created: Date.now()
  });

  loadVideos();
});

// Load videos
async function loadVideos() {
  feed.innerHTML = "";

  const q = query(collection(db, "videos"), orderBy("created", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "videoCard";

    const thumb = document.createElement("img");
    thumb.src = data.thumbURL;
    thumb.className = "thumbnail";

    const info = document.createElement("div");
    info.className = "videoInfo";

    const title = document.createElement("div");
    title.className = "videoTitle";
    title.textContent = data.title;

    const desc = document.createElement("div");
    desc.className = "videoDesc";
    desc.textContent = data.description;

    info.appendChild(title);
    info.appendChild(desc);

    card.appendChild(thumb);
    card.appendChild(info);

    // Click to play
    card.onclick = () => {
      const win = window.open();
      win.document.write(`
        <video src="${data.videoURL}" controls autoplay style="width:100%"></video>
        <h2>${data.title}</h2>
        <p>${data.description}</p>
      `);
    };

    feed.appendChild(card);
  });
}

loadVideos();
