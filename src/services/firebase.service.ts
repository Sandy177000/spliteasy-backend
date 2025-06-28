import admin from "firebase-admin";

// not in use
const serviceAccount = require("../config/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const verifyFirebaseToken = async (idToken: string)=> {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const userRecord = await admin.auth().getUser(decoded.uid);
    return {
        uid: decoded.uid,
        email: decoded.email,
        name: userRecord.displayName,
        profileImage: userRecord.photoURL,
    }
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
