import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    // The footer is a marketing component and should only be shown on the homepage
    if (location.pathname !== '/') {
        return null;
    }

    return (
        <>
            <footer className="relative z-10 bg-white text-black px-12 py-10 w-full">
                <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-5">
                            Nex<span className="text-emerald-500">Bank</span>
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-[260px]">
                            Secure digital banking infrastructure built for modern wealth
                            management and global accessibility.
                        </p>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-5 text-black tracking-wide">
                            Company
                        </h4>
                        <ul className="space-y-3 text-gray-600 text-sm list-none p-0 m-0">
                            <li><a href="#" className="footer-link-light">About Us</a></li>
                            <li><a href="#" className="footer-link-light">Careers</a></li>
                            <li><a href="#" className="footer-link-light">Press</a></li>
                            <li><a href="#" className="footer-link-light">Security</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-5 text-black tracking-wide">
                            Support
                        </h4>
                        <ul className="space-y-3 text-gray-600 text-sm list-none p-0 m-0">
                            <li><a href="#" className="footer-link-light">Help Center</a></li>
                            <li><a href="#" className="footer-link-light">Contact Us</a></li>
                            <li><a href="#" className="footer-link-light">Privacy Policy</a></li>
                            <li><a href="#" className="footer-link-light">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-5 text-black tracking-wide">
                            Contact
                        </h4>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            support@nexbank.com <br />
                            +1 (800) 123-4567
                        </p>

                        <div className="flex gap-5 text-gray-500 text-lg">
                            <a href="#" className="footer-icon-light"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="footer-icon-light"><i className="fab fa-linkedin"></i></a>
                            <a href="#" className="footer-icon-light"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="footer-icon-light"><i className="fab fa-github"></i></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Divider */}
                <div className="border-t border-gray-200 mt-10 pt-4 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} NexBank. All rights reserved.
                </div>
            </footer>
            <style>{`
                .footer-link-light {
                    transition: 0.3s ease;
                    text-decoration: none;
                    color: inherit;
                    font-size: 0.95rem;
                    font-weight: 500;
                }
                .footer-link-light:hover {
                    color: #00e97a;
                }

                .footer-icon-light {
                    display: inline-block;
                    transition: 0.3s ease;
                    text-decoration: none;
                    color: inherit;
                }
                .footer-icon-light:hover {
                    color: #00e97a;
                    transform: translateY(-3px);
                }
            `}</style>
        </>
    );
};

export default Footer;
