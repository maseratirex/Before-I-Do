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
  logger.log("Params: Sender ID:", senderId, "Params: Partner Email:", partnerEmail);

  // Find the user document in Firestore associated with the partner email
  const partnerQuery = await admin.firestore().collection("users").where("email", "==", partnerEmail);
  const querySnapshot =  await partnerQuery.get();
  if (!querySnapshot.empty) {
    logger.log("query snapshot not empty:", querySnapshot);
    // Get just the one user document
    const snapshot = querySnapshot.docs[0]
    // Reference of user doc
    logger.log("snapshot:", snapshot);
    const partnerRef = snapshot.ref
    logger.log("Partner Ref:", partnerRef);


    // Check if a request already exists
    const requestQuery = admin.firestore().collection("requests").where("recipientId", "==", partnerRef.id).where("senderId", "==", senderId);
    logger.log("Request Query:", requestQuery);
    const requestSnapshot = await requestQuery.get();
    logger.log("Request Snapshot:", requestSnapshot);
    if (requestSnapshot.docs.length > 0) {
      logger.log("Request already exists:", requestSnapshot);
      return { success: false, message: "Request already exists" };
    }
    logger.log("Passed test: No existing request found.");

    // Check if the sender is already paired
    const senderRef = admin.firestore().collection("users").doc(senderId);
    const senderDoc = await senderRef.get();
    if (!senderDoc.empty) {
      const senderData = senderDoc.data();
      logger.log("Sender Data:", senderData);
      if (senderData && senderData.isPaired) {
        logger.log("Sender is already paired with someone.");
        return { success: false, message: "You are already paired with someone." };
      }
    } else {
      logger.log("Sender does not exist:", senderId);
      return { success: false, message: "Sender does not exist." };
    }
    logger.log("Passed test: Sender exists and is not paired.");

    // Check if the recipient is already paired
    const recipientRef = admin.firestore().collection("users").doc(partnerRef.id);
    const recipientDoc = await recipientRef.get();
    if (recipientDoc.exists) {
      const recipientData = recipientDoc.data();
      logger.log("Recipient Data:", recipientData);
      if (recipientData && recipientData.isPaired) {
        logger.log("Recipient is already paired with someone.");
        return { success: false, message: "Recipient is already paired with someone." };
      }
    } else {
      logger.log("Recipient does not exist:", partnerRef.id);
      return { success: false, message: "Recipient does not exist." };
    }
    logger.log("Passed test: Recipient exists and is not paired.");

    // Check if the sender and recipient are the same
    if (senderId === partnerRef.id) {
      logger.log("Sender and recipient are the same. senderId:", senderId, "partnerRef.id:", partnerRef.id);
      return { success: false, message: "You cannot send a request to yourself." };
    }
    logger.log("Passed test: Sender and recipient are not the same.");

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
});


export const checkPairRequest = onCall(async (request) => {
  // Get parameters from request
  const userId = request.data.user;
  logger.log("Params: User ID:", userId);
  
  // create array to emails of senders of pair requests
  const senderEmails: string[] = [];

  // Find all pending requests associated with the current user as specified by userId
  const querySnapshot = await admin.firestore().collection('requests')
      .where('recipientId', '==', userId).where('pairStatus', '==', 'pending')
      .get();

  if (!querySnapshot.empty) {
    logger.log("query snapshot not empty:", querySnapshot);
    //const requestingDocs = querySnapshot.val();
    //logger.log("requestingDocs:", requestingDocs);
    for (const doc of querySnapshot.docs) {
      logger.log("Pair Request ID:", doc.id);
      // Get the senderId from the document data from each request
      const senderId = doc.data().senderId;
      logger.log("Sender ID:", senderId);

      // Convert senderId to email address through query
      const senderRef = admin.firestore().collection("users").doc(senderId);
      logger.log("Sender Email Query:", senderRef);
      const senderDoc = await senderRef.get();
      if (senderDoc.exists) {
        const senderDocData = senderDoc.data();
        logger.log("Sender Email Data:", senderDocData.email);
        if (senderDocData && senderDocData.email) {
          // Add the email to the array
          senderEmails.push(senderDocData.email);
          logger.log("updated senderEmails:", senderEmails);
        }
      } else {
        logger.log("Sender does not exist:", senderId);
      }
    }
    /*const forEachwasCanceled = await querySnapshot.forEach(async(doc: { data: () => any; id: any; }) => {
      logger.log("Pair Request ID:", doc.id);
      // Get the senderId from the document data from each request
      const senderId = doc.data().senderId;
      logger.log("Sender ID:", senderId);

      // Convert senderId to email address through query
      const senderRef = admin.firestore().collection("users").doc(senderId);
      logger.log("Sender Email Query:", senderRef);
      const senderDoc = await senderRef.get();
      if (senderDoc.exists) {
        const senderDocData = senderDoc.data();
        logger.log("Sender Email Data:", senderDocData.email);
        if (senderDocData && senderDocData.email) {
          // Add the email to the array
          senderEmails.push(senderDocData.email);
          logger.log("updated senderEmails:", senderEmails);
        }
      } else {
        logger.log("Sender does not exist:", senderId);
      }
    });
    if (forEachwasCanceled) {
      logger.log("Not all requests were processed.");
      return { success: false, message: "Not all requests were processed." };
    }*/
  }
  
  logger.log("Final Sender Emails:", senderEmails);
  if (senderEmails.length > 0) {
    return { success: true, senderEmails };
  } else {
    return { success: false, message: "No pending pair requests." };
  }
});

