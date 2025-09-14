// server.cjs
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mysql = require("mysql2");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Multer setup
const upload = multer({ dest: "uploads/" });

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fail@2022", // 🔑 put your MySQL root password
  database: "resume_analyzer",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database!");
  }
});

// ✅ Helper: extract text from PDF/DOCX
async function extractText(filePath, fileName) {
  if (fileName.endsWith(".pdf")) {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  } else if (fileName.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  return "⚠ Unsupported file type";
}

// ✅ Upload route
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Extract text
    const extractedText = await extractText(filePath, fileName);
    console.log("📄 Extracted Text Sample:", extractedText.substring(0, 200));

    // Fake AI analysis (replace with LLM later)
    const analysis = `
Resume Analysis for ${fileName}
Strengths: Good formatting, Clear structure
Areas to Improve: Add more technical skills, Mention projects in detail
Resume Rating: 7/10
`;

    // Extract rating from analysis
    const ratingMatch = analysis.match(/([0-9]{1,2})\/10/);
    const rating = ratingMatch ? ratingMatch[1] : null;

    // Save to DB
    const sql =
      "INSERT INTO resumes (filename, extracted_text, rating) VALUES (?, ?, ?)";
    db.query(sql, [fileName, extractedText, rating], (err, result) => {
      if (err) {
        console.error("❌ DB Insert Error:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }
      console.log("✅ Resume saved with ID:", result.insertId);

      // ✅ Send both extracted text & analysis
      res.json({
        message: "Resume uploaded & analyzed successfully!",
        resumeId: result.insertId,
        fileName,
        rating,
        extractedText,
        analysis,
      });
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

// ✅ Get resumes
app.get("/resumes", (req, res) => {
  const sql = "SELECT * FROM resumes ORDER BY uploaded_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching resumes:", err);
      return res.status(500).json({ error: "Failed to fetch resumes" });
    }
    res.json(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
