import './App.css';
import SociosphereHomepage from './Components/Home/home';
import { Navbar, Footer } from './Components/Home/layout';

function App() {
  return (
    <>
      <Navbar />
      <SociosphereHomepage />
      <Footer />
    </>
  );
}

export default App;
