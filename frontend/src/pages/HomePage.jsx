import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Hero from "../components/home/Hero.jsx";
import ExploreSection from "../components/explore/ExploreSection.jsx";

function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <ExploreSection />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
