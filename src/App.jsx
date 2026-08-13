import "./App.css";

function App() {
  return (
    <main className="home-page">

      {/* السماء والنجوم */}
      <div className="sky" aria-hidden="true">
        <span className="real-star s1" />
        <span className="real-star s2" />
        <span className="real-star s3" />
        <span className="real-star s4" />
        <span className="real-star s5" />
        <span className="real-star s6" />
        <span className="real-star s7" />
        <span className="real-star s8" />
        <span className="real-star s9" />
        <span className="real-star s10" />
        <span className="real-star s11" />
        <span className="real-star s12" />
      </div>

      {/* القمر */}
      <div className="moon" aria-hidden="true">
        <div className="moon-glow" />
      </div>

      {/* هلال ضوئي بعيد */}
      <div className="atmosphere-glow" aria-hidden="true" />

      {/* غابة بعيدة */}
      <svg
        className="forest-svg forest-distant"
        viewBox="0 0 1200 420"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="
            M0 420
            L0 330
            C40 290 55 245 82 330
            C110 280 135 235 165 330
            C190 270 225 215 255 330
            C285 285 310 250 340 330
            C370 265 400 220 430 330
            C460 285 490 245 520 330
            C555 270 585 210 620 330
            C650 285 680 250 710 330
            C740 270 775 225 805 330
            C835 280 865 240 900 330
            C930 275 960 220 995 330
            C1025 280 1060 245 1090 330
            C1120 275 1150 235 1200 325
            L1200 420 Z
          "
        />
      </svg>

      {/* الأشجار الجانبية القريبة */}
      <svg
        className="forest-svg forest-left"
        viewBox="0 0 420 700"
        aria-hidden="true"
      >
        <path d="M70 700 C55 580 85 450 125 360 C145 315 175 270 205 230" />
        <path d="M115 470 C65 420 45 370 35 315" />
        <path d="M145 410 C210 365 245 315 265 260" />
        <path d="M105 545 C165 510 210 460 230 405" />

        <path
          className="leaf-mass"
          d="
            M20 360
            C30 280 80 245 145 265
            C125 205 180 165 235 205
            C260 135 335 155 345 225
            C395 225 425 280 395 335
            C350 380 270 360 220 345
            C155 395 70 405 20 360 Z
          "
        />

        <path
          className="leaf-mass dark"
          d="
            M0 520
            C25 440 85 420 140 450
            C160 395 225 390 255 440
            C315 415 370 455 360 515
            C330 565 245 550 200 535
            C135 580 50 575 0 520 Z
          "
        />
      </svg>

      <svg
        className="forest-svg forest-right"
        viewBox="0 0 420 700"
        aria-hidden="true"
      >
        <path d="M350 700 C365 580 335 450 295 360 C275 315 245 270 215 230" />
        <path d="M305 470 C355 420 375 370 385 315" />
        <path d="M275 410 C210 365 175 315 155 260" />
        <path d="M315 545 C255 510 210 460 190 405" />

        <path
          className="leaf-mass"
          d="
            M400 360
            C390 280 340 245 275 265
            C295 205 240 165 185 205
            C160 135 85 155 75 225
            C25 225 -5 280 25 335
            C70 380 150 360 200 345
            C265 395 350 405 400 360 Z
          "
        />

        <path
          className="leaf-mass dark"
          d="
            M420 520
            C395 440 335 420 280 450
            C260 395 195 390 165 440
            C105 415 50 455 60 515
            C90 565 175 550 220 535
            C285 580 370 575 420 520 Z
          "
        />
      </svg>

      {/* ضباب */}
      <div className="mist mist-one" aria-hidden="true" />
      <div className="mist mist-two" aria-hidden="true" />

      {/* الممر */}
      <div className="garden-path" aria-hidden="true">
        <div className="path-light" />
      </div>

      {/* نباتات المقدمة */}
      <div className="foreground-plants" aria-hidden="true">
        <span className="plant p1" />
        <span className="plant p2" />
        <span className="plant p3" />
        <span className="plant p4" />
        <span className="plant p5" />
        <span className="plant p6" />
      </div>

      {/* اليراعات */}
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
