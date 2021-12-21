import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <Link className="brand" to="/">
              Clearpath Robotics
            </Link>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} exact></Route>
          </Routes>
        </main>
        <footer className="footer">All rights reserved.</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
