import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { User } from "./components/User.tsx";
import { Admin } from "./components/Admin.tsx";

function App() {

  return (
      <BrowserRouter>
        <Routes>
            <Route path={"/user"} element={<User />} />
            <Route path={"/admin"} element={<Admin />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
