function ScoreCard({ title, value, icon, color }) {
  return (
    <div
      className="score-card"
      style={{
        borderTop: `4px solid ${color}`,
      }}
    >
      {/* ICON */}
      <div className="score-icon" style={{ background: color }}>
        {icon}
      </div>

      {/* CONTENT */}
      <div className="score-content">
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default ScoreCard;