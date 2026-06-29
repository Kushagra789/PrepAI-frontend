import ScoreCard from "./ScoreCard";

function Dashboard({ result }) {
  return (
    <div className="dashboard-grid">
      
      <ScoreCard
        title="Resume Score"
        value={`${result.score.resume_score}/100`}
        icon="📊"
        color="green"
      />

      <ScoreCard
        title="ATS Score"
        value={`${result.ats_score.ATS_score}/100`}
        icon="🎯"
        color="#2563eb"
      />

      <ScoreCard
        title="Skills"
        value={result.skills.length}
        icon="💻"
        color="#f97316"
      />

      <ScoreCard
        title="Projects"
        value={result.projects.length}
        icon="📂"
        color="#9333ea"
      />

    </div>
  );
}

export default Dashboard;