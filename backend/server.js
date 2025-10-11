import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Improved CORS
app.use(cors({ 
  origin: process.env.FRONTEND_URL || "*"
}));

app.use(express.json());

// Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// SMTP setup for Hostinger
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ✅ Main endpoint with validation
app.post("/api/joint-beta", async (req, res) => {
  const d = req.body;

  // ✅ Validate required fields
  if (!d.name || !d.email || !d.phone || !d.communityName || 
      !d.communityType || !d.groupSize || !d.useCase || !d.timeline) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required" 
    });
  }

  // ✅ Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(d.email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid email address" 
    });
  }

  try {
    // 1️⃣ Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            d.name,
            d.email,
            d.phone,
            d.communityName,
            d.communityType,
            d.groupSize,
            d.useCase,
            d.timeline,
            new Date().toLocaleString(),
          ],
        ],
      },
    });

    // 2️⃣ Send confirmation email
    await transporter.sendMail({
      from: `"Connectbees Beta" <${process.env.MAIL_USER}>`,
      to: d.email,
      subject: "🎉 Thanks for Joining the Connectbees Beta!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${d.name},</h2>
          <p>Thank you for joining the Connectbees Beta program! 🐝</p>
          <p>We've received your application for "<strong>${d.communityName}</strong>".</p>
          <p>Our team will review your request and get in touch soon.</p>
          <br>
          <p>Warm regards,<br>
          <strong>The Connectbees Team</strong><br>
          <a href="https://connectbees.in">https://connectbees.in</a></p>
        </div>
      `,
      text: `Hi ${d.name},\n\nThank you for joining the Connectbees Beta program! 🐝\nWe've received your application for "${d.communityName}".\nOur team will review your request and get in touch soon.\n\nWarm regards,\n— The Connectbees Team\nhttps://connectbees.in`,
    });

    console.log(`✅ Application received from ${d.email}`);
    
    res.json({ 
      success: true, 
      message: "Application submitted successfully" 
    });
    
  } catch (err) {
    console.error("❌ Error:", err.message);
    
    // ✅ Better error handling
    if (err.code === 'EAUTH') {
      return res.status(500).json({ 
        success: false, 
        message: "Email service error. Please contact support." 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to process your application. Please try again later." 
    });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Endpoint not found" 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));