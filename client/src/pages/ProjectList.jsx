import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Github,
  FolderOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const BASE_URL = "https://curicullum.onrender.com/api"

  const formatDate = (date) => {
    if (!date || date === "Present") return "Present";
    const d = new Date(date);
    return d.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/project/list`);
      setProjects(res.data.projects || res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch project data.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await axios.delete(
        `${BASE_URL}/project/delete/${id}`
      );
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setSuccess(res.data.message || "Project deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete project.");
    }
  };

  return (
    <div className="w-full max-w-7xl ml-64 p-8 relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ✅ Notification Toasts */}
      <div className="fixed top-5 right-5 z-50">
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="flex items-center justify-between gap-3 bg-green-100 text-green-800 px-4 py-2 rounded-xl shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{success}</span>
              <button onClick={() => setSuccess("")}>
                <XCircle className="w-4 h-4 hover:text-green-900" />
              </button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="flex items-center justify-between gap-3 bg-red-100 text-red-700 px-4 py-2 rounded-xl shadow-lg"
            >
              <XCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
              <button onClick={() => setError("")}>
                <XCircle className="w-4 h-4 hover:text-red-900" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 text-center mb-10"
      >
        My Projects
      </motion.h2>

      {/* ✅ Empty State */}
      {projects.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-gray-500"
        >
          <FolderOpen className="w-12 h-12 mb-3 text-gray-400" />
          <p className="text-lg font-medium">No projects found</p>
          <Link
            to="/project/add"
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Your First Project
          </Link>
        </motion.div>
      )}

      {/* ✅ Project Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {projects.map((proj) => (
            <motion.div
              key={proj._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 transition-all duration-300"
            >
              {/* ✅ Image */}
              {proj.image ? (
                <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-40 mb-4 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  <FolderOpen className="w-10 h-10" />
                </div>
              )}

              {/* ✅ Info */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-indigo-600 font-medium">
                    {proj.role}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(proj.startDate)} —{" "}
                    {proj.endDate ? formatDate(proj.endDate) : "Present"}
                  </p>
                </div>

                {/* ✅ Actions */}
                <div className="flex gap-2">
                  <Link to={`/project/edit/${proj._id}`}>
                    <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition">
                      <Edit2 size={15} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* ✅ Description */}
              <p className="text-sm text-gray-700 leading-relaxed mt-3 line-clamp-3">
                {proj.description}
              </p>

              {/* ✅ Tech Stack */}
              {proj.technologies?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    Tech Stack:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {proj.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ Features */}
              {proj.features?.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    Features:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {proj.features.slice(0, 3).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ✅ Links */}
              <div className="flex gap-3 mt-4">
                {proj.githubLink && (
                  <a
                    href={proj.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm font-medium"
                  >
                    <Github size={16} /> GitHub
                  </a>
                )}
                {proj.demoLink && (
                  <a
                    href={proj.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ✅ Add Button */}
      {projects.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Link
            to="/project/add"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Project
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
