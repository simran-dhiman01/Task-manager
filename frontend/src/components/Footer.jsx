import React from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-purple-100/50  w-full backdrop-blur-2xl z-50 border-t border-gray-200 py-4 mt-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm sm:text-base text-gray-600">

        {/* Left: Project Name */}
        <p className="font-medium text-center text-gray-700">
          Built with MERN, fueled by coffee ~{" "}
          <span className="text-orange-600 font-semibold">Simranjeet Kaur</span>
        </p>

        {/* Right: Social links (optional) */}
        <div className="flex gap-4">
          <a
            href="https://github.com/simran-dhiman01/Task-manager"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-600 transition-colors" >
            <FiGithub className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/simranjeetkaur67/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-600 transition-colors" >
            <FiLinkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
