import React from "react";

/**
 * HouseholdCard
 * Card for Household Tutorials – this is a placeholder with sample content.
 * previewMode (grid card) or expanded mode with clickable sample tutorials.
 */
// PUBLIC_INTERFACE
function HouseholdCard({ previewMode, onClick, onBack }) {
  // Curated sample content relevant for Indian families
  const curatedTips = [
    {
      title: "Top Kitchen Hacks",
      icon: "🍲",
      points: [
        "Use leftover rice to make tasty lemon rice or curd rice.",
        "To keep dosa batter fresh longer, add a pinch of sugar before mixing.",
        "Remove turmeric stains from containers by sun-drying or with lemon juice.",
        "For soft chapatis, knead dough with warm milk or water and let it rest."
      ],
      image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sneha-archanaskitchen.com/Ak_South_Indian_Plate_Thali-6.jpg"
    },
    {
      title: "Cleaning Made Easy",
      icon: "🧽",
      points: [
        "Soak pressure cooker lids/gaskets in hot water with dish soap to remove oily residue.",
        "Shine brass utensils with a paste of tamarind and salt.",
        "Use vinegar and baking soda to unclog kitchen and bathroom drains.",
        "Switch to microfiber cloths to dust puja areas or screens without residue."
      ],
      image: "https://images.herzindagi.info/image/2022/Apr/cleaning-tips-indian-household.jpg"
    },
    {
      title: "Home Organization Quick Wins",
      icon: "📦",
      points: [
        "Save old sarees or dupattas as dust covers for suitcases or shelves.",
        "Use dabba (container) stacking and labelling to streamline kitchen essentials.",
        "Assign baskets in the living room for fast toy or magazine cleanup.",
        "Hang keys on pegs near the entrance to avoid frantic searching."
      ],
      image: "https://www.godrejinterio.com/blogimages/StorageHacks.jpg"
    },
    {
      title: "Smart Daily Time-Savers",
      icon: "⏰",
      points: [
        "Plan weekly meals and prep masalas/chutneys in bulk for faster cooking.",
        "Designate a 'ready area' for school bags, IDs, and uniforms to avoid morning chaos.",
        "Use old newspapers to line kitchen shelves for easy cleanup.",
        "Keep a small 'essentials box' (band-aid, pins, candles) for household emergencies."
      ],
      image: "https://i.pinimg.com/736x/51/bd/7d/51bd7dcb4dfedc804e3fa50fae3606e2.jpg"
    }
  ];

  // Preview card for the grid
  if (previewMode) {
    return (
      <div
        className="vs-card"
        style={cardStyle("household")}
        onClick={onClick}
        tabIndex={0}
        aria-label="Household Tutorials Card"
        role="button"
        onKeyPress={e => (e.key === "Enter" ? onClick() : undefined)}
      >
        <span style={iconStyle("household")}>🏠</span>
        <div style={{ fontWeight: 700, fontSize: "1.17rem" }}>Household Tutorials</div>
        <div style={descStyle}>DIY tips, help, and home improvement basics for everyone.</div>
      </div>
    );
  }

  // Expanded: show curated Indian household tips, each as a card with list + image
  return (
    <section className="vs-section household" style={sectionStyle}>
      <SectionHeader icon="🏠" color="var(--vs-household)">
        Indian Household Tips &amp; Tutorials
      </SectionHeader>
      <div style={descStyle}>
        Curated kitchen hacks, cleaning guides, and practical time-saving tips for Indian homes!
      </div>
      {onBack && <button className="btn" style={backBtnStyle} onClick={onBack}>Back to Categories</button>}
      <div className="vs-row" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(270px,1fr))",
        gap: 22,
        marginTop: 18,
        width: "100%",
        paddingBottom: 5,
      }}>
        {curatedTips.map((item, idx) => (
          <section
            key={idx}
            aria-label={item.title}
            style={{
              background: idx % 2 === 0
                ? "linear-gradient(120deg, rgba(16,17,27,0.97) 74%, rgba(12,166,70,0.11))"
                : "linear-gradient(120deg, rgba(20,21,33,0.88) 64%, rgba(232,122,65,0.08))",
              borderRadius: 12,
              padding: "18px 14px 17px 14px",
              border: "2px solid var(--vs-household)",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              textAlign: "left",
              minHeight: 190,
              position: "relative",
              boxShadow: "0 4px 15px rgba(0,0,0,0.13)",
              marginBottom: 2
            }}
          >
            <header style={{
              fontWeight: 700,
              color: "var(--vs-accent)",
              fontSize: "1.17rem",
              marginBottom: 7,
              display: "flex",
              alignItems: "center",
              gap: 8,
              lineHeight: 1.17
            }}>
              <span style={{ fontSize: 26 }}>{item.icon}</span>
              <span style={{ flex: 1, wordBreak: "break-word" }}>{item.title}</span>
            </header>
            {item.image &&
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                style={{
                  width: "100%",
                  height: 98,
                  objectFit: "cover",
                  borderRadius: 7,
                  marginBottom: 8,
                  background: "#232426",
                  boxShadow: "0 2px 7px rgba(12,166,70,0.04)"
                }}
              />
            }
            <ul style={{
              color: "var(--vs-carddarker)",
              fontSize: "1.018rem",
              margin: 0,
              marginTop: 3,
              marginBottom: 3,
              paddingLeft: 19,
              listStyle: "square",
              lineHeight: 1.42,
            }}>
              {item.points.map((pt, i) => (
                <li key={i} style={{
                  marginBottom: 5,
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                  letterSpacing: "0.01em",
                  fontSize: idx % 2 === 0 ? "1.013em" : "0.985em"
                }}>{pt}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div style={{
        color: "var(--vs-household)",
        marginTop: 32,
        textAlign: "center",
        fontSize: "1.01rem",
        opacity: 0.91,
        fontWeight: 500
      }}>
        Have your own tips? Share them with your family! <br />
        For video demos, search "Indian home hacks" or "kitchen tips" on YouTube for more inspiration.
      </div>
    </section>
  );
}

function cardStyle(type) {
  return {
    cursor: "pointer",
    borderRadius: 13,
    background: "var(--vs-card)",
    boxShadow: "0 3px 9px rgba(0,0,0,0.10)",
    color: "var(--vs-household)",
    textAlign: "center",
    padding: "32px 18px 20px 18px",
    border: "2px solid var(--vs-household)",
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
    background: "var(--vs-household)",
    color: "#fff",
    borderRadius: 4,
    padding: "6px 13px",
    border: "none",
    marginTop: 7,
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    textDecoration: "none"
  };
}
const sectionStyle = {
  background: "rgba(0,0,0,0.37)",
  padding: "2rem",
  borderRadius: "15px",
  margin: "24px auto",
  maxWidth: 1150,
  boxShadow: "0 9px 30px rgba(0,0,0,0.08)"
};
const backBtnStyle = {
  margin: "0 0 24px 0",
  background: "var(--vs-household)",
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

export default HouseholdCard;
