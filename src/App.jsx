import "./App.css";

function App() {
  return (
    <main className="home-page">
      <div className="moon" aria-hidden="true">
  <div className="moon-glow"></div>
</div>
      <section className="hero">
        <p className="eyebrow">رحلة إلى الداخل</p>

        <h1>حديقة الروح</h1>

        <p className="description">
          مساحة هادئة للتأمل، فهم المشاعر، واكتشاف السلام الداخلي.
        </p>

        <button className="start-button">
          ابدئي رحلتك
        </button>
      </section>
    </main>
  );
}

export default App;
