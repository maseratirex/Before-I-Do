/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall} from "firebase-functions/v2/https";
//import { collection, addDoc } from 'firebase/firestore';
//const  databaseURL  = require('firebase-functions/params');
//import * as logger from "firebase-functions/logger";
//import * as nodemailer from "nodemailer";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

/*
export const helloWorld = onRequest((request, response) => {
   logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
});*/

const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}


//const app = admin.initializeApp(firebaseConfig);
//const db = getFirestore(app);

export const pairRequest = onCall(async (request) => {
  const partnerEmail = request.data.email;
  const senderId = request.data.user;

  functions.logger.log("partner email recorded as:", partnerEmail);

  const partnerQuery = admin.firestore().collection("users").where("email", "==", partnerEmail);
  functions.logger.log("partnerQuery:", partnerQuery);
  partnerQuery.get().then(async (querySnapshot: { empty: any; docs: any[]; }) => {
    if (!querySnapshot.empty) {
      // Get just the one customer/user document
      const snapshot = querySnapshot.docs[0]
      // Reference of customer/user doc
      const partnerRef = snapshot.ref
      //partnerRef.update({ 'purchasedTemplateOne': true })
      functions.logger.log("User Document Updated:", partnerRef);
      

      //const requestsRef = admin.firestore().collection("requests");
      /*const collectionRef = collection(admin.firestore(), "requests");
      await addDoc(collectionRef, {
        recipientId: partnerRef.uid,
        senderId: functions.auth.user().uid,
        pairStatus: "pending",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });*/

      //functions.firestore

      const val = await admin.firestore().collection("requests").add({
        recipientId: partnerRef.id,
        //recipientId: "helloworld",
        senderId: senderId,
        pairStatus: "pending",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      functions.logger.log("Pair Request Sent:", val);

      return { success: true };
    }
    else {
      functions.logger.log("User Document Does Not Exist");
      return { success: false, message: "User does not exist" };
    }
  })
});

export const checkPairRequest = onCall(async (request) => {
  const userId = request.data.user;
  const senderEmails: string[] = [];

  const querySnapshot = await admin.firestore().collection('requests')
      .where('recipientId', '==', userId) // Add your query conditions
      .get();

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
        const documentData = doc.data();
        const documentId = doc.id;
        // Process each document here
        functions.logger.log(`Document ID: ${documentId}, Data:`, documentData);
        senderEmails.push(documentData.senderId)
      });
    } else {
      functions.logger.log('No matching documents found.');
    }

  /*const pairQuery = admin.firestore().collection("requests").where("recipientId", "==", userId).where("pairStatus", "==", "pending");
  
  pairQuery.get().docs.forEach((pairRequest: { data: () => { (): any; new(): any; senderEmail: string; }; }) => senderEmails.push(pairRequest.data().senderEmail));*/

  if (senderEmails.length > 0) {
    return { success: true, senderEmails };
  } else {
    return { success: false, message: "No pending pair requests." };
  }
  /*pairQuery.get().then((querySnapshot: { empty: any; docs: any[]; }) => {
    if (!querySnapshot.empty) {
      const senderEmails = [""];
      querySnapshot.docs.forEach((pairRequest: { ref: () => any; }) => {
        senderEmails.push(pairRequest.ref.senderEmail);
      });
      // Get just the one customer/user document
      const snapshot = querySnapshot.docs[0]
      // Reference of customer/user doc
      const partnerRef = snapshot.ref
      //partnerRef.update({ 'purchasedTemplateOne': true })
      //functions.logger.log("User Document Updated:", partnerRef);
      

      const requestsRef = admin.firestore().collection("requests");
      requestsRef.add({
        recipientId: partnerRef.uid,
        senderId: functions.auth.user().uid,
        pairStatus: "pending",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      return { success: true };
    }
    else {
      //functions.logger.log("User Document Does Not Exist");
      return { success: false, message: "User does not exist" };
    }
  })*/
});

/*
export const sendRequest = onCall(async (request) => {
  const email = request.data.email;

  if (!request || typeof email !== "string") {
    throw new Error("A valid email address is required.");
  }



  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your email provider
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "example@gmail.com",
      pass: "app password",
    },
  });

  const mailOptions = {
    from: "example@gmail.com", // Use environment variable
    to: email,
    subject: "Pairing Invitation",
    text: "You have been invited to pair with your partner on Before-I-Do.",
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    throw new Error("Failed to send email to " + email + ": " + (error instanceof Error ? error.message : String(error)));
  }
});*/
