import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const ExperienceList = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch all experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get("http://localhost:4050/api/experience/list");
        setExperiences(res.data.experiences || res.data);
        setSuccess("Experiences loaded successfully ✅");
      } catch (err) {
        setError(err.response?.data?.error || "Error loading experiences");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;

    try {
      await axios.delete(`http://localhost:4050/api/experience/delete/${id}`);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      setSuccess("Experience deleted successfully ✅");
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting experience");
    }
  };

  return (
    <div className="relative min-h-screen p-8 flex flex-col items-center ml-64 overflow-x-hidden">
      {/* Notifications */}
      <div className="fixed top-5 right-5 z-50 w-auto max-w-xs">
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center justify-between gap-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {success}
              </div>
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
              className="flex items-center justify-between gap-2 bg-red-100 text-red-800 px-4 py-2 rounded shadow-lg"
            >
              <div>{error}</div>
              <button onClick={() => setError("")}>
                <XCircle className="w-5 h-5 text-red-800 hover:text-red-900" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Work Experience</h2>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="animate-spin w-6 h-6" />
          Loading experiences...
        </div>
      ) : experiences.length === 0 ? (
        <p className="text-gray-600">No experiences found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {experiences.map((exp) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{exp.company}</h3>
                <p className="text-blue-600 font-medium">{exp.position}</p>
                <p className="text-gray-500 text-sm">{exp.location}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {new Date(exp.startdate).toLocaleDateString()} -{" "}
                  {exp.enddate === "Present" || !exp.enddate
                    ? "Present"
                    : new Date(exp.enddate).toLocaleDateString()}
                </p>

                <div className="mt-3">
                  <h4 className="font-semibold text-gray-700">Technologies:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {exp.technologies.map((tech, i) => (
                      <li key={i}>{tech}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold text-gray-700">Responsibilities:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between mt-5">
                <Link
                  to={`/experience/edit/${exp._id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="text-red-600 font-medium hover:underline"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/experience/add"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Experience
        </Link>
      </div>
    </div>
  );
};

export default ExperienceList;
