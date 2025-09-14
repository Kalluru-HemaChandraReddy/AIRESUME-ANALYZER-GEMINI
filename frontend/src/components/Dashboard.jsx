import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/resumes")
      .then((res) => setResumes(res.data))
      .catch((err) => console.error("Error fetching resumes:", err));
  }, []);

  return (
    <div className="dashboard">
      <h2>📂 Resume Analysis History</h2>
      {resumes.length === 0 ? (
        <p>No resumes analyzed yet.</p>
      ) : (
        <table className="resume-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Filename</th>
              <th>Rating</th>
              <th>Uploaded At</th>
              <th>Extracted Text</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume.id}>
                <td>{resume.id}</td>
                <td>{resume.filename}</td>
                <td>{resume.rating || "N/A"}</td>
                <td>{new Date(resume.uploaded_at).toLocaleString()}</td>
                <td>
                  <details>
                    <summary>View Text</summary>
                    <pre>{resume.extracted_text}</pre>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
