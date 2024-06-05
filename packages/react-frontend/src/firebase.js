import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTagRSP6vfS6OEQbQ73L_7nA-8q4DBt10",
  authDomain: "midreads.firebaseapp.com",
  projectId: "midreads",
  storageBucket: "midreads.appspot.com",
  messagingSenderId: "633085266973",
  appId: "1:633085266973:web:c5fc51b30d4b40a52b0af4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage();

export { app, auth };

//storage
export async function upload(file, currentUser, setLoading) {
  const fileRef = ref(storage, currentUser.uid + ".png");

  setLoading(true);

  try {
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    const promise = fetch("http://localhost:8000/updatePhoto", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: currentUser.uid, url: photoURL }),
    }).then(console.log("photo updated in database"));

    await updateProfile(currentUser, { photoURL });

    setLoading(false);
    alert("Uploaded file!");
    return photoURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    setLoading(false);
  }
}
