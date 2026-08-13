import "./App.css";

function App() {
  return (
    <main className="home-page">
      {/* السماء */}
      <div className="stars" aria-hidden="true">
        <span className="star star-1" />
        <span className="star star-2" />
        <span className="star star-3" />
        <span className="star star-4" />
        <span className="star star-5" />
        <span className="star star-6" />
        <span className="star star-7" />
        <span className="star star-8" />
        <span className="star star-9" />
        <span className="star star-10" />
      </div>

      {/* القمر */}
      <div className="moon" aria-hidden="true">
        <div className="moon-glow" />
      </div>

      {/* ضباب بعيد */}
      <div className="mist mist-back" aria-hidden="true" />
      <div className="mist mist-front" aria-hidden="true" />

      {/* أشجار بعيدة */}
      <div className="forest forest-back" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* أشجار قريبة */}
      <div className="forest forest-front" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* جزيئات مضيئة */}
      <div className="fireflies" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* الممر */}
      <div className="magic-path" aria-hidden="true" />

      {/* المحتوى */}
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
