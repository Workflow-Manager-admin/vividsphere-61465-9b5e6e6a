import React, { useEffect, useState } from "react";

/**
 * MoviesCard
 * Card to explore popular movies from TMDb API.
 * Supports previewMode (grid card) or full display.
 */
// PUBLIC_INTERFACE
function MoviesCard({ previewMode, onClick, onBack }) {
  const API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";
  const API_URL =
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(!previewMode); // Don't auto-load in preview
  const [error, setError] = useState(null);

  // Begin fetching only in expanded/full mode
  useEffect(() => {
    if (!previewMode) {
      setLoading(true);
      setError(null);
      fetch(API_URL)
        .then(r => {
          if (!r.ok) throw new Error("Failed to fetch movies");
          return r.json();
        })
        .then(data => {
          setMovies(data.results || []);
          setLoading(false);
        })
        .catch(e => {
          setError(e.message);
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [previewMode]);

  // Preview rendering
  if (previewMode) {
    return (
      <div
        className="vs-card"
        style={cardStyle("movies")}
        onClick={onClick}
        tabIndex={0}
        aria-label="Popular Movies card"
        role="button"
        onKeyPress={e => (e.key === "Enter" ? onClick() : undefined)}
      >
        <span style={iconStyle("movies")}>🎬</span>
        <div style={{ fontWeight: 700, fontSize: "1.17rem" }}>Popular Movies</div>
        <div style={descStyle}>See what's trending in cinemas right now.<br />Powered by TMDb.</div>
      </div>
    );
  }

  // Expanded rendering
  return (
    <section className="vs-section movies" style={sectionStyle}>
      <SectionHeader icon="🎬" color="var(--vs-movie)">Popular Movies</SectionHeader>
      <div style={descStyle}>Movies from <a href="https://themoviedb.org/" target="_blank" rel="noreferrer" style={{ color: "var(--vs-movie)" }}>TMDb</a></div>
      {onBack && <button className="btn" style={backBtnStyle} onClick={onBack}>Back to Categories</button>}
      {loading && <div style={{ color: "var(--vs-movie)" }}>Loading movies…</div>}
      {error && <div style={{ color: "#d14343" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="vs-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 18, marginTop: 18 }}>
          {movies.length === 0
            ? <div>No movies found.</div>
            : movies.slice(0, 12).map(movie => (
              <div key={movie.id}
                style={{
                  background: "rgba(17,20,40,0.81)",
                  borderRadius: 10,
                  padding: 10,
                  border: "1px solid var(--vs-cardborder)",
                  display: "flex", flexDirection: "column", alignItems: "center", minHeight: 290
                }}
              >
                {movie.poster_path
                  ? <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title}
                    loading="lazy" style={{
                      borderRadius: 8, width: "100%", minHeight: 168, objectFit: "cover", marginBottom: 7, background: "#222"
                    }} />
                  : <div style={{ height: 168, width: "100%", background: "#222", marginBottom: 7, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>No Image</div>}
                <div style={{ fontWeight: 600, fontSize: "1.04rem", color: "var(--vs-accent)", textAlign: "center" }}>{movie.title}</div>
                <div style={{ fontSize: "0.92rem", color: "var(--vs-carddarker)", marginBottom: 8, marginTop: 2 }}>{movie.release_date}</div>
                <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noreferrer"
                  className="btn" style={btnStyle("movies")}>Details</a>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

// Helper for card colors/icons
function cardStyle(type) {
  return {
    cursor: "pointer",
    borderRadius: 13,
    background: "var(--vs-card)",
    boxShadow: "0 3px 9px rgba(0,0,0,0.10)",
    color: "var(--vs-movie)",
    textAlign: "center",
    padding: "32px 18px 20px 18px",
    border: "2px solid var(--vs-movie)",
    minHeight: 210,
    outline: "none",
    position: "relative",
    transition: "transform 0.12s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };
}
function iconStyle(type) {
  return { fontSize: 40, marginBottom: 10, display: "block" };
}
const descStyle = { color: "var(--vs-carddarker)", margin: "11px 0 0 0", fontSize: "1.01rem" };
function btnStyle(type) {
  return {
    background: "var(--vs-movie)",
    color: "#fff",
    borderRadius: 4,
    padding: "6px 13px",
    border: "none",
    marginTop: 7,
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    textDecoration: "none",
    transition: "background 0.14s"
  };
}
const sectionStyle = {
  background: "rgba(0,0,0,0.55)",
  padding: "2rem",
  borderRadius: "15px",
  margin: "24px auto",
  maxWidth: 1150,
  boxShadow: "0 9px 30px rgba(0,0,0,0.07)"
};
const backBtnStyle = {
  margin: "0 0 24px 0",
  background: "var(--vs-movie)",
  color: "#fff"
};
// Section header with icon
function SectionHeader({ icon, color, children }) {
  return (
    <h2 style={{ color, fontWeight: 700, display: "flex", gap: 12, alignItems: "center", margin: 0, fontSize: "1.9rem" }}>
      <span aria-label="" style={{ fontSize: 36, display: "inline" }}>{icon}</span>
      <span>{children}</span>
    </h2>
  );
}

export default MoviesCard;
