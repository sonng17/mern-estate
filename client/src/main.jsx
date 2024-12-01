import { createRoot } from "react-dom/client";
import "./index.css";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";

// import App from "./App.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route path="/about" element={<Profile />}></Route>
          <Route path="/profile" element={<About />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
