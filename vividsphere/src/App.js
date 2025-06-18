import React, { useState } from "react";
import "./App.css";

// Importing feature card components:
import MoviesCard from "./MoviesCard";
import CookingCard from "./CookingCard";
import DrawingCard from "./DrawingCard";
import FunVideosCard from "./FunVideosCard";
import HouseholdCard from "./HouseholdCard";

// PUBLIC_INTERFACE
function App() {
  // Active category state. Null = grid view.
  const [activeCard, setActiveCard] = useState(null);

  // Handles clicking elsewhere to return to grid
  function handleBack() {
    setActiveCard(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Dynamic card render
  const cardComponents = {
    movies: <MoviesCard onBack={handleBack} />,
    cooking: <CookingCard onBack={handleBack} />,
    drawing: <DrawingCard onBack={handleBack} />,
    funvideos: <FunVideosCard onBack={handleBack} />,
    household: <HouseholdCard onBack={handleBack} />
  };

  return (
    <div className="app" style={{ minHeight: "100vh", background: "var(--vs-primary)" }}>
      {/* Navbar */}
      <nav className="navbar" style={{
        background: "var(--vs-primary)", borderBottom: "2px solid var(--vs-secondary)", color: "var(--vs-accent)"
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="logo" style={{ fontSize: '1.3rem', color: "var(--vs-accent)" }}>
            <span style={{ color: "var(--vs-secondary)" }}>◎</span> VividSphere
          </div>
          {activeCard && (
            <button className="btn" style={{ background: "var(--vs-secondary)", marginLeft: 18 }} onClick={handleBack}>Back to Categories</button>
          )}
        </div>
      </nav>
      {/* Hero section */}
      <header className="container" style={{ paddingTop: 80, paddingBottom: 36, textAlign: "center" }}>
        <h1 className="title" style={{
          fontWeight: 700, fontSize: "2.3rem", color: "var(--vs-accent)", marginBottom: 2
        }}>Welcome to <span style={{ color: "var(--vs-secondary)" }}>VividSphere</span></h1>
        <div className="description" style={{
          margin: "16px auto", maxWidth: 530, color: "var(--vs-desc)", fontSize: "1.13rem"
        }}>
          Explore five worlds: <b>Movies</b>, <b>Cooking</b>, <b>Household Tutorials</b>, <b>Drawing Illustrations</b>, and <b>Fun Videos</b>. Click a card to dive in!
        </div>
      </header>
      <main style={{ flexGrow: 1, width: "100%" }}>
        <div className="container" style={{ minHeight: "50vh" }}>
          {/* Card grid when none selected, else single view */}
          {!activeCard ? (
            <section className="vs-grid-categories" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.6rem",
              margin: "0 auto",
              padding: "2rem 0",
              maxWidth: 1200
            }}>
              {/* Each card is clickable and shows respective content */}
              <div><MoviesCard previewMode onClick={() => setActiveCard("movies")} /></div>
              <div><CookingCard previewMode onClick={() => setActiveCard("cooking")} /></div>
              <div><DrawingCard previewMode onClick={() => setActiveCard("drawing")} /></div>
              <div><FunVideosCard previewMode onClick={() => setActiveCard("funvideos")} /></div>
              <div><HouseholdCard previewMode onClick={() => setActiveCard("household")} /></div>
            </section>
          ) : (
            <div>
              {cardComponents[activeCard]}
            </div>
          )}
        </div>
      </main>
      <footer style={{
        padding: "32px 0 10px 0", textAlign: "center", fontSize: "0.93rem",
        color: 'rgba(255,255,255,0.53)'
      }}>
        &copy; {new Date().getFullYear()} VividSphere | Powered by TMDb, Spoonacular, Pixabay, and YouTube APIs
      </footer>
    </div>
  );
}

export default App;
