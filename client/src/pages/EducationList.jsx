import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const EducationList = () => {
    const [educationList, setEducationList] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const BASE_URL = "https://curicullum.onrender.com/api"

    // Format date for display: "Jan 2024"
    const formatDate = (date) => {
        if (!date || date === "Present") return "Present";
        const d = new Date(date);
        return d.toLocaleString("default", { month: "short", year: "numeric" });
    };

    // Fetch all education entries from backend
    const fetchEducation = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/education/list`);
            setEducationList(res.data);
        } catch (err) {
            console.error("Error fetching education:", err);
            setError("Failed to fetch education data.");
        }
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    // Delete education entry
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this education entry?")) return;
        try {
            const res = await axios.delete(`${BASE_URL}/education/delete/${id}`);

            console.log(res)


            setEducationList(educationList.filter((edu) => edu._id !== id));
            setSuccess(res.data.message);
        } catch (err) {
            console.error("Error deleting education:", err);
            setError("Failed to delete education.");
        }
    };

    // Edit education entry (basic placeholder)
    const handleEdit = (id) => {
        // You can redirect to a form page or open a modal
        console.log("Edit education with ID:", id);
        setSuccess(`Edit action for ID: ${id}`);
    };

    return (
        <div className="w-full max-w-5xl ml-64 p-6 relative">
            {/* Notifications */}
            <div className="fixed top-5 right-5 z-50">
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
                            <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                {error}
                            </div>
                            <button onClick={() => setError("")} className="text-red-800 font-bold hover:text-red-900">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center">Education List</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {educationList.map((edu) => (
                       <motion.div
  key={edu._id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.3 }}
  className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-md p-5 flex flex-col relative border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
>
  {/* Action Buttons */}
  <div className="absolute top-3 right-3 flex gap-2">
    <Link to={`/education/edit/${edu._id}`}>
      <button
        onClick={() => handleEdit(edu._id)}
        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
      >
        <Edit2 size={16} />
      </button>
    </Link>
    <button
      onClick={() => handleDelete(edu._id)}
      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
    >
      <Trash2 size={16} />
    </button>
  </div>

  {/* Image */}
  <div className="w-full h-44 mb-4 flex items-center justify-center rounded-xl">
  <img
    src={edu.imgUrl}
    alt={edu.institution}
    className="max-h-40 object-contain rounded-lg"
  />
</div>

  {/* Institution & Qualification */}
  <h3 className="text-lg font-semibold text-gray-900">{edu.institution}</h3>
  <p className="text-sm font-medium text-indigo-600">{edu.qualification}</p>
  <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
  
  {/* Dates */}
  <p className="text-xs text-gray-400 mt-1">
    {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "Present"}
  </p>

  {/* Description */}
  <p className="text-sm mt-3 text-gray-700 leading-relaxed line-clamp-3">
    {edu.description}
  </p>
</motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EducationList;
