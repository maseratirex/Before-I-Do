/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

export const pairRequest = onCall(async (request) => {
  // Get parameters from request
  const partnerEmail = request.data.email;
  const senderId = request.data.user;

  // Find the user document in Firestore associated with the partner email
  const partnerQuery = admin.firestore().collection("users").where("email", "==", partnerEmail);
  partnerQuery.get().then(async (querySnapshot: { empty: any; docs: any[]; }) => {
    if (!querySnapshot.empty) {
      // Get just the one user document
      const snapshot = querySnapshot.docs[0]
      // Reference of user doc
      const partnerRef = snapshot.ref

      // add request to firestore 
      const val = await admin.firestore().collection("requests").add({
        recipientId: partnerRef.id,
        senderId: senderId,
        pairStatus: "pending",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      logger.log("Pair Request Recorded:", val);

      return { success: true };
    }
    else {
      logger.log("No user matches specified email address:", partnerEmail);
      return { success: false, message: "User does not exist" };
    }
  })
});

export const checkPairRequest = onCall(async (request) => {
  // Get parameters from request
  const userId = request.data.user;
  
  // create array to emails of senders of pair requests
  const senderEmails: string[] = [];

  // Find all pending requests associated with the current user as specified by userId
  const querySnapshot = await admin.firestore().collection('requests')
      .where('recipientId', '==', userId).where('pairStatus', '==', 'pending')
      .get();

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
        
        // Get the senderId from the document data from each request

        //TODO: convert senderId to email address through query
        const senderId = doc.data().senderId;
        senderEmails.push(senderId)
      });
    }

  if (senderEmails.length > 0) {
    return { success: true, senderEmails };
  } else {
    return { success: false, message: "No pending pair requests." };
  }
});

