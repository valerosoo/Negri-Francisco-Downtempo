import "./Hero.css";

function Hero() {
  return (
    <section className="hero" aria-label="Presentación">
      <div className="container">
        <h1 className="hero__title">
          Viví el
          <br />
          <span className="accent">momento</span>
        </h1>
        <p className="hero__subtitle">Rooftop bar &amp; electronic music Buenos Aires</p>
        <hr className="rule" />
      </div>
      <a href="#explora" className="hero__scroll" aria-label="Ir a la sección Explorá Downtempo">
        ↓
      </a>
    </section>
  );
}

export default Hero;
