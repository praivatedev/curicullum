import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const AddProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [features, setFeatures] = useState([]);
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [image, setImage] = useState("");

  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const BASE_URL = "https://curicullum.onrender.com/api"

  // ✅ Add technology or feature
  const handleAddItem = (type) => {
    if (type === "tech" && techInput.trim()) {
      setTechnologies((prev) => [...prev, techInput.trim()]);
      setTechInput("");
    }
    if (type === "feat" && featureInput.trim()) {
      setFeatures((prev) => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  // ✅ Remove technology or feature
  const handleRemoveItem = (type, index) => {
    if (type === "tech") {
      setTechnologies((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "feat") {
      setFeatures((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // ✅ Submit project
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      technologies.length === 0 ||
      features.length === 0 ||
      !role ||
      !startDate ||
      !githubLink ||
      !demoLink
    ) {
      return setError("All required fields must be filled!");
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return setError("Start date cannot be after end date!");
    }

    const projectData = {
      title,
      description,
      technologies,
      features,
      role,
      startDate,
      endDate: endDate === "" ? "Ongoing" : endDate,
      githubLink,
      demoLink,
      image,
    };

    try {
      if (!id) {
        const res = await axios.post(`${BASE_URL}/project/add`, projectData);
        setSuccess(res.data.message || "Project added successfully ✅");
      } else {
        const res = await axios.put(`${BASE_URL}/project/edit/${id}`, projectData);
        setSuccess(res.data.message || "Project updated successfully ✅");
      }
      setError("");
      navigate("/project/list");
    } catch (err) {
      setError(err.response?.data?.error || "Error saving project");
      setSuccess("");
    }
  };

  // ✅ Load project if editing
  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/project/${id}`);
        const pro = res.data.project || res.data;
        setTitle(pro.title || "");
        setDescription(pro.description || "");
        setTechnologies(pro.technologies || []);
        setFeatures(pro.features || []);
        setRole(pro.role || "");
        setStartDate(pro.startDate || "");
        setEndDate(pro.endDate === "Ongoing" ? "" : pro.endDate);
        setGithubLink(pro.githubLink || "");
        setDemoLink(pro.demoLink || "");
        setImage(pro.image || "");
      } catch (err) {
        setError(err.response?.data?.error || "Error loading project");
      }
    };
    fetchProject();
  }, [id]);

  return (
    <div className="relative flex items-center justify-center w-screen min-h-screen bg-gray-100 overflow-y-auto p-6">
      {/* Notifications */}
      <div className="absolute top-5 right-5 z-50">
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              {success}
              <button onClick={() => setSuccess("")}>
                <XCircle className="w-5 h-5 text-green-800 hover:text-green-900" />
              </button>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded shadow-lg"
            >
              {error}
              <button onClick={() => setError("")}>
                <XCircle className="w-5 h-5 text-red-800 hover:text-red-900" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {id ? "Edit Project" : "Add Project"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Your Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start and End Date */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold mb-2">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Technologies */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold mb-2">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add a technology"
                className="border px-4 py-2 rounded-md flex-1"
              />
              <button
                type="button"
                onClick={() => handleAddItem("tech")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {technologies.map((tech, i) => (
                <li
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("tech", i)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a feature"
                className="border px-4 py-2 rounded-md flex-1"
              />
              <button
                type="button"
                onClick={() => handleAddItem("feat")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {features.map((feat, i) => (
                <li
                  key={i}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("feat", i)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2">GitHub Link</label>
            <input
              type="url"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="https://github.com/yourrepo"
              className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Demo Link</label>
            <input
              type="url"
              value={demoLink}
              onChange={(e) => setDemoLink(e.target.value)}
              placeholder="https://yourprojectdemo.com"
              className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {id ? "Update Project" : "Add Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
