import React, { useEffect, useState } from "react";

/**
 * CookingCard
 * Card for Cooking Recipes – integrates Spoonacular API.
 * previewMode (grid card) or full interactive display.
 */
// PUBLIC_INTERFACE
function CookingCard({ previewMode, onClick, onBack }) {
  const API_KEY = "472624e314c44c30b8be3d737a51807f";
  const API_URL = `https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(!previewMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!previewMode) {
      setLoading(true);
      setError(null);
      fetch(API_URL)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch recipes");
          return r.json();
        })
        .then((data) => {
          setRecipes(data.recipes || []);
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
        style={cardStyle("cooking")}
        onClick={onClick}
        tabIndex={0}
        aria-label="Cooking Recipes card"
        role="button"
        onKeyPress={e => (e.key === "Enter" ? onClick() : undefined)}
      >
        <span style={iconStyle("cooking")}>🍳</span>
        <div style={{ fontWeight: 700, fontSize: "1.17rem" }}>Cooking Recipes</div>
        <div style={descStyle}>Find trending recipe ideas for every mood.<br />Powered by Spoonacular.</div>
      </div>
    );
  }

  // Expanded
  return (
    <section className="vs-section cooking" style={sectionStyle}>
      <SectionHeader icon="🍳" color="var(--vs-cooking)">Cooking Recipes</SectionHeader>
      <div style={descStyle}>Delicious random recipes from <a href="https://spoonacular.com/food-api" style={{ color: "var(--vs-cooking)" }} target="_blank" rel="noreferrer">Spoonacular</a></div>
      {onBack && <button className="btn" style={backBtnStyle} onClick={onBack}>Back to Categories</button>}
      {loading && <div style={{ color: "var(--vs-cooking)" }}>Loading recipes…</div>}
      {error && <div style={{ color: "#d14343" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="vs-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 18, marginTop: 18 }}>
          {recipes.length === 0
            ? <div>No recipes found.</div>
            : recipes.map(recipe => (
              <div key={recipe.id}
                style={{
                  background: "rgba(18,18,35,0.80)",
                  borderRadius: 10,
                  padding: 10,
                  border: "1px solid var(--vs-cardborder)",
                  display: "flex", flexDirection: "column", alignItems: "center", minHeight: 225
                }}
              >
                {recipe.image
                  ? <img src={recipe.image} alt={recipe.title}
                    loading="lazy" style={{
                      borderRadius: 8, width: "100%", minHeight: 125, objectFit: "cover", marginBottom: 9, background: "#222"
                    }} />
                  : <div style={{ height: 118, width: "100%", background: "#222", marginBottom: 7, borderRadius: 8 }}></div>}
                <div style={{ fontWeight: 600, fontSize: "1.04rem", color: "var(--vs-accent)", textAlign: "center" }}>{recipe.title}</div>
                <a href={recipe.spoonacularSourceUrl} target="_blank" rel="noreferrer"
                  className="btn" style={btnStyle("cooking")}>Recipe</a>
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
    color: "var(--vs-cooking)",
    textAlign: "center",
    padding: "32px 18px 20px 18px",
    border: "2px solid var(--vs-cooking)",
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
    background: "var(--vs-cooking)",
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
  background: "rgba(0,0,0,0.50)",
  padding: "2rem",
  borderRadius: "15px",
  margin: "24px auto",
  maxWidth: 1150,
  boxShadow: "0 9px 30px rgba(0,0,0,0.07)"
};
const backBtnStyle = {
  margin: "0 0 24px 0",
  background: "var(--vs-cooking)",
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

export default CookingCard;
