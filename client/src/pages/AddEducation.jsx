import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const AddEducation = () => {
    const [institution, setInstitution] = useState("");
    const [qualification, setQualification] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [fieldOfStudy, setFieldOfStudy] = useState("");

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const BASE_URL = "https://curicullum.onrender.com/api"

    const { id } = useParams();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!institution || !qualification || !startDate || !description || !imgUrl || !fieldOfStudy) {
            return setError("All fields are required, end date is optional!");
        }

        if (!startDate && endDate) {
            return setError("You cannot set an end date without a start date!");
        }

        // Rule 2: Start date must be <= End date
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return setError("Start date cannot be after end date!");
        }

        const finalEnddate = endDate === "" ? "Present" : endDate

        const educationData = {
            institution,
            qualification,
            startDate,
            endDate: finalEnddate,
            description,
            imgUrl,
            fieldOfStudy,
        };

        try {
            if (!id) {
                const res = await axios.post(`${BASE_URL}/education/add`, educationData);

                console.log(res)
                setSuccess(res.data.message || "Education added successfully ✅");
                setError("");
            } else {
                const res = await axios.put(`${BASE_URL}/education/edit/${id}`, educationData);

                console.log(res)
                setSuccess(res.data.message || "Education edited successfully ✅");
                setError("");
            }

            navigate("/education/list");
        } catch (err) {
            console.log(err)
            const errMessage = err.response?.data?.error || "Error adding education";
            setError(errMessage);
            setSuccess("");
        }
    };

    useEffect(() => {
        if (!id) {
            setInstitution("");
            setQualification("");
            setStartDate("");
            setEndDate("");
            setDescription("");
            setImgUrl("");
            setFieldOfStudy("");

            setSuccess("");
            setError("");
            console.log("❌ No ID found in params");
            return;
        }

        const fetchEducation = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/education/${id}`)

                const edu = res.data.education || res.data; // Make sure backend sends education object

                setInstitution(edu.institution || "");
                setQualification(edu.qualification || "");
                setStartDate(edu.startDate || "");
                setEndDate(edu.endDate === "Present" ? "" : edu.endDate); // handle "Present"
                setDescription(edu.description || "");
                setImgUrl(edu.imgUrl || "");
                setFieldOfStudy(edu.fieldOfStudy || "");

                setSuccess(res.data.message || "Loaded education details ✅");

                console.log(res.data)

                setSuccess(res.data.message)
                setError("")
            } catch (err) {
                setError(err.response?.data?.error)
            }
        }
        fetchEducation()
    }, [id])




    return (
        <div className="relative flex items-center justify-center w-screen h-screen bg-gray-200 overflow-hidden">
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
                            <div className="flex items-center gap-2">
                                {error}
                            </div>
                            <button onClick={() => setError("")} className="text-red-800 font-bold hover:text-red-900">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-6 text-center">{id ? "Edit Education" : "Add Education"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="font-semibold mb-2">Institution</label>
                        <input
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            placeholder="Enter institution name"
                            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-2">Qualification</label>
                        <input
                            type="text"
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            placeholder="Enter qualification"
                            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

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

                    <div className="flex flex-col mt-6 col-span-2">
                        <label className="font-semibold mb-2">Description</label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-2">Image URL</label>
                        <input
                            type="text"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            placeholder="Enter image link"
                            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-2">Field of Study</label>
                        <input
                            type="text"
                            value={fieldOfStudy}
                            onChange={(e) => setFieldOfStudy(e.target.value)}
                            placeholder="Enter field of study"
                            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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

export default AddEducation;
