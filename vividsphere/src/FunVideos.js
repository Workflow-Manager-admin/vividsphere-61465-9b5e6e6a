import React, { useEffect, useState } from "react";

/**
 * FunVideos Component
 * Fetches and displays popular videos using YouTube Data API.
 */
// PUBLIC_INTERFACE
function FunVideos() {
  // State to store video data, loading status, and error
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // YouTube Data API key and endpoint for popular videos
  const API_KEY = "AIzaSyAyzYDjGLWhQ0XMmHdLfhdpixKD_GOwAZo";
  // This uses 'mostPopular' chart; regionCode US for trending/popular
  const API_URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=12&regionCode=US&key=${API_KEY}`;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch videos from YouTube API');
        }
        return response.json();
      })
      .then(data => {
        setVideos(data.items || []);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || "Could not fetch videos");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <section
      style={{
        background: "rgba(0,0,0,0.48)",
        padding: "2rem",
        borderRadius: "12px",
        margin: "24px 0"
      }}
    >
      <h2 style={{ color: "var(--base-light)" }}>Fun Videos</h2>
      <div style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
        Watch trending and popular videos powered by <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--base-light)" }}>YouTube</a>!
      </div>
      {loading && <div style={{ color: "var(--base-light)" }}>Loading fun videos...</div>}
      {error && <div style={{ color: "salmon" }}>Error: {error}</div>}
      {!loading && !error && videos.length === 0 && (
        <div>No videos found!</div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginTop: 12
        }}
      >
        {videos.map(video => (
          <div
            key={video.id}
            style={{
              background: "rgba(17,20,40,0.85)",
              padding: 12,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid var(--border-color)",
              minHeight: 260
            }}
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "100%", textDecoration: "none" }}
              title={video.snippet.title}
            >
              <img
                src={video.snippet.thumbnails?.medium?.url || ""}
                alt={video.snippet.title}
                loading="lazy"
                style={{
                  width: "100%",
                  borderRadius: 8,
                  marginBottom: 7,
                  objectFit: "cover",
                  minHeight: 120,
                  background: "#222",
                  aspectRatio: "16 / 9"
                }}
              />
            </a>
            <div
              style={{
                fontSize: "1.03rem",
                color: "var(--text-color)",
                fontWeight: 500,
                textAlign: "center",
                marginBottom: 2,
                marginTop: 2,
                flexGrow: 0
              }}
              title={video.snippet.title}
            >
              {video.snippet.title.length > 55
                ? video.snippet.title.substring(0, 54) + "…"
                : video.snippet.title}
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textAlign: "center",
                marginBottom: 7,
                flexGrow: 1
              }}
            >
              {video.snippet.channelTitle}
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
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
              aria-label={`Watch ${video.snippet.title}`}
            >
              Watch on YouTube
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FunVideos;
