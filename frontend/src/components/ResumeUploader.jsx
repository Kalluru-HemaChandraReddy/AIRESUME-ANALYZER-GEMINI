import { useState } from "react";
import axios from "axios";
import "./ResumeUploader.css";

function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const rawAnalysis = response.data.analysis || "⚠ No analysis from AI";
      setText(response.data.extractedText || "⚠ No text extracted");
      setAnalysis(rawAnalysis);

      // Extract rating like "7/10"
      const ratingMatch = rawAnalysis.match(/([0-9]{1,2}\/10)/);
      if (ratingMatch) setRating(ratingMatch[1]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  // Parse summary into different categories
  const getKeyStrengths = () => {
    const lines = analysis.split("\n");
    return lines.filter((l) =>
      l.toLowerCase().includes("strength")
    );
  };

  const getUpskills = () => {
    const lines = analysis.split("\n");
    return lines.filter((l) =>
      l.toLowerCase().includes("improve") || l.toLowerCase().includes("upskill")
    );
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="logo-title">
          <img
            src="https://img.icons8.com/?size=512&id=59664&format=png"
            alt="Logo"
            className="logo"
          />
          <h1 className="title">Resume Analyzer</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <h2 className="hero-heading">ATS Resume Score Checker</h2>
        <p className="hero-subtext">
          Upload your resume and get instant AI-powered feedback.
        </p>
      </section>

      {/* Upload */}
      <main className="main">
        <div className="upload-card">
          <h3>Upload Resume (PDF only)</h3>
          <input type="file" onChange={handleFileChange} className="file-input" />
          <button onClick={handleUpload} disabled={loading} className="upload-btn">
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </div>

        {/* Results */}
        {analysis && (
          <div className="results-grid">
            {/* Well Tried */}
            <div className="card">
              <h3>🎯 Well Tried</h3>
              <p>
                Good attempt! The AI has analyzed your resume and highlighted
                its strengths and areas of improvement.
              </p>
            </div>

            {/* Rating */}
            <div className="card rating-card">
              <h3>📊 Resume Rating</h3>
              <div className="rating-circle">
                <span>{rating || "N/A"}</span>
              </div>
            </div>

            {/* Key Strengths */}
            <div className="card">
              <h3>✅ Key Strengths</h3>
              <ul>
                {getKeyStrengths().length > 0 ? (
                  getKeyStrengths().map((s, i) => <li key={i}>{s}</li>)
                ) : (
                  <li>No key strengths identified</li>
                )}
              </ul>
            </div>

            {/* Areas to Upskill */}
            <div className="card">
              <h3>📌 Areas to Upskill</h3>
              <ul>
                {getUpskills().length > 0 ? (
                  getUpskills().map((s, i) => <li key={i}>{s}</li>)
                ) : (
                  <li>No upskill areas identified</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Extracted Text */}
        {text && (
          <details className="extracted-text">
            <summary>📄 View Extracted Resume Text</summary>
            <pre>{text}</pre>
          </details>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Resume Analyzer | Built with ❤️</p>
        <div className="social-links">
          <a href="mailto:hemachandra693@gmail.com" target="_blank" rel="noreferrer">
            <img src="https://img.icons8.com/color/48/000000/gmail.png" alt="Gmail" />
          </a>
          <a href="https://github.com/Kalluru-HemaChandraReddy" target="_blank" rel="noreferrer">
            <img src="https://img.icons8.com/material-outlined/48/ffffff/github.png" alt="GitHub" />
          </a>
          <a href="https://www.linkedin.com/in/hemachandrakalluru" target="_blank" rel="noreferrer">
            <img src="https://img.icons8.com/fluency/48/000000/linkedin.png" alt="LinkedIn" />
          </a>
          <a href="https://www.instagram.com/hemachandrakalluru/" target="_blank" rel="noreferrer">
            <img src="https://img.icons8.com/fluency/48/000000/instagram-new.png" alt="Instagram" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default ResumeUploader;
