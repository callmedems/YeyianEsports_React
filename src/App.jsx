import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Mainpage from './pages/Mainpage';
import Login from './components/register_login/Login';
import Register from './components/register_login/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        {/* Aqui van las rutas que hagan falta */}
      </Routes>
    </Router>
  );
}

export default App;
