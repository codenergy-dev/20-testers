import * as admin from "firebase-admin";
import { cert, getApp, getApps } from "firebase-admin/app";

const privateKey = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY!)
const firebaseConfig = {
    credential: cert({
        projectId: privateKey.project_id,
        clientEmail: privateKey.client_email,
        privateKey: privateKey.private_key,
    }),
}

export const firebase = (getApps().length > 0 ? getApp() : admin.initializeApp(firebaseConfig)) as admin.app.App