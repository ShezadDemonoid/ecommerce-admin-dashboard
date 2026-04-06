import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Employees from "./pages/Employees";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/users" element={<Users />} />
        <Route path="/employees" element={<Employees />} />
      </Route>
    </Routes>
  );
}

export default App;
