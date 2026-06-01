import React from "react";
import { NavLink } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#163025] text-[#CFE1D6]">

            <div
                className="max-w-7xl mx-auto px-6 py-8 grid gap-10 sm:grid-cols-2 text-center md:text-left"
            >

                <div className="space-y-4 flex flex-col items-center md:items-start">
                    <div className="flex items-center">
                        <span className="font-serif text-4xl sm:text-5xl text-white">V</span>
                        <h2 className="text-2xl font-semibold text-white">elnixa</h2>
                    </div>

                    <p className="text-sm leading-relaxed max-w-xs">
                        Premium fashion for everyday lifestyle.
                        Discover styles that match your confidence.
                    </p>
                </div>
                <div className="flex px-10 sm:px-5 justify-between sm:gap-20 gap-10">
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><NavLink to="/about" className="hover:text-white">About Us</NavLink></li>
                            <li><NavLink to="/help" className="hover:text-white">Help & Support</NavLink></li>
                            <li><NavLink to="/offices" className="hover:text-white">Offices</NavLink></li>
                            <li><NavLink to="/contact" className="hover:text-white">Contact</NavLink></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-white font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li><NavLink to="/mens" className="hover:text-white">Men</NavLink></li>
                            <li><NavLink to="/womens" className="hover:text-white">Women</NavLink></li>
                            <li><NavLink to="/kids" className="hover:text-white">Kids</NavLink></li>
                            <li><NavLink to="/new-arrivals" className="hover:text-white">New Arrivals</NavLink></li>
                        </ul>
                    </div>
                </div>

            </div>

            <div className="flex justify-center gap-6 pb-6">
                <Instagram className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 hover:text-white transition" />
                <Facebook className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 hover:text-white transition" />
                <FaWhatsapp className="text-[22px] cursor-pointer opacity-80 hover:opacity-100 hover:text-white transition" />
            </div>

            <div className="border-t border-white/10 py-3 text-center text-xs text-[#AFC5B8]">
                © 2025 Velnixa. All rights reserved.
            </div>

        </footer>
    );
};

export default Footer;
