const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// --- SMTP setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gundayajaysash@gmail.com",        // <-- your Gmail
    pass: "09268497457jaysash",          // <-- App Password
  },
});

// --- Function to send email when a new pending user signs up ---
exports.sendApprovalEmail = functions.firestore
    .document("pending_users/{pending_userId}")
    .onCreate(async (snap, context) => {
      const userData = snap.data();
      const userId = context.params.pending_userId;
 // ✅ must match path variable

      const approveLink = `https://us-central1-bugta-13358.cloudfunctions.net/httpApproveUser?uid=${userId}`;
      const rejectLink  = `https://us-central1-bugta-13358.cloudfunctions.net/httpRejectUser?uid=${userId}`;

      const mailOptions = {
        from: "bugta.app@gmail.com",
        to: "gundayajaysash@gmail.com", // admin only
        subject: "New User Approval Needed",
        html: `
          <p>Hello Admin,</p>
          <p>A new user signed up:</p>
          <ul>
            <li>Name: ${userData.fullName || "N/A"}</li>
            <li>Email: ${userData.email || "N/A"}</li>
          </ul>
          <p>Please approve or reject this account:</p>
          <p><a href="${approveLink}">Approve</a> | <a href="${rejectLink}">Reject</a></p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Approval email sent to admin for:", userData.email);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    });


// --- Reject User Function ---
exports.httpRejectUser = functions.https.onRequest(async (req, res) => {
  const uid = req.query.uid;

  if (!uid) return res.status(400).send("Missing UID");

  try {
    // Delete user from Auth
    await admin.auth().deleteUser(uid);

    // Update status in Firestore
    await admin.firestore().doc(`pending_users/${uid}`).update({ status: "rejected" });

    res.send("User rejected successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error rejecting user");
  }
});
