import React from "react";

/**
 * HouseholdCard
 * Card for Household Tutorials – this is a placeholder with sample content.
 * previewMode (grid card) or expanded mode with clickable sample tutorials.
 */
// PUBLIC_INTERFACE
function HouseholdCard({ previewMode, onClick, onBack }) {
  const sampleTutorials = [
    {
      title: "How to Fix a Leaky Faucet",
      desc: "Step-by-step basics to diagnose and fix most common kitchen and bathroom faucet leaks.",
      video: "https://www.youtube.com/watch?v=9pugY0nkaJk"
    },
    {
      title: "DIY: Organize Your Closet",
      desc: "Simple, smart tips to declutter and neatly organize your wardrobe for any season.",
      video: "https://www.youtube.com/watch?v=5DlFSy9RipQ"
    },
    {
      title: "Wall Patching Basics",
      desc: "Learn how to repair holes and dings in drywall for a fresh, clean look.",
      video: "https://www.youtube.com/watch?v=13m0g7ALGJ8"
    },
    {
      title: "Unclog a Drain",
      desc: "Quick methods to safely clear most sink and tub clogs—no plumber required.",
      video: "https://www.youtube.com/watch?v=XbW_Ds9V6RM"
    }
  ];

  // Preview card for the grid
  if (previewMode) {
    return (
      <div
        className="vs-card"
        style={cardStyle("household")}
        onClick={onClick}
        tabIndex={0}
        aria-label="Household Tutorials Card"
        role="button"
        onKeyPress={e => (e.key === "Enter" ? onClick() : undefined)}
      >
        <span style={iconStyle("household")}>🏠</span>
        <div style={{ fontWeight: 700, fontSize: "1.17rem" }}>Household Tutorials</div>
        <div style={descStyle}>DIY tips, help, and home improvement basics for everyone.</div>
      </div>
    );
  }

  // Expanded: shows static sample list
  return (
    <section className="vs-section household" style={sectionStyle}>
      <SectionHeader icon="🏠" color="var(--vs-household)">Household Tutorials</SectionHeader>
      <div style={descStyle}>Explore quick and easy guides for home improvement and maintenance!</div>
      {onBack && <button className="btn" style={backBtnStyle} onClick={onBack}>Back to Categories</button>}
      <div className="vs-row" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px,1fr))",
        gap: 18,
        marginTop: 18
      }}>
        {sampleTutorials.map((tut, idx) => (
          <div
            key={idx}
            style={{
              background: "rgba(16,17,27,0.89)",
              borderRadius: 10,
              padding: 12,
              border: "1.5px solid var(--vs-household)",
              display: "flex", flexDirection: "column", alignItems: "center",
              textAlign: "center", minHeight: 140
            }}
          >
            <div style={{ fontWeight: 700, color: "var(--vs-accent)", fontSize: "1.03rem", marginBottom: 7 }}>
              {tut.title}
            </div>
            <div style={{
              color: "var(--vs-carddarker)",
              fontSize: "0.96rem",
              marginBottom: 9
            }}>
              {tut.desc}
            </div>
            <a
              href={tut.video}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={btnStyle("household")}
            >
              Watch Tutorial
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function cardStyle(type) {
  return {
    cursor: "pointer",
    borderRadius: 13,
    background: "var(--vs-card)",
    boxShadow: "0 3px 9px rgba(0,0,0,0.10)",
    color: "var(--vs-household)",
    textAlign: "center",
    padding: "32px 18px 20px 18px",
    border: "2px solid var(--vs-household)",
    minHeight: 210,
    outline: "none",
    position: "relative",
    transition: "transform 0.12s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };
}
function iconStyle(type) { return { fontSize: 40, marginBottom: 10 }; }
const descStyle = { color: "var(--vs-carddarker)", margin: "11px 0 0 0", fontSize: "1.01rem" };
function btnStyle(type) {
  return {
    background: "var(--vs-household)",
    color: "#fff",
    borderRadius: 4,
    padding: "6px 13px",
    border: "none",
    marginTop: 7,
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    textDecoration: "none"
  };
}
const sectionStyle = {
  background: "rgba(0,0,0,0.37)",
  padding: "2rem",
  borderRadius: "15px",
  margin: "24px auto",
  maxWidth: 1150,
  boxShadow: "0 9px 30px rgba(0,0,0,0.08)"
};
const backBtnStyle = {
  margin: "0 0 24px 0",
  background: "var(--vs-household)",
  color: "#fff"
};
function SectionHeader({ icon, color, children }) {
  return (
    <h2 style={{ color, fontWeight: 700, display: "flex", gap: 12, alignItems: "center", margin: 0, fontSize: "1.9rem" }}>
      <span aria-label="" style={{ fontSize: 36, display: "inline" }}>{icon}</span>
      <span>{children}</span>
    </h2>
  );
}

export default HouseholdCard;
