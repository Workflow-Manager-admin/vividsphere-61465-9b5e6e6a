import React, { useState } from 'react';
import './App.css';
import DrawingIllustrations from './DrawingIllustrations';

// PUBLIC_INTERFACE
function App() {
  // State: control when to show Drawing Illustrations. (Simple example for UI demo)
  const [showIllustrations, setShowIllustrations] = useState(false);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn" onClick={() => setShowIllustrations(v => !v)}>
              {showIllustrations ? "Hide Illustrations" : "Explore Drawing Illustrations"}
            </button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero">
            <div className="subtitle">AI Workflow Manager Template</div>
            <h1 className="title">vividsphere</h1>
            <div className="description">
              Start building your application.
            </div>
            <button className="btn btn-large" onClick={() => setShowIllustrations(v => !v)}>
              {showIllustrations ? "Hide Drawing Illustrations" : "Show Drawing Illustrations"}
            </button>
          </div>
          {/* Inject Drawing Illustrations Explorer */}
          {showIllustrations && (
            <DrawingIllustrations />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;