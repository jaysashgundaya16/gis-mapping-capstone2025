const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// 🔥 SAFE PROJECT ID (Fix for broken email links)
const projectId =
  process.env.GCP_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  JSON.parse(process.env.FIREBASE_CONFIG).projectId;

// ----- EMAIL TRANSPORTER -----
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gundayajaysash@gmail.com",
    pass: "vxvmonozllrbswbe", // APP PASSWORD ONLY
  },
});

// ----- SEND EMAIL TO ADMIN WHEN USER SIGNS UP -----
exports.sendApprovalEmail = functions.firestore
  .document("pending_users/{pending_userId}")
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const uid = context.params.pending_userId;

    // 🔥 FIXED LINKS
    const approveLink = `https://us-central1-${projectId}.cloudfunctions.net/httpApproveUser?uid=${uid}`;
    const rejectLink = `https://us-central1-${projectId}.cloudfunctions.net/httpRejectUser?uid=${uid}`;

    const mailOptions = {
      from: "jaysashgundaya17@gmail.com",
      to: "gundayajaysash@gmail.com", // Admin email
      subject: "BUGTA – New User Signup Pending Approval",
      html: `
        <p><b>New user registration request:</b></p>
        <ul>
          <li>Name: ${userData.fullName}</li>
          <li>Email: ${userData.email}</li>
        </ul>

        <p><b>Select an action:</b></p>

        <p>
          <a href="${approveLink}"
            style="
              padding: 10px 16px;
              background: green;
              color: white;
              text-decoration: none;
              font-weight: bold;
              border-radius: 6px;
            "
          >APPROVE</a>
        </p>

        <p>
          <a href="${rejectLink}"
            style="
              padding: 10px 16px;
              background: red;
              color: white;
              text-decoration: none;
              font-weight: bold;
              border-radius: 6px;
            "
          >REJECT</a>
        </p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Approval email sent for:", userData.email);
    } catch (error) {
      console.error("Email sending error:", error);
    }
  });

// ----- APPROVE USER -----
exports.httpApproveUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const uid = req.query.uid;
    if (!uid) return res.status(400).send("Missing UID");

    try {
      const userDoc = admin.firestore().doc(`pending_users/${uid}`);
      const userData = (await userDoc.get()).data();

      if (!userData)
        return res.status(404).send("User not found in pending list");

      await admin.firestore().doc(`approved_users/${uid}`).set({
        ...userData,
        status: "approved",
        approvedAt: new Date(),
      });

      await admin.auth().updateUser(uid, { disabled: false });

      await userDoc.delete();

      res.send("User APPROVED successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error approving user");
    }
  });
});

// ----- REJECT USER -----
exports.httpRejectUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const uid = req.query.uid;
    if (!uid) return res.status(400).send("Missing UID");

    try {
      await admin.auth().deleteUser(uid);

      await admin.firestore().doc(`pending_users/${uid}`).update({
        status: "rejected",
        rejectedAt: new Date(),
      });

      res.send("User REJECTED successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error rejecting user");
    }
  });
});
