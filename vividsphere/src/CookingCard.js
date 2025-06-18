import React, { useEffect, useState } from "react";

/**
 * CookingCard
 * Card for Cooking Recipes – reworked for easy, beginner-friendly cookie recipes using Spoonacular API search + client filtering.
 * previewMode (grid card) or full interactive display.
 */
// PUBLIC_INTERFACE
function CookingCard({ previewMode, onClick, onBack }) {
  // API configuration
  const API_KEY = "472624e314c44c30b8be3d737a51807f";
  // Spoonacular "complexSearch" for 'cookie', query for 'easy cookies' and filter for simple instructions.
  const SEARCH_URL =
    `https://api.spoonacular.com/recipes/complexSearch` +
    `?apiKey=${API_KEY}` +
    `&query=easy%20cookie` +
    `&number=18` +
    `&instructionsRequired=true` +
    `&maxReadyTime=40` +
    `&addRecipeInformation=true` + // get instructions, ingredients
    `&sort=min-missing-ingredients`;

  // If all else fails, fallback to demo cookie recipes
  const POPULAR_FALLBACK_COOKIE_RECIPES = [
    {
      id: "cookie-demo-demo1",
      title: "Soft Butter Cookies (Beginner)",
      image: "https://www.allrecipes.com/thmb/bXH9D1dKxYwY8zIDL7r_U09iF8c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/9870-butter-cookies-DDMFS-4x3-35746e6420844da798a417431a67482d.jpg",
      spoonacularSourceUrl: "https://www.allrecipes.com/recipe/9870/butter-cookies/"
    },
    {
      id: "cookie-demo-demo2",
      title: "Simple No-Oven Biscuit Cookies",
      image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2018/11/biscuit-cake-recipe.jpg",
      spoonacularSourceUrl: "https://www.indianhealthyrecipes.com/biscuit-cake-recipe/"
    },
    {
      id: "cookie-demo-demo3",
      title: "Eggless Nankhatai (Indian Shortbread Cookies)",
      image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/08/nankhatai-recipe-1a.jpg",
      spoonacularSourceUrl: "https://www.vegrecipesofindia.com/nankhatai-recipe-eggless-nankhatai/"
    }
  ];

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(!previewMode);
  const [error, setError] = useState(null);

  // Fetch easy cookie recipes from Spoonacular + filter for true beginner level
  useEffect(() => {
    let isMounted = true;
    if (!previewMode) {
      setLoading(true);
      setError(null);

      // Main fetch from Spoonacular complexSearch endpoint
      const fetchEasyCookies = async () => {
        try {
          const resp = await fetch(SEARCH_URL);
          if (!resp.ok) throw new Error("Failed to fetch cookie recipes");
          const data = await resp.json();

          let fetched = Array.isArray(data.results) ? data.results : [];

          // Client-side filtering for super-easy/beginner cookies
          // "Beginner" heuristics: title contains 'easy'/'simple', <8 ingredients, <=6 steps, basic instructions, or key tags.
          const filtered = fetched.filter((rec) => {
            const title = (rec.title || "").toLowerCase();
            // ingredient count: try extendedIngredients.length, fallback to 0
            const ingCount = rec.extendedIngredients
              ? rec.extendedIngredients.length
              : (rec.ingredients ? rec.ingredients.length : 0);

            // Get analyzed instructions (array of steps), fallback to empty
            let stepsArr = [];
            if (rec.analyzedInstructions && rec.analyzedInstructions.length > 0) {
              stepsArr = rec.analyzedInstructions[0].steps || [];
            } else if (rec.instructions) {
              stepsArr = rec.instructions.split(".").filter(e => e.trim().length > 8);
            }

            const easyInTitle = /\beasy\b|\bbeginner\b|\bsimple\b|\bquick\b/i.test(title);
            const ingredientIsSimple = ingCount > 0 && ingCount <= 8;
            const stepsAreShort = stepsArr && stepsArr.length > 0 && stepsArr.length <= 6;
            // Accept if any two conditions met (or name is "no bake")
            const isNoBake = /\bno\s*bake\b/.test(title);

            return (
              ((easyInTitle || ingredientIsSimple || stepsAreShort || isNoBake) &&
               (title.includes("cookie") || title.includes("biscuit"))) // Only cookies
            );
          });

          if (isMounted) {
            if (filtered.length > 0) {
              setRecipes(filtered);
              setLoading(false);
            } else {
              // No good recipes found, fallback to hardcoded
              setRecipes(POPULAR_FALLBACK_COOKIE_RECIPES);
              setError("Could not find simple cookie recipes. Showing demo suggestions.");
              setLoading(false);
            }
          }
        } catch (e) {
          // On error fallback to fallback cookie recipes
          if (isMounted) {
            setRecipes(POPULAR_FALLBACK_COOKIE_RECIPES);
            setError("Could not fetch live cookie recipes. Showing demo beginner recipes.");
            setLoading(false);
          }
        }
      };

      fetchEasyCookies();

      // Cleanup to prevent state updates if unmount
      return () => { isMounted = false; };
    }
    // eslint-disable-next-line
  }, [previewMode]);

  // Preview card
  if (previewMode) {
    return (
      <div
        className="vs-card"
        style={cardStyle("cooking")}
        onClick={onClick}
        tabIndex={0}
        aria-label="Easy Cookie Recipes card"
        role="button"
        onKeyPress={e => (e.key === "Enter" ? onClick() : undefined)}
      >
        <span style={iconStyle("cooking")}>🍪</span>
        <div style={{ fontWeight: 700, fontSize: "1.17rem" }}>Easy Cookie Recipes</div>
        <div style={descStyle}>Beginner-friendly cookies &amp; biscuits for all!<br />Powered by Spoonacular.</div>
      </div>
    );
  }

  // Expanded view: Easy Cookie Recipes for Beginners
  return (
    <section className="vs-section cooking" style={sectionStyle}>
      <SectionHeader icon="🍪" color="var(--vs-cooking)">
        Easy Cookie Recipes for Beginners
      </SectionHeader>
      <div style={descStyle}>
        Simple, beginner-friendly cookies &amp; biscuits from Spoonacular, hand-filtered for minimal ingredients and basic steps.<br />
        Recipes sourced via <a href="https://spoonacular.com/food-api" style={{ color: "var(--vs-cooking)" }} target="_blank" rel="noreferrer">Spoonacular</a>.
      </div>
      {onBack && <button className="btn" style={backBtnStyle} onClick={onBack}>Back to Categories</button>}
      {loading && <div style={{ color: "var(--vs-cooking)" }}>Loading cookie recipes…</div>}
      {error && <div style={{ color: "#d14343" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="vs-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 18, marginTop: 18 }}>
          {recipes.length === 0
            ? <div>No cookie recipes found.</div>
            : recipes.map(recipe => (
              <div key={recipe.id}
                style={{
                  background: "rgba(18,18,35,0.80)",
                  borderRadius: 10,
                  padding: 10,
                  border: "1px solid var(--vs-cardborder)",
                  display: "flex", flexDirection: "column", alignItems: "center", minHeight: 235
                }}
              >
                {recipe.image
                  ? <img src={recipe.image} alt={recipe.title}
                    loading="lazy" style={{
                      borderRadius: 8, width: "100%", minHeight: 125, objectFit: "cover", marginBottom: 9, background: "#222"
                    }} />
                  : <div style={{ height: 118, width: "100%", background: "#222", marginBottom: 7, borderRadius: 8 }}></div>}
                <div style={{ fontWeight: 600, fontSize: "1.04rem", color: "var(--vs-accent)", textAlign: "center" }}>{recipe.title}</div>
                <a href={recipe.spoonacularSourceUrl || recipe.sourceUrl} target="_blank" rel="noreferrer"
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
