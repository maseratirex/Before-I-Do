/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest, onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as nodemailer from "nodemailer";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
   logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
});

export const sendEmail = onCall(async (request) => {
  const email = request.data.email;

  if (!request || typeof email !== "string") {
    throw new Error("A valid email address is required.");
  }

  const transporter = nodemailer.createTransport({
    },
  });

  const mailOptions = {
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
});
