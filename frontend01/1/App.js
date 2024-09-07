import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Frame from "./pages/Frame";
import ParentUserManagementPage1 from "./pages/ParentUserManagementPage1";
import Hh from "./pages/Hh";
import PersonalInformation1 from "./pages/PersonalInformation1";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
      case "/parent-user-management-page1":
        title = "";
        metaDescription = "";
        break;
      case "/hh":
        title = "";
        metaDescription = "";
        break;
      case "/personal-information1":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Frame />} />
      <Route
        path="/parent-user-management-page1"
        element={<ParentUserManagementPage1 />}
      />
      <Route path="/hh" element={<Hh />} />
      <Route path="/personal-information1" element={<PersonalInformation1 />} />
    </Routes>
  );
}
export default App;
