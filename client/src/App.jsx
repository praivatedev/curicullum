import {BrowserRouter, Routes, Route} from "react-router-dom"
import Navbar from "../src/components/Navbar"
import Dashboard from "./pages/Dashboard"
import AddEducation from "./pages/AddEducation"
import EducationList from "./pages/EducationList"
import AddExperience from "./pages/AddExperience"
import ExperienceList from "./pages/ExperienceList"
import AddProject from "./pages/AddProject"
import ProjectList from "./pages/ProjectList"
import Messages from "./pages/Messages"
// import Education from "./pages/Education"
function App() {
  

  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/education/add" element={<AddEducation/>}/>
       <Route path="/education/edit/:id" element={<AddEducation/>}/>
       <Route path="/experience/add" element={<AddExperience/>}/>
       <Route path="/experience/edit/:id" element={<AddExperience/>}/>
      <Route path="/education/list" element={<EducationList/>}/>
      <Route path="/experience/list" element={<ExperienceList/>}/>
      <Route path="/project/add" element={<AddProject/>}/>
      <Route path="/project/list" element={<ProjectList/>}/>
      <Route path="/project/edit/:id" element={<AddProject/>}/>
      <Route path="/messages/list" element={<Messages/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
