import React, { useEffect, useState } from "react";

/**
 * DrawingCard
 * Card for Drawing Illustrations – integrates Pixabay illustrations API.
 * previewMode (grid card), else full display.
 */
// PUBLIC_INTERFACE
function DrawingCard({ previewMode, onClick, onBack }) {
  const API_KEY = "50872548-89422cf3e7d17f61dfcb44fd6";
  const API_URL =
    `https://pixabay.com/api/?key=${API_KEY}&category=illustrations&image_type=illustration&per_page=12`;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(!previewMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!previewMode) {
      setLoading(true);
      setError(null);
      fetch(API_URL)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch illustrations");
          return r.json();
        })
        .then((data) => {
          setImages(data.hits || []);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message);
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [previewMode]);

  // Preview
  if (previewMode) {
    return (
      <div
        className="vs-card"
        style={cardStyle("drawing")}
        onClick={onClick}
        tabIndex={0}
        aria-label="Drawing Illustrations Card"
        role="button"
        onKeyPress={e => (e.key === "Enter" ? onClick() : undefined)}
      >
        <span style={iconStyle("drawing")}>🎨</span>
        <div style={{ fontWeight: 700, fontSize: "1.17rem" }}>Drawing Illustrations</div>
        <div style={descStyle}>Fresh illustrations from Pixabay to inspire your creativity.</div>
      </div>
    );
  }

  // Expanded
  return (
    <section className="vs-section drawing" style={sectionStyle}>
      <SectionHeader icon="🎨" color="var(--vs-accent)">Drawing Illustrations</SectionHeader>
      <div style={descStyle}>Selected illustrations sourced from <a href="https://pixabay.com/" style={{ color: "var(--vs-drawing)" }} target="_blank" rel="noreferrer">Pixabay</a></div>
      {onBack && <button className="btn" style={backBtnStyle} onClick={onBack}>Back to Categories</button>}
      {loading && <div style={{ color: "var(--vs-drawing)" }}>Loading illustrations…</div>}
      {error && <div style={{ color: "#d14343" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="vs-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px,1fr))", gap: 18, marginTop: 18 }}>
          {images.length === 0
            ? <div>No illustrations found.</div>
            : images.map(img => (
              <div key={img.id}
                style={{
                  background: "rgba(17,20,40,0.84)",
                  borderRadius: 10,
                  padding: 10,
                  border: "1px solid var(--vs-cardborder)",
                  display: "flex", flexDirection: "column", alignItems: "center", minHeight: 180
                }}
              >
                <img src={img.webformatURL}
                  alt={img.tags}
                  loading="lazy"
                  style={{
                    borderRadius: 8, width: "100%", minHeight: 95, objectFit: "cover", marginBottom: 7, background: "#222"
                  }} />
                <div style={{ fontWeight: 600, fontSize: "0.98rem", color: "var(--vs-accent)", textAlign: "center" }}>{img.tags.split(",").slice(0, 2).join(", ")}</div>
                <a href={img.pageURL} target="_blank" rel="noreferrer"
                  className="btn" style={btnStyle("drawing")}>Source</a>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

function cardStyle(type) {
  return {
    cursor: "pointer",
    borderRadius: 13,
    background: "var(--vs-card)",
    boxShadow: "0 3px 9px rgba(0,0,0,0.10)",
    color: "var(--vs-drawing)",
    textAlign: "center",
    padding: "32px 18px 20px 18px",
    border: "2px solid var(--vs-drawing)",
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
    background: "var(--vs-drawing)",
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
  background: "rgba(0,0,0,0.46)",
  padding: "2rem",
  borderRadius: "15px",
  margin: "24px auto",
  maxWidth: 1150,
  boxShadow: "0 9px 30px rgba(0,0,0,0.08)"
};
const backBtnStyle = {
  margin: "0 0 24px 0",
  background: "var(--vs-drawing)",
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

export default DrawingCard;
