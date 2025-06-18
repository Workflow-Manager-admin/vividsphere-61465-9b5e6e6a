import React, { useEffect, useState } from "react";

/**
 * CookingCard
 * Card for Cooking Recipes – integrates Spoonacular API.
 * previewMode (grid card) or full interactive display.
 */
// PUBLIC_INTERFACE
function CookingCard({ previewMode, onClick, onBack }) {
  // This API key is for demo/personal use only. In production, use env variable or backend proxy.
  const API_KEY = "472624e314c44c30b8be3d737a51807f";
  // Multi-step fallback URLs to maximize chance of finding Indian/South Indian results
  const API_URLS = [
    // 1. Most filtered: Indian cuisine, "South Indian,Tamil" tags
    `https://api.spoonacular.com/recipes/random?number=18&cuisine=Indian&tags=South+Indian,Tamil&apiKey=${API_KEY}`,
    // 2. South Indian only (no "Tamil" tag, for broader results)
    `https://api.spoonacular.com/recipes/random?number=18&cuisine=Indian&tags=South+Indian&apiKey=${API_KEY}`,
    // 3. Just Indian cuisine, no tags
    `https://api.spoonacular.com/recipes/random?number=18&cuisine=Indian&apiKey=${API_KEY}`,
    // 4. Broad: random recipes, let client filter
    `https://api.spoonacular.com/recipes/random?number=18&apiKey=${API_KEY}`
  ];

  // If all fail or responses are empty, fallback to hardcoded recipe(s) or local tips
  const POPULAR_FALLBACK_RECIPES = [
    {
      id: "demo-1",
      title: "Masala Dosa",
      image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/masala-dosa-recipe.jpg",
      spoonacularSourceUrl: "https://www.indianhealthyrecipes.com/masala-dosa-recipe/"
    },
    {
      id: "demo-2",
      title: "Curd Rice",
      image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2017/10/curd-rice-thayir-sadam.jpg",
      spoonacularSourceUrl: "https://www.indianhealthyrecipes.com/curd-rice-recipe/"
    }
  ];

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(!previewMode);
  const [error, setError] = useState(null);

  // Robust fetch with fallbacks (will try API URLs in order, fallback to local sample if all fail/no recipes)
  useEffect(() => {
    let isMounted = true;
    if (!previewMode) {
      setLoading(true);
      setError(null);

      // Recursive async fetch across API_URLS, fallback to POPULAR_FALLBACK_RECIPES if needed
      const tryFetchRecipes = async (urls, idx = 0) => {
        if (idx >= urls.length) {
          // All failed or gave empty, show fallback
          if (isMounted) {
            setRecipes(POPULAR_FALLBACK_RECIPES);
            setError(
              "Unable to fetch recipes from Spoonacular (quota reached or filter too narrow). Showing demo recipes."
            );
            setLoading(false);
          }
          return;
        }
        try {
          const resp = await fetch(urls[idx]);
          if (!resp.ok) throw new Error("Failed to fetch recipes");
          const data = await resp.json();
          if (Array.isArray(data.recipes) && data.recipes.length > 0) {
            if (isMounted) {
              setRecipes(data.recipes);
              setLoading(false);
              // no error message, success!
            }
            return;
          } else {
            // Empty: try next fallback filter
            return tryFetchRecipes(urls, idx + 1);
          }
        } catch (e) {
          // Hard error, try next or fallback
          if (idx + 1 < urls.length) {
            return tryFetchRecipes(urls, idx + 1);
          } else {
            if (isMounted) {
              setRecipes(POPULAR_FALLBACK_RECIPES);
              setError(
                "Could not fetch live recipes from Spoonacular. Showing demo suggestions."
              );
              setLoading(false);
            }
          }
        }
      };
      tryFetchRecipes(API_URLS);

      // Cleanup to prevent state updates if unmount
      return () => { isMounted = false; };
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
        <div style={descStyle}>South Indian &amp; Tamil recipe inspiration!<br />Powered by Spoonacular.</div>
      </div>
    );
  }

  // Expanded
  return (
    <section className="vs-section cooking" style={sectionStyle}>
      <SectionHeader icon="🍳" color="var(--vs-cooking)">Indian &amp; Tamil Cooking Recipes</SectionHeader>
      <div style={descStyle}>
        Curated selection of Indian, Tamil, and South Indian dishes.<br />
        Recipes sourced via <a href="https://spoonacular.com/food-api" style={{ color: "var(--vs-cooking)" }} target="_blank" rel="noreferrer">Spoonacular</a>.
      </div>
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
