import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const AddExperience = () => {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [techInput, setTechInput] = useState("");
  const [respInput, setRespInput] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = "https://curicullum.onrender.com/api"

  const handleAddItem = (type) => {
    if (type === "tech" && techInput.trim()) {
      setTechnologies((prev) => [...prev, techInput.trim()]);
      setTechInput("");
    }
    if (type === "resp" && respInput.trim()) {
      setResponsibilities((prev) => [...prev, respInput.trim()]);
      setRespInput("");
    }
  };

  const handleRemoveItem = (type, index) => {
    if (type === "tech") {
      setTechnologies((prev) => prev.filter((_, i) => i !== index));
    } else {
      setResponsibilities((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company || !position || !location || !startDate) {
      return setError("All fields except end date are required!");
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return setError("Start date cannot be after end date!");
    }

    const finalData = {
      company,
      position,
      location,
      technologies,
      responsibilities,
      startDate,
      endDate: endDate === "" ? null : endDate,
    };

    try {
      if (!id) {
        const res = await axios.post(`${BASE_URL}/experience/add`, finalData);
        setSuccess(res.data.message || "Experience added successfully ✅");
        setError("");
      } else {
        const res = await axios.put(`${BASE_URL}/experience/edit/${id}`, finalData);
        setSuccess(res.data.message || "Experience updated successfully ✅");
        setError("");
      }

      navigate("/experience/list");
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || "Error saving experience";
      setError(errMsg);
      setSuccess("");
    }
  };

  useEffect(() => {
    if (!id) {
      setCompany("");
      setPosition("");
      setLocation("");
      setTechnologies([]);
      setResponsibilities([]);
      setStartDate("");
      setEndDate("");
      setSuccess("");
      setError("");
      console.log("🆕 Creating new experience");
      return;
    }

    const fetchExperience = async () => {
      try {
        const res = await axios.get(`http://localhost:4050/api/experience/${id}`);
        const exp = res.data.experience || res.data;


        setCompany(exp.company || "");
        setPosition(exp.position || "");
        setLocation(exp.location || "");
        setTechnologies(exp.technologies || []);
        setResponsibilities(exp.responsibilities || []);
        setStartDate(
          exp.startDate && exp.startDate !== "Present"
            ? new Date(exp.startDate).toISOString().split("T")[0]
            : ""
        );

        // ✅ Prevent "Invalid Date" if backend sends "Present"
        setEndDate(
          !exp.endDate || exp.endDate === "Present"
            ? ""
            : new Date(exp.endDate).toISOString().split("T")[0]
        );
        setSuccess("Loaded experience details ✅");
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Error fetching experience");
      }
    };

    fetchExperience();
  }, [id]);

  return (
    <div className="relative flex justify-center w-screen min-h-screen bg-gray-200 overflow-y-auto py-10">

      {/* Notifications */}
      <div className="absolute top-5 right-5 z-50">
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center justify-between gap-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg min-w-[250px]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {success}
              </div>
              <button onClick={() => setSuccess("")} className="text-green-800 font-bold hover:text-green-900">
                <XCircle className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center justify-between gap-2 bg-red-100 text-red-800 px-4 py-2 rounded shadow-lg min-w-[250px]"
            >
              <div className="flex items-center gap-2">{error}</div>
              <button onClick={() => setError("")} className="text-red-800 font-bold hover:text-red-900">
                <XCircle className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">{id ? "Edit Experience" : "Add Experience"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company name"
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-2">Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Enter position or title"
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start / End Date */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Technologies */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold mb-2">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g., React"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="border px-4 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleAddItem("tech")}
                className="bg-green-600 text-white px-4 rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tech}
                  <button type="button" onClick={() => handleRemoveItem("tech", i)} className="text-red-500">
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold mb-2">Responsibilities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g., Developed API endpoints"
                value={respInput}
                onChange={(e) => setRespInput(e.target.value)}
                className="border px-4 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleAddItem("resp")}
                className="bg-green-600 text-white px-4 rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>
            <ul className="list-disc pl-6">
              {responsibilities.map((resp, i) => (
                <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1">
                  {resp}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("resp", i)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {id ? "Edit" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExperience;
