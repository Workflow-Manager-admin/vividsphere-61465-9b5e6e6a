import React, { useEffect, useState } from "react";

/**
 * FunVideosCard
 * Card for Fun Videos – integrates YouTube Data API
 * previewMode (grid card) or expanded view
 */
// PUBLIC_INTERFACE
function FunVideosCard({ previewMode, onClick, onBack }) {
  // YouTube Data API configuration.
  // Replace API_KEY for production with env variable or backend proxy for security.
  const API_KEY = "AIzaSyAyzYDjGLWhQ0XMmHdLfhdpixKD_GOwAZo";

  // Define relevant search queries for Tamil and English fun videos + well-known creators.
  const SEARCH_TERMS = [
    "Parthibangal",
    "Tamil fun",
    "Tamil comedy",
    "Tamil funny",
    "Tamil prank",
    "English comedy",
    "Indian comedy",
    "Indian standup comedy",
    "Comedy sketches India",
    "VJ Siddhu Tamil",
    "Black Sheep Tamil",
    "Village cooking comedy",
    "Chennai Memes",
    "Comedy Raja Tamil",
    "Fun Vines",
    "Random Tamil Fun",
    "Rowdy Baby Tamil Comedy"
  ];

  // Effect for expanded mode: fetch video results for all queries.
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(!previewMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (previewMode) return;
    setVideos([]);
    setLoading(true);
    setError(null);

    // Fetches videos for all queries then deduplicates by videoId.
    const fetchFunVideos = async () => {
      try {
        // Parallel search requests (limit maxResults for quota/UX).
        // 'videoEmbeddable' ensures we get embeddable results; type=video filters out channels/playlists.
        const searchFetches = SEARCH_TERMS.map(term =>
          fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(term)}&videoEmbeddable=true&key=${API_KEY}`
          )
            .then(r => {
              if (!r.ok) throw new Error(`Failed for term: ${term}`);
              return r.json();
            })
            .then(data => Array.isArray(data.items) ? data.items : [])
            .catch(() => []) // Fail softly for individual terms
        );
        // Await all results
        const resultsArrays = await Promise.all(searchFetches);
        // Flatten and deduplicate videos by videoId (from search API: id.videoId)
        const flat = [].concat(...resultsArrays);
        const seen = new Set();
        const videosList = [];
        for (const item of flat) {
          const vid = item?.id?.videoId;
          if (vid && !seen.has(vid)) {
            seen.add(vid);
            // Normalize structure to {id, snippet} for consistency
            videosList.push({
              id: vid,
              snippet: item.snippet
            });
          }
        }
        setVideos(videosList);
        setLoading(false);
      } catch (e) {
        setError(
          "Could not load fun videos. Please try again later." +
            (e.message ? ` (${e.message})` : "")
        );
        setLoading(false);
      }
    };

    fetchFunVideos();
    // eslint-disable-next-line
  }, [previewMode]);

  // Preview
  if (previewMode) {
    // Preview card: non-interactive.
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
        <div style={descStyle}>
          Enjoy Tamil and English comedy clips, viral sketches, and fun content including top creators!
        </div>
      </div>
    );
  }

  // Expanded
  return (
    <section className="vs-section funvideos" style={sectionStyle}>
      <SectionHeader icon="🎥" color="var(--vs-funvideos)">
        Tamil &amp; English Fun Videos
      </SectionHeader>
      <div style={descStyle}>
        Curated laughter and fun from <b>Tamil</b> &amp; <b>English</b> creators.<br />
        Powered by <a href="https://youtube.com/" style={{ color: "var(--vs-funvideos)" }} target="_blank" rel="noreferrer">YouTube</a>.
      </div>
      {onBack && <button className="btn" style={backBtnStyle} onClick={onBack}>Back to Categories</button>}
      {loading && <div style={{ color: "var(--vs-funvideos)" }}>Loading fun videos…</div>}
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
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: "100%", textDecoration: "none" }}
                  title={video.snippet.title}
                >
                  <img
                    src={video.snippet.thumbnails?.medium?.url || ""}
                    alt={video.snippet.title}
                    loading="lazy"
                    style={{
                      borderRadius: 8,
                      width: "100%",
                      minHeight: 105,
                      maxHeight: 130,
                      objectFit: "cover",
                      marginBottom: 7,
                      background: "#222",
                      aspectRatio: "16 / 9"
                    }}
                  />
                </a>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.98rem",
                    color: "var(--vs-accent)",
                    textAlign: "center"
                  }}
                  title={video.snippet.title}
                >
                  {video.snippet.title.length > 50 ? video.snippet.title.slice(0, 45) + "…" : video.snippet.title}
                </div>
                <div style={{ fontSize: "0.94rem", color: "var(--vs-carddarker)", marginBottom: 7 }}>
                  {video.snippet.channelTitle}
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={btnStyle("funvideos")}
                  aria-label={`Watch ${video.snippet.title}`}
                >
                  Watch
                </a>
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
