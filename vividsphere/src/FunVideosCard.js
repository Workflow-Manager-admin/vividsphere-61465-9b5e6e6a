import React, { useEffect, useState } from "react";

/**
 * FunVideosCard
 * Card for Fun Videos – integrates YouTube Data API
 * previewMode (grid card) or expanded view
 */
// PUBLIC_INTERFACE
function FunVideosCard({ previewMode, onClick, onBack }) {
  const API_KEY = "AIzaSyAyzYDjGLWhQ0XMmHdLfhdpixKD_GOwAZo";
  const API_URL =
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=10&regionCode=US&key=${API_KEY}`;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(!previewMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!previewMode) {
      setLoading(true);
      setError(null);
      fetch(API_URL)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch videos");
          return r.json();
        })
        .then((data) => {
          setVideos(data.items || []);
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
        style={cardStyle("funvideos")}
        onClick={onClick}
        tabIndex={0}
        aria-label="Fun Videos Card"
        role="button"
        onKeyPress={e => (e.key === "Enter" ? onClick() : undefined)}
      >
        <span style={iconStyle("funvideos")}>🎥</span>
        <div style={{ fontWeight: 700, fontSize: "1.17rem" }}>Fun Videos</div>
        <div style={descStyle}>Watch trending and fun videos from YouTube's hottest list.</div>
      </div>
    );
  }

  // Expanded
  return (
    <section className="vs-section funvideos" style={sectionStyle}>
      <SectionHeader icon="🎥" color="var(--vs-funvideos)">Fun Videos</SectionHeader>
      <div style={descStyle}>Trending videos powered by <a href="https://youtube.com/" style={{ color: "var(--vs-funvideos)" }} target="_blank" rel="noreferrer">YouTube</a></div>
      {onBack && <button className="btn" style={backBtnStyle} onClick={onBack}>Back to Categories</button>}
      {loading && <div style={{ color: "var(--vs-funvideos)" }}>Loading videos…</div>}
      {error && <div style={{ color: "#d14343" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="vs-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px,1fr))", gap: 18, marginTop: 18 }}>
          {videos.length === 0
            ? <div>No videos found.</div>
            : videos.map(video => (
              <div key={video.id}
                style={{
                  background: "rgba(17,18,36,0.89)",
                  borderRadius: 10,
                  padding: 10,
                  border: "1px solid var(--vs-cardborder)",
                  display: "flex", flexDirection: "column", alignItems: "center", minHeight: 195
                }}
              >
                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer"
                  style={{ width: "100%", textDecoration: "none" }} title={video.snippet.title}>
                  <img src={video.snippet.thumbnails?.medium?.url || ""}
                    alt={video.snippet.title}
                    loading="lazy"
                    style={{
                      borderRadius: 8, width: "100%", minHeight: 105, maxHeight: 130, objectFit: "cover",
                      marginBottom: 7, background: "#222", aspectRatio: "16 / 9"
                    }} />
                </a>
                <div style={{ fontWeight: 600, fontSize: "0.98rem", color: "var(--vs-accent)", textAlign: "center" }}>
                  {video.snippet.title.length > 50 ? video.snippet.title.slice(0, 45) + "…" : video.snippet.title}
                </div>
                <div style={{ fontSize: "0.94rem", color: "var(--vs-carddarker)", marginBottom: 7 }}>
                  {video.snippet.channelTitle}
                </div>
                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer"
                  className="btn" style={btnStyle("funvideos")}>Watch</a>
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
    color: "var(--vs-funvideos)",
    textAlign: "center",
    padding: "32px 18px 20px 18px",
    border: "2px solid var(--vs-funvideos)",
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
    background: "var(--vs-funvideos)",
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
  background: "rgba(0,0,0,0.44)",
  padding: "2rem",
  borderRadius: "15px",
  margin: "24px auto",
  maxWidth: 1150,
  boxShadow: "0 9px 30px rgba(0,0,0,0.10)"
};
const backBtnStyle = {
  margin: "0 0 24px 0",
  background: "var(--vs-funvideos)",
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

export default FunVideosCard;
