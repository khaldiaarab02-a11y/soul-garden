import "./App.css";

function App() {
  return (
    <main className="soul-garden">
      <div className="stars" />

      <div className="moon">
        <div className="moon-glow" />
      </div>

      <div className="forest forest-back" />
      <div className="forest forest-left" />
      <div className="forest forest-right" />

      <div className="mist mist-1" />
      <div className="mist mist-2" />

      <div className="garden-path" />

      <div className="hero-content">
        <p className="hero-eyebrow">✦ رحلة إلى الداخل ✦</p>

        <h1>
          حديقة
          <span>الروح</span>
        </h1>

        <p className="hero-description">
          مساحة هادئة للعودة إلى ذاتك،
          وفهم مشاعرك، واكتشاف السلام الداخلي.
        </p>

        <button className="hero-button">
          ابدئي رحلتك
          <span>✦</span>
        </button>
      </div>

      <div className="fireflies">
        {Array.from({ length: 12 }).map((_, index) => (
          <i key={index} />
        ))}
      </div>
    </main>
  );
}

export default App;
