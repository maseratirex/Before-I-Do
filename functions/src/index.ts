/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall} from "firebase-functions/v2/https";

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
  const partnerQuery = await admin.firestore().collection("users").where("email", "==", partnerEmail);
  const querySnapshot =  await partnerQuery.get();
  if (!querySnapshot.empty) {
    // Get just the one user document
    const snapshot = querySnapshot.docs[0]
    // Reference of user doc
    const partnerRef = snapshot.ref;


    // Check if a request already exists
    const requestQuery = admin.firestore().collection("requests").where("recipientId", "==", partnerRef.id).where("senderId", "==", senderId);
    const requestSnapshot = await requestQuery.get();
    if (requestSnapshot.docs.length > 0) {
      return { success: false, message: "Request already exists" };
    }

    // Check if the sender is already paired
    const senderRef = admin.firestore().collection("users").doc(senderId);
    const senderDoc = await senderRef.get();
    if (!senderDoc.empty) {
      const senderData = senderDoc.data();
      if (senderData && senderData.isPaired) {
        return { success: false, message: "You are already paired with someone." };
      }
    } else {
      return { success: false, message: "Sender does not exist." };
    }

    // Check if the recipient is already paired
    const recipientRef = admin.firestore().collection("users").doc(partnerRef.id);
    const recipientDoc = await recipientRef.get();
    if (recipientDoc.exists) {
      const recipientData = recipientDoc.data();
      if (recipientData && recipientData.isPaired) {
        return { success: false, message: "Recipient is already paired with someone." };
      }
    } else {
      return { success: false, message: "Recipient does not exist." };
    }

    // Check if the sender and recipient are the same
    if (senderId === partnerRef.id) {
      return { success: false, message: "You cannot send a request to yourself." };
    }

    // add request to firestore 
    const val = await admin.firestore().collection("requests").add({
      recipientId: partnerRef.id,
      senderId: senderId,
      pairStatus: "pending",
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true, message: val.id };
  }
  else {
    return { success: false, message: "User does not exist" };
  }
});


export const checkPairRequest = onCall(async (request) => {
  // Get parameters from request
  const userId = request.data.user;
  
  // create array to emails of senders of pair requests
  const senderEmails: string[] = [];
  const requestTimeStamps: string[] = [];

  // Find all pending requests associated with the current user as specified by userId
  const querySnapshot = await admin.firestore().collection('requests')
      .where('recipientId', '==', userId).where('pairStatus', '==', 'pending')
      .get();

  if (!querySnapshot.empty) {
    for (const doc of querySnapshot.docs) {
      // Get the senderId from the document data from each request
      const senderId = doc.data().senderId;

      // Convert senderId to email address through query
      const senderRef = admin.firestore().collection("users").doc(senderId);
      const senderDoc = await senderRef.get();
      if (senderDoc.exists) {
        const senderDocData = senderDoc.data();
        if (senderDocData && senderDocData.email) {
          // Add the email to the array
          senderEmails.push(senderDocData.email);
          if (senderDocData.timestamp) {
            requestTimeStamps.push(senderDocData.timestamp);
          }else {
            requestTimeStamps.push("No timestamp available");
          }
        } 
      } else {
        return {success: false, message: "Sender does not exist:" + senderId};
      }
    }
  }
  
  if (senderEmails.length > 0) {
    return { success: true, emails: senderEmails, timestamps: requestTimeStamps };
  } else {
    return { success: false, message: "No pending pair requests." };
  }
});


export const confirmPairing = onCall(async (request) => {
  // Get parameters from request
  const userId = request.data.user;
  const partnerEmail = request.data.email;

  // Don't allow pairing if a request is already confirmed
  const confirmedRequestsSnapshot = await admin.firestore().collection('requests')
  .where('recipientId', '==', userId).where('pairStatus', '==', 'confirmed')
  .get();
  if (!confirmedRequestsSnapshot.empty) {
    return { success: false, message: "A Pair request has already been confirmed" };
  }

  // Convert partnerEmail to partnerId through query
  const partnerQuery = await admin.firestore().collection("users").where("email", "==", partnerEmail);
  const partnerSnapshot =  await partnerQuery.get();
  if (!partnerSnapshot.empty) {
    // Get just the one user document
    const partnerRef = partnerSnapshot.docs[0];
    const partnerId = partnerRef.id;

    // REJECT ALL OTHER PAIRING REQUESTS
    // Find all pending requests associated with the current user as specified by userId
    const allRequestsSnapshot = await admin.firestore().collection('requests')
    .where('recipientId', '==', userId).where('pairStatus', '==', 'pending')
    .get();
    if (!allRequestsSnapshot.empty) {
      for (const doc of allRequestsSnapshot.docs) {
        // Get the senderId from the document data from each request
        const senderId = doc.data().senderId;

        // Check if the senderId is not equal to the partnerId
        if (senderId !== partnerId) {
          // Update the pairStatus to "rejected"
          await doc.ref.update({ pairStatus: "rejected" });
        }
      } 
    }
    
    // CONFIRM PAIRNING
    // Confirm the pair request exists
    const requestSnapshot = await admin.firestore().collection("requests").where("recipientId", "==", userId).where("senderId", "==", partnerId).where("pairStatus", "==", "pending").get();
    if (!requestSnapshot.empty) {
      // The pair request exists, so update the pairStatus to "confirmed"
      try {
        const requestDoc = requestSnapshot.docs[0];
        await requestDoc.ref.update({ pairStatus: "confirmed" });

        // Update the sender and recipient documents to set isPaired to true and add a reference to each other
        const senderRef = await admin.firestore().collection("users").doc(partnerId);
        const recipientRef = await admin.firestore().collection("users").doc(userId);
        await senderRef.update({ isPaired: true, partner: userId });
        await recipientRef.update({ isPaired: true, partner: partnerId });
        return { success: true, message: "Pair request confirmed" };
      }
      catch (error) {
        // Reset all values on error
        const requestDoc = requestSnapshot.docs[0];
        await requestDoc.ref.update({ pairStatus: "pending" });

        // Update the sender and recipient documents to set isPaired to true and add a reference to each other
        const senderRef = await admin.firestore().collection("users").doc(partnerId);
        const recipientRef = await admin.firestore().collection("users").doc(userId);
        await senderRef.update({ isPaired: false, partner: null });
        await recipientRef.update({ isPaired: false, partner: null });
        return { success: false, message: "Pair request confirmation failed" };
      }
    }
    else {
      return { success: false, message: "Pair request does not exist" };
    }
  }
  else {
    return { success: false, message: "User does not exist" };
  }
});


export const cancelPairingRequest = onCall(async (request) => {
  // Get parameters from request
  const userId = request.data.user;

  // Get all sent pair requests
  const pendingSentRequestsSnapshot = await admin.firestore().collection('requests')
  .where('senderId', '==', userId).where('pairStatus', '==', 'pending')
  .get();
  if (!pendingSentRequestsSnapshot.empty) {
    for (const doc of pendingSentRequestsSnapshot.docs) {
      await doc.ref.update({ pairStatus: "canceled" });
    }
    return { success: true, message: "All sent pair requests have been canceled" };
  }
  return { success: false, message: "No sent pair requests to cancel" };
});


// TODO: add function to unpair currently paired users