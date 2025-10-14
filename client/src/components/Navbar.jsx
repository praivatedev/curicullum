import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <nav
            className={`h-screen bg-teal-600 px-4 py-6 z-50 flex flex-col gap-8 shadow-lg fixed left-0 top-0 transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64"}`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`text-2xl transition-all duration-300 border-0
    ${isCollapsed
                        ? "ml-1"
                        : "absolute top-4 right-4"} 
  `}
            >
                {isCollapsed ? <IoMenu /> : <IoClose />}
            </button>

            {/* Dashboard */}
            <div className="flex items-center gap-3 cursor-pointer">
                <img src="/icons/house.png" alt="home icon" className="h-7" />
                {!isCollapsed && <h1 className="font-semibold text-lg">Dashboard</h1>}
            </div>

            {/* Education */}
            <div>
                <div className="flex items-center gap-3">
                    <img src="/icons/education.png" alt="education" className="h-7" />
                    {!isCollapsed && <h1 className="font-semibold text-lg">Education</h1>}
                </div>
                {!isCollapsed && (
                    <ul className="ml-10 mt-2 space-y-1 text-gray-700">
                        <Link to="/education/add">
                            <li className="cursor-pointer hover:text-blue-600">Add Education</li>
                        </Link>
                        <Link to="/education/list">
                            <li className="cursor-pointer hover:text-blue-600">Education List</li>
                        </Link>
                    </ul>
                )}
            </div>

            {/* Experience */}
            <div>
                <div className="flex items-center gap-3">
                    <img src="/icons/experience.png" alt="experience" className="h-7" />
                    {!isCollapsed && <h1 className="font-semibold text-lg">Experience</h1>}
                </div>
                {!isCollapsed && (
                    <ul className="ml-10 mt-2 space-y-1 text-gray-700">
                        <Link to="/experience/add">
                            <li className="cursor-pointer hover:text-blue-600">Add Experience</li>
                        </Link>
                        <Link to="/experience/list">
                            <li className="cursor-pointer hover:text-blue-600">Experience List</li>
                        </Link>
                    </ul>
                )}
            </div>

            {/* Projects */}
            <div>
                <div className="flex items-center gap-3">
                    <img src="/icons/project.png" alt="projects" className="h-7" />
                    {!isCollapsed && <h1 className="font-semibold text-lg">Projects</h1>}
                </div>
                {!isCollapsed && (
                    <ul className="ml-10 mt-2 space-y-1 text-gray-700">
                        <Link to="/project/add">
                            <li className="cursor-pointer hover:text-blue-600">Add Project</li>
                        </Link>
                        <Link to="/project/list">
                            <li className="cursor-pointer hover:text-blue-600">Projects List</li>
                        </Link>
                    </ul>
                )}
            </div>

            {/* Skills */}
            <div>
                <div className="flex items-center gap-3">
                    <img src="/icons/skills.png" alt="skills" className="h-7" />
                    {!isCollapsed && <h1 className="font-semibold text-lg">Skills</h1>}
                </div>
                {!isCollapsed && (
                    <ul className="ml-10 mt-2 space-y-1 text-gray-700">
                        <li className="cursor-pointer hover:text-blue-600">Technical Skills</li>
                        <li className="cursor-pointer hover:text-blue-600">Soft Skills</li>
                    </ul>
                )}
            </div>

            {/* Messages */}
            <div>
                <div className="flex items-center gap-3">
                    <img src="/icons/message.png" alt="messages" className="h-7" />
                    {!isCollapsed && <h1 className="font-semibold text-lg">Messages</h1>}
                </div>
                {!isCollapsed && (
                    <ul className="ml-10 mt-2 space-y-1 text-gray-700">
                        <Link to="/messages/list">
                            <li className="cursor-pointer hover:text-blue-600">View Messages</li>
                        </Link>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
