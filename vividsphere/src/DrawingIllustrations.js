import React, { useEffect, useState } from 'react';

/**
 * DrawingIllustrations Component
 * Fetches and displays illustration images using the Pixabay API.
 */
 // PUBLIC_INTERFACE
function DrawingIllustrations() {
  // State variables for image data, loading, and errors
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pixabay API configuration
  const API_KEY = '50872548-89422cf3e7d17f61dfcb44fd6';
  const API_URL = `https://pixabay.com/api/?key=${API_KEY}&category=illustrations&image_type=illustration&per_page=16`;

  useEffect(() => {
    // Fetch illustrations from Pixabay
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch images from Pixabay');
        }
        return response.json();
      })
      .then((data) => {
        setImages(data.hits || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <section style={{
      background: 'rgba(0,0,0,0.5)',
      padding: '2rem',
      borderRadius: '12px',
      margin: '24px 0'
    }}>
      <h2 style={{color: 'var(--base-light)'}}>Drawing Illustrations</h2>
      <div style={{color: 'var(--text-secondary)', marginBottom: 16}}>
        Discover hand-picked illustrations fetched from <a href="https://pixabay.com/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--base-light)'}}>Pixabay</a>.
      </div>
      {loading && <div style={{color: 'var(--base-light)'}}>Loading illustrations...</div>}
      {error && <div style={{color: 'salmon'}}>Error: {error}</div>}
      {!loading && !error && images.length === 0 && (
        <div>No illustrations found!</div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '18px'
        }}
      >
        {images.map((img) => (
          <div key={img.id} style={{
            background: 'rgba(17,20,40,0.85)',
            padding: 12,
            borderRadius: 10,
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img
              src={img.webformatURL}
              alt={img.tags}
              loading="lazy"
              style={{
                width: '100%',
                borderRadius: 8,
                marginBottom: 8,
                objectFit: 'cover',
                minHeight: 130,
                background: '#222'
              }}
            />
            <div style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              {img.tags.split(',').slice(0,2).join(', ')}
            </div>
            <a
              href={img.pageURL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                marginTop: 8,
                fontSize: '0.93rem',
                padding: '6px 14px',
                background: 'var(--base-light)',
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              View Source
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DrawingIllustrations;
