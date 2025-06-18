import React, { useEffect, useState } from "react";

/**
 * Movies Component
 * Fetches and displays movies from The Movie Database (TMDb) API.
 */
// PUBLIC_INTERFACE
function Movies() {
  // API Configuration
  const API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";
  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

  // State variables for movie data, loading, and error
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch movies from TMDb');
        }
        return response.json();
      })
      .then(data => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section
      style={{
        background: "rgba(0,0,0,0.55)",
        padding: "2rem",
        borderRadius: "12px",
        margin: "24px 0"
      }}
    >
      <h2 style={{ color: "var(--base-light)" }}>Popular Movies</h2>
      <div
        style={{
          color: "var(--text-secondary)",
          marginBottom: 16
        }}
      >
        Movies fetched in real-time from <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--base-light)" }}>TMDb</a>.
      </div>
      {loading && (
        <div style={{ color: "var(--base-light)" }}>Loading movies...</div>
      )}
      {error && (
        <div style={{ color: "salmon" }}>Error: {error}</div>
      )}
      {!loading && !error && movies.length === 0 && (
        <div>No movies found!</div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "18px",
          marginTop: 16
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              background: "rgba(17,20,40,0.85)",
              padding: 12,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid var(--border-color)",
              minHeight: 320
            }}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
                style={{
                  width: "100%",
                  borderRadius: 8,
                  marginBottom: 8,
                  objectFit: "cover",
                  minHeight: 210,
                  background: "#111"
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: 210,
                background: "#222",
                marginBottom: 8,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                fontSize: "1.1rem"
              }}>No Image</div>
            )}
            <div style={{
              fontSize: "1.08rem",
              color: "var(--text-color)",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: 2
            }}>
              {movie.title}
            </div>
            <div style={{
              fontSize: "0.94rem",
              color: "var(--text-secondary)",
              textAlign: "center",
              marginBottom: 7
            }}>
              {movie.release_date}
            </div>
            <a
              href={`https://www.themoviedb.org/movie/${movie.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                marginTop: "auto",
                fontSize: "0.93rem",
                padding: "6px 14px",
                background: "var(--base-light)",
                color: "#fff",
                textDecoration: "none"
              }}
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Movies;
