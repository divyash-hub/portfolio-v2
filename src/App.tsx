import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import CaseStudy from "./pages/CaseStudy";
import About from "./pages/About";
import SkillsPage from "./pages/Capabilities";
import Experience from "./pages/Experience";
import Lab from "./pages/Lab";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { experience, lab } from "./data/site";

/* Every route on the site. Experience and Lab only exist once they have real entries. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<CaseStudy />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="capabilities" element={<SkillsPage />} />
        {experience.length > 0 && <Route path="experience" element={<Experience />} />}
        {lab.length > 0 && <Route path="lab" element={<Lab />} />}
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
