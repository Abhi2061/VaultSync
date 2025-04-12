import { db, query, collection, where, updateDoc, doc, getDocs, addDoc , auth, onAuthStateChanged} from "../firebase/firebase.js";
import bcrypt from "bcryptjs";

let userId = null;

// Load passwords ONLY after authentication
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User logged in: ", user);
    userId = user.uid;
  } else {
    console.log("User is not logged in.");
    userId = null;
  }
});

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

async function saveSecuredKey(website, securedKey, length) {
  try {
    // Reference to the "Passwords" collection
    const passwordsRef = collection(db, "UserSecrets");

    // Query to check if the website already exists
    const q = query(passwordsRef, where("userId", "==", userId), where("website", "==", website));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Website exists → Update the existing document
      const existingDoc = querySnapshot.docs[0]; // Get first matching document
      await updateDoc(doc(db, "UserSecrets", existingDoc.id), { securedKey, length });

      console.log("Password updated!");
    } else {
      // Website does not exist → Create a new document
      await addDoc(passwordsRef, { website, securedKey, length, userId });

      console.log("Password saved!");
    }
  } catch (error) {
    console.error("Error saving password:", error);
    alert("Failed to save password.");
  }
}
  
export async function generatePassword(website, password, length, secret) {

  if (!website || !password || !secret) {
    alert("Missing data! Select a site and enter your secret salt.");
    return;
  }

  const hashedPassword = await hashPassword(password);
  await saveSecuredKey(website, hashedPassword, length);

  return await fetchPassword(hashedPassword, length, secret);
}

export async function getPassword(website, secret) {
  
  if (!website || !secret) {
    alert("Missing data! Select a site and enter your secret");
    return;
  }

  return await fetchPassword(website.password, website.length, secret);
}

const fetchPassword = async (text, length = 10, secret) => {
  try {
    const response = await fetch(
      "https://api-pieshmjbka-uc.a.run.app/generate-password", // Use the new URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, length, secret }),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch password");

    const data = await response.json();
    return data.password;
  } catch (error) {
    console.error("Error:", error);
  }
};

