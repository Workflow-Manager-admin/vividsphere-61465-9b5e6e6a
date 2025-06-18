import React, { useEffect, useState } from "react";

/**
 * MoviesCard
 * Card to explore popular movies from TMDb API.
 * Supports previewMode (grid card) or full display.
 */
// PUBLIC_INTERFACE
function MoviesCard({ previewMode, onClick, onBack }) {
  const API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";
  // Use 'language=ta' for Tamil, and region IN. Include both parameters, fetch more results.
  // Show a mix of trending/discover for better Tamil coverage.
  const TAMIL_DISCOVER_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ta&region=IN&with_original_language=ta&sort_by=popularity.desc&page=1`;
  const TAMIL_TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=ta&region=IN`;
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(!previewMode); // Don't auto-load in preview
  const [error, setError] = useState(null);

  // Fetch Tamil movies from both endpoints and dedupe.
  useEffect(() => {
    if (!previewMode) {
      setLoading(true);
      setError(null);
      Promise.all([
        fetch(TAMIL_DISCOVER_URL)
          .then(r => {
            if (!r.ok) throw new Error("TMDb discover failed");
            return r.json();
          })
          .then(data => Array.isArray(data.results) ? data.results : [])
          .catch(() => []),
        fetch(TAMIL_TRENDING_URL)
          .then(r => {
            if (!r.ok) throw new Error("TMDb trending failed");
            return r.json();
          })
          .then(data => Array.isArray(data.results) ? data.results : [])
          .catch(() => [])
      ])
        .then(([discoverResults, trendingResults]) => {
          // Deduplicate by movie ID, prefer trending first
          const combined = [...(trendingResults || []), ...(discoverResults || [])];
          const seen = new Set();
          const moviesDeduped = [];
          for (const movie of combined) {
            if (movie && movie.id && !seen.has(movie.id)) {
              seen.add(movie.id);
              moviesDeduped.push(movie);
            }
          }
          setMovies(moviesDeduped);
          setLoading(false);
        })
        .catch(e => {
          setError(e.message || "Failed to fetch Tamil movies");
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
        aria-label="Tamil Movies card"
        role="button"
        onKeyPress={e => (e.key === "Enter" ? onClick() : undefined)}
      >
        <span style={iconStyle("movies")}>🎬</span>
        <div style={{ fontWeight: 700, fontSize: "1.17rem" }}>Tamil Movies</div>
        <div style={descStyle}>Popular and trending movies in Tamil.<br />Powered by TMDb.</div>
      </div>
    );
  }

  // Expanded rendering
  return (
    <section className="vs-section movies" style={sectionStyle}>
      <SectionHeader icon="🎬" color="var(--vs-movie)">Tamil Movies</SectionHeader>
      <div style={descStyle}>Movies in <b>Tamil language</b> (<span lang="ta" style={{fontFamily:"sans-serif"}}>தமிழ்</span>) from <a href="https://themoviedb.org/" target="_blank" rel="noreferrer" style={{ color: "var(--vs-movie)" }}>TMDb</a>, filtered for Indian region.</div>
      {onBack && <button className="btn" style={backBtnStyle} onClick={onBack}>Back to Categories</button>}
      {loading && <div style={{ color: "var(--vs-movie)" }}>Loading movies…</div>}
      {error && <div style={{ color: "#d14343" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="vs-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 18, marginTop: 18 }}>
          {movies.length === 0
            ? <div>No movies found.</div>
            : movies.slice(0, 18).map(movie => (
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
