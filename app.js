// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Your config
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

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Elements
const upload = document.getElementById("upload");
const feed = document.getElementById("videoFeed");

// Upload video
upload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const storageRef = ref(storage, "videos/" + Date.now() + "_" + file.name);

  // Upload to Firebase Storage
  await uploadBytes(storageRef, file);

  // Get URL
  const url = await getDownloadURL(storageRef);

  // Save to Firestore
  await addDoc(collection(db, "videos"), {
    title: file.name,
    url: url,
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

    const video = document.createElement("video");
    video.src = data.url;
    video.controls = true;

    const title = document.createElement("div");
    title.className = "videoTitle";
    title.textContent = data.title;

    card.appendChild(video);
    card.appendChild(title);
    feed.appendChild(card);
  });
}

// Load on start
loadVideos();
