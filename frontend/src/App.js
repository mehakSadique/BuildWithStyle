import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Astrology from "./components/Astrology";
import Homepage from "./components/Homepage";
function App() {
  return (
    <div className="App">

          <BrowserRouter>
          <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/astrology" element={<Astrology/>}/>
          </Routes>
          </BrowserRouter>

    </div>
  );
}

export default App;
