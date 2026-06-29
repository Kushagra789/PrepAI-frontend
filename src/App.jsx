import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!file) return alert("Please select a resume");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "https://prepai-backend-7hr4.onrender.com/upload-resume/",
        formData
      );

      setResult(res.data);
    } catch (err) {
      console.log(err);
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>PrepAI</h2>

        <div className="menu">
          <p>Dashboard</p>
          <p>Resume Analysis</p>
          <p>ATS Score</p>
          <p>Profile</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        <div className="header">
          <h1>Resume Intelligence Dashboard</h1>
        </div>

        {/* UPLOAD */}
        {!result && (
          <div className="uploadBox">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={uploadResume}>
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        )}

        {/* DASHBOARD */}
        {result && (
          <div className="dashboard">

            {/* TOP CARDS */}
            <div className="cards">

              <div className="card">
                <h3>Resume Score</h3>
                <h1>{result.score.resume_score}/100</h1>
              </div>

              <div className="card">
                <h3>ATS Score</h3>
                <h1>{result.ats_score.ATS_score}/100</h1>
              </div>

              <div className="card">
                <h3>Skills</h3>
                <h1>{result.skills.length}</h1>
              </div>

              <div className="card">
                <h3>Projects</h3>
                <h1>{result.projects.length}</h1>
              </div>

            </div>

            {/* PROFILE */}
            <div className="section">
              <h2>Candidate Profile</h2>
              <p><b>Name:</b> {result.candidate_name}</p>
              <p><b>Email:</b> {result.contact_info.email}</p>
              <p><b>Phone:</b> {result.contact_info.phone}</p>
            </div>

            {/* SKILLS */}
            <div className="section">
              <h2>Skills</h2>
              <div className="tagBox">
                {result.skills.map((s, i) => (
                  <span key={i} className="tag">{s}</span>
                ))}
              </div>
            </div>

            {/* PROJECTS */}
            <div className="section">
              <h2>Projects</h2>
              <ul>
                {result.projects.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* AI FEEDBACK */}
            <div className="section">
              <h2>AI Feedback</h2>
              <ul>
                {result.ai_feedback.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* ATS BREAKDOWN */}
            <div className="section">
              <h2>ATS Breakdown</h2>

              <p>Keyword Match</p>
              <div className="bar">
                <div style={{ width: `${result.ats_score.details.keyword_match}%` }}></div>
              </div>

              <p>Education Score</p>
              <div className="bar">
                <div style={{ width: `${result.ats_score.details.education_score}%` }}></div>
              </div>

              <p>Project Score</p>
              <div className="bar">
                <div style={{ width: `${result.ats_score.details.project_score}%` }}></div>
              </div>

              <p>Experience Score</p>
              <div className="bar">
                <div style={{ width: `${result.ats_score.details.experience_score}%` }}></div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;