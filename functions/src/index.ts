/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall } from "firebase-functions/v2/https";
const {
  info,
  error,
  warn,
} = require("firebase-functions/logger");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

export const pairRequest = onCall(async (request) => {
  const emailVerified = request.auth?.token.email_verified;
  if (!emailVerified) {
    return { success: false, message: "Email not verified" };
  }

  // Get parameters from request
  const partnerEmail = request.data.email;

  // const senderId = request.data.user;
  const senderId = request.auth?.uid;

  // Find the user document in Firestore associated with the partner email
  const partnerQuery = await admin.firestore().collection("users").where("email", "==", partnerEmail);
  const querySnapshot = await partnerQuery.get();
  if (!querySnapshot.empty) {
    // Get just the one user document
    const snapshot = querySnapshot.docs[0]
    // Reference of user doc
    const partnerRef = snapshot.ref;

    // Check if a request already exists
    const requestQuery = admin.firestore().collection("requests")
      .where("recipientId", "==", partnerRef.id)
      .where("senderId", "==", senderId);

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
    return { success: true, message: "Request has been sent with ID: " + val.id };
  } else {
    return { success: false, message: "User does not exist" };
  }
});

export const checkPairRequest = onCall(async (request) => {
  const emailVerified = request.auth?.token.email_verified;
  if (!emailVerified) {
    return { success: false, message: "Email not verified" };
  }

  const userId = request.auth?.uid;

  // create array to emails of senders of pair requests
  const senderEmails: string[] = [];

  // Find all pending requests associated with the current user as specified by userId
  const querySnapshot = await admin.firestore().collection('requests')
    .where('recipientId', '==', userId)
    .where('pairStatus', '==', 'pending')
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
        }
      } else {
        return { success: false, message: "Sender does not exist: " + senderId };
      }
    }
  }

  if (senderEmails.length > 0) {
    return { success: true, emails: senderEmails, message: "Pending pair requests found." };
  } else {
    return { success: true, emails: senderEmails, message: "No pending pair requests." };
  }
});

export const confirmPairing = onCall(async (request) => {
  // Confirm pairing given a partner sent a request to the user
  const emailVerified = request.auth?.token.email_verified;
  if (!emailVerified) {
    return { success: false, message: "Email not verified" };
  }

  const userId = request.auth?.uid;
  const partnerEmail = request.data.email;

  // Don't allow pairing if a request is already confirmed
  const confirmedRequestsSnapshot = await admin.firestore().collection('requests')
    .where('recipientId', '==', userId)
    .where('pairStatus', '==', 'confirmed')
    .get();

  if (!confirmedRequestsSnapshot.empty) {
    return { success: false, message: "A pair request has already been confirmed" };
  }

  // Convert partnerEmail to partnerId through query
  const partnerQuery = await admin.firestore().collection("users").where("email", "==", partnerEmail);
  const partnerSnapshot = await partnerQuery.get();
  if (!partnerSnapshot.empty) {
    // Get just the one user document
    const partnerRef = partnerSnapshot.docs[0];
    const partnerId = partnerRef.id;

    // Confirm the pair request exists
    const requestSnapshot = await admin.firestore().collection("requests")
      .where("recipientId", "==", userId)
      .where("senderId", "==", partnerId)
      .where("pairStatus", "==", "pending")
      .get();
    
    if(requestSnapshot.empty) {
      return { success: false, message: "Pair request from specified partner does not exist" };
    }
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
    } catch (error) {
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
  } else {
    return { success: false, message: "User does not exist" };
  }
});

export const cancelPairingRequest = onCall(async (request) => {
  // Cancels all pending pair requests sent by the user
  const emailVerified = request.auth?.token.email_verified;
  if (!emailVerified) {
    return { success: false, message: "Email not verified" };
  }

  const userId = request.auth?.uid;

  // Get all sent pair requests
  const pendingSentRequestsSnapshot = await admin.firestore().collection('requests')
    .where('senderId', '==', userId)
    .where('pairStatus', '==', 'pending')
    .get();

  if (!pendingSentRequestsSnapshot.empty) {
    for (const doc of pendingSentRequestsSnapshot.docs) {
      await doc.ref.delete();
    }
    return { success: true, message: "All sent pair requests have been canceled" };
  }
  return { success: false, message: "No sent pair requests to cancel" };
});

export const seePairStatus = onCall(async (request) => {
  const emailVerified = request.auth?.token.email_verified;
  if (!emailVerified) {
    return { success: false, message: "Email not verified" };
  }

  const userId = request.auth?.uid;

  // Check if the user is paired
  const userDoc = await admin.firestore().collection("users").doc(userId).get();
  if (userDoc.exists) {
    const userData = userDoc.data();
    if (userData && userData.isPaired) {
      // User is paired, return the partnerId
      const partnerId = userData.partner;
      const partnerDoc = await admin.firestore().collection("users").doc(partnerId).get();
      if (partnerDoc.exists) {
        const partnerData = partnerDoc.data();
        if (partnerData && partnerData.email) {
          return { success: true, type: "paired", partner: partnerData.email, partnerInitials: partnerData.initials, message: "You are paired with " + partnerData.email };
        }
      }
      return { success: false, message: "Partner does not exist" };
    }
  }
  // Find requests associated with the current user as specified by userId
  const querySnapshot = await admin.firestore().collection('requests')
    .where('senderId', '==', userId).where('pairStatus', '==', 'pending')
    .get();

  if (!querySnapshot.empty) {
    const recipientId = querySnapshot.docs[0].data().recipientId;
    if (recipientId && typeof recipientId === "string" && recipientId.trim() !== "") {
      const partnerDoc = await admin.firestore().collection("users").doc(recipientId).get();
      if (partnerDoc.exists) {
        return { success: true, type: "requested", partnerRequest: partnerDoc.data().email, message: "You have sent a pending pair request to " + partnerDoc.data().email };
      } else {
        return { success: false, message: "Partner does not exist" };
      }
    } else {
      return { success: false, message: "Invalid recipientId in pair request" };
    }
  } else {
    return { success: true, type: "not requested", message: "No pair requests exist" };
  }
});

export const unpair = onCall(async (request) => {
  const emailVerified = request.auth?.token.email_verified;
  if (!emailVerified) {
    return { success: false, message: "Email not verified" };
  }

  const userId = request.auth?.uid;

  let partnerId = "";

  // Confirm that the user is paired
  const userDoc = await admin.firestore().collection("users").doc(userId).get();
  if (userDoc.exists) {
    const userData = userDoc.data();
    if (userData && userData.isPaired) {
      // User is paired, return the partnerId
      partnerId = userData.partner;
    } else {
      return { success: false, message: "You are not paired with anyone" };
    }
  } else {
    return { success: false, message: "User does not exist" };
  }

  // change pair request to pending: either the user or the partner sent a request to the other
  const requestSnapshot = await admin.firestore().collection('requests')
    .where('recipientId', '==', userId)
    .where('senderId', '==', partnerId)
    .get();
  if (!requestSnapshot.empty) {
    const requestDoc = requestSnapshot.docs[0];
    await requestDoc.ref.update({ pairStatus: "pending" });
  } else {
    const requestSnapshot = await admin.firestore().collection('requests')
      .where('recipientId', '==', partnerId)
      .where('senderId', '==', userId)
      .get();
    if (!requestSnapshot.empty) {
      const requestDoc = requestSnapshot.docs[0];
      await requestDoc.ref.update({ pairStatus: "pending" });
    } else {
      return { success: false, message: "Pair request does not exist" };
    }
  }

  // update both users to unpaired state
  const partnerRef = await admin.firestore().collection("users").doc(partnerId);
  const userRef = await admin.firestore().collection("users").doc(userId);
  await partnerRef.update({ isPaired: false, partner: null });
  await userRef.update({ isPaired: false, partner: null });
  return { success: true, message: "Users have been unpaired" };
});

export const seePartnerResponses = onCall(async (request) => {
  const emailVerified = request.auth?.token.email_verified;
  if (!emailVerified) {
    return { success: false, message: "Email not verified" };
  }

  const userId = request.auth?.uid;

  let partnerId = "";

  // Confirm that the user is paired
  const userDoc = await admin.firestore().collection("users").doc(userId).get();
  if (userDoc.exists) {
    const userData = userDoc.data();
    if (userData && userData.isPaired) {
      // User is paired, return the partnerId
      partnerId = userData.partner;
    } else {
      return { success: false, message: "You are not paired with anyone" };
    }
  } else {
    return { success: false, message: "User does not exist" };
  }

  // Get the partner's questionnaire responses
  const partnerDoc = await admin.firestore().collection("users").doc(partnerId).get();
  if (partnerDoc.exists) {
    const partnerData = partnerDoc.data();
    if (partnerData && partnerData.answers) {
      return { success: true, partnerResponses: partnerData.answers, message: "Partner's questionnaire responses retrieved" };
    } else {
      return { success: false, message: "Partner's questionnaire responses not found" };
    }
  } else {
    return { success: false, message: "Partner does not exist" };
  }
});

export const deleteUserData = onCall(async (request) => {
  try {
    info("Starting deleteUserData function");
    
    // Get parameters from request
    const emailVerified = request.auth?.token.email_verified;
    info(`Email verification status: ${emailVerified}`);
    
    if (!emailVerified) {
      warn("Delete user data failed: Email not verified");
      return { success: false, message: "Email not verified" };
    }

    const userId = request.auth?.uid;
    info(`Deleting user data for verified user ID: ${userId}`);
    
    if (!userId) {
      error("Delete user data failed: No user ID found in auth token");
      return { success: false, message: "No user ID found" };
    }

    // Get user document
    info(`Fetching user document for ID: ${userId}`);
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      info(`User document found. Data keys: ${userData ? Object.keys(userData).join(', ') : 'none'}`);
      info(`User isPaired status: ${userData?.isPaired}`);

      // handle a paired user
      if (userData && userData.isPaired) {
        info("Processing paired user deletion");
        const partnerId = userData.partner;
        info(`Partner ID: ${partnerId}`);
        
        try {
          // get partner document and unpair
          info(`Updating partner document to unpair: ${partnerId}`);
          const partnerRef = await admin.firestore().collection("users").doc(partnerId);
          await partnerRef.update({ isPaired: false, partner: null });
          info("Successfully unpaired partner");
        } catch (partnerError) {
          error(`Failed to unpair partner ${partnerId}:`, partnerError);
          // Continue with deletion even if partner update fails
        }

        // remove all pair requests associated with the user
        info("Removing pair requests where user is recipient");
        try {
          const requestRecipientSnapshot = await admin.firestore().collection('requests').where('recipientId', '==', userId).get();
          info(`Found ${requestRecipientSnapshot.size} requests where user is recipient`);
          
          if (!requestRecipientSnapshot.empty) {
            for (const doc of requestRecipientSnapshot.docs) {
              info(`Deleting recipient request: ${doc.id}`);
              await doc.ref.delete();
            }
            info("Successfully deleted all recipient requests");
          }
        } catch (recipientError) {
          error("Failed to delete recipient requests:", recipientError);
          throw recipientError;
        }

        info("Removing pair requests where user is sender");
        try {
          const requestSenderSnapshot = await admin.firestore().collection('requests').where('senderId', '==', userId).get();
          info(`Found ${requestSenderSnapshot.size} requests where user is sender`);
          
          if (!requestSenderSnapshot.empty) {
            for (const doc of requestSenderSnapshot.docs) {
              info(`Deleting sender request: ${doc.id}`);
              await doc.ref.delete();
            }
            info("Successfully deleted all sender requests");
          }
        } catch (senderError) {
          error("Failed to delete sender requests:", senderError);
          throw senderError;
        }

        // delete the user document
        info(`Deleting user document: ${userId}`);
        try {
          await userDoc.ref.delete();
          info("Successfully deleted user document");
          return { success: true, message: "User and associated data deleted successfully from firestore" };
        } catch (deleteError) {
          error("Failed to delete user document:", deleteError);
          throw deleteError;
        }
      }
      // handle an unpaired user
      else if (userData && !userData.isPaired) {
        info("Processing unpaired user deletion");
        
        // remove all pair requests associated with the user
        info("Removing pair requests where user is recipient");
        try {
          const requestRecipientSnapshot = await admin.firestore().collection('requests').where('recipientId', '==', userId).get();
          info(`Found ${requestRecipientSnapshot.size} requests where user is recipient`);
          
          if (!requestRecipientSnapshot.empty) {
            for (const doc of requestRecipientSnapshot.docs) {
              info(`Deleting recipient request: ${doc.id}`);
              await doc.ref.delete();
            }
            info("Successfully deleted all recipient requests");
          }
        } catch (recipientError) {
          error("Failed to delete recipient requests:", recipientError);
          throw recipientError;
        }

        info("Removing pair requests where user is sender");
        try {
          const requestSenderSnapshot = await admin.firestore().collection('requests').where('senderId', '==', userId).get();
          info(`Found ${requestSenderSnapshot.size} requests where user is sender`);
          
          if (!requestSenderSnapshot.empty) {
            for (const doc of requestSenderSnapshot.docs) {
              info(`Deleting sender request: ${doc.id}`);
              await doc.ref.delete();
            }
            info("Successfully deleted all sender requests");
          }
        } catch (senderError) {
          error("Failed to delete sender requests:", senderError);
          throw senderError;
        }

        // delete the user document
        info(`Deleting user document: ${userId}`);
        try {
          await userDoc.ref.delete();
          info("Successfully deleted user document");
          return { success: true, message: "User and associated data deleted successfully from firestore" };
        } catch (deleteError) {
          error("Failed to delete user document:", deleteError);
          throw deleteError;
        }
      }
      else {
        warn(`User data exists but isPaired is undefined or null. UserData: ${JSON.stringify(userData)}`);
        return { success: false, message: "User data is in an invalid state" };
      }
    }
    else {
      warn(`User document does not exist for ID: ${userId}`);
      return { success: false, message: "User does not exist" };
    }
  } catch (functionError) {
    error("Unexpected error in deleteUserData function:", functionError);
    const errorMessage = functionError instanceof Error ? functionError.message : String(functionError);
    return { success: false, message: `Delete operation failed: ${errorMessage}` };
  }
});