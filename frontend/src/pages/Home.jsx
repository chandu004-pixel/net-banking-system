import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
    PieChart,
    Pie,
    LineChart,
    Line,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from "recharts";

const Home = () => {
    const floatingRef = useRef(null);
    const securityRef = useRef(null);
    const wealthRef = useRef(null);

    useEffect(() => {
        const setupHover = (sectionRef) => {
            const container = sectionRef.current;
            if (!container) return null;
            const mainCard = container.querySelector(".main-card");
            const miniCards = container.querySelectorAll(".mini-card");

            const tl = gsap.timeline({ paused: true });

            tl.to(mainCard, {
                scale: 0.95,
                duration: 0.3,
                ease: "power2.out"
            }, 0)
                .fromTo(miniCards,
                    {
                        y: 40,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.4,
                        stagger: 0.08,
                        ease: "power3.out"
                    },
                    0.05
                );

            const enter = () => tl.play();
            const leave = () => tl.reverse();

            container.addEventListener("mouseenter", enter);
            container.addEventListener("mouseleave", leave);

            return () => {
                container.removeEventListener("mouseenter", enter);
                container.removeEventListener("mouseleave", leave);
            };
        };

        const clean1 = setupHover(securityRef);
        const clean2 = setupHover(wealthRef);

        return () => {
            clean1 && clean1();
            clean2 && clean2();
        };
    }, []);

    useEffect(() => {
        const section = floatingRef.current;
        if (!section) return;

        const card1 = section.querySelector(".card-1");
        const card2 = section.querySelector(".card-2");
        const card3 = section.querySelector(".card-3");
        const cards = [card1, card2, card3];

        // Ensure 3D perspective wrapper
        gsap.set(section, { perspective: 1200 });

        // Initial Intro Animation
        gsap.fromTo(cards,
            { opacity: 0, y: 150, x: 50, rotateY: 25, rotateX: 10, z: -300 },
            { opacity: 1, y: 0, x: 0, rotateY: 0, rotateX: 0, z: 0, duration: 1.5, stagger: 0.2, ease: "expo.out" }
        );

        // Continuous Gentle Float
        const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
        floatTl.to(card1, { y: -15, duration: 3, ease: "sine.inOut" }, 0)
            .to(card2, { y: -10, duration: 2.5, ease: "sine.inOut" }, 0)
            .to(card3, { y: -12, duration: 3.5, ease: "sine.inOut" }, 0);

        // Magnetic 3D Spread on MouseMove
        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(card1, {
                x: x * 0.15 + 80,
                y: y * 0.15 - 60,
                rotateY: x * 0.05,
                rotateX: -y * 0.05,
                z: 80,
                scale: 1.08,
                boxShadow: "0 40px 100px rgba(0, 233, 122, 0.5)",
                duration: 0.6,
                ease: "power2.out"
            });
            gsap.to(card2, {
                x: x * 0.08 - 80,
                y: y * 0.08 + 40,
                rotateY: x * 0.03,
                rotateX: -y * 0.03,
                z: 40,
                scale: 1.05,
                boxShadow: "0 40px 100px rgba(25, 188, 253, 0.4)",
                duration: 0.6,
                ease: "power2.out"
            });
            gsap.to(card3, {
                x: x * 0.12 + 40,
                y: y * 0.12 + 100,
                rotateY: x * 0.04,
                rotateX: -y * 0.04,
                z: 60,
                scale: 1.06,
                boxShadow: "0 40px 100px rgba(0, 233, 122, 0.4)",
                duration: 0.6,
                ease: "power2.out"
            });
        };

        const handleMouseEnter = () => {
            floatTl.pause();
            section.addEventListener("mousemove", handleMouseMove);
        };

        const handleMouseLeave = () => {
            section.removeEventListener("mousemove", handleMouseMove);
            gsap.to(cards, {
                x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, scale: 1,
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
                duration: 1,
                ease: "elastic.out(1, 0.4)",
                onComplete: () => floatTl.play()
            });
        };

        section.addEventListener("mouseenter", handleMouseEnter);
        section.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            section.removeEventListener("mouseenter", handleMouseEnter);
            section.removeEventListener("mouseleave", handleMouseLeave);
            section.removeEventListener("mousemove", handleMouseMove);
            floatTl.kill();
        };
    }, []);
    const lineData = [
        { v: 400 },
        { v: 600 },
        { v: 800 },
        { v: 750 },
        { v: 950 },
        { v: 1200 }
    ];

    const areaData = [
        { v: 300 },
        { v: 500 },
        { v: 700 },
        { v: 900 },
        { v: 1100 }
    ];

    const pieData = [
        { name: "Savings", value: 60 },
        { name: "Investments", value: 40 }
    ];

    return (
        <div className="relative min-h-screen text-white overflow-x-hidden">

            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                    alt="hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 100%)' }}></div>
            </div>


            {/* Hero Content */}
            <div className="relative z-10 w-full min-h-[75vh] px-8 lg:px-12 xl:px-20 flex flex-col justify-center hero-animate-fade-in">

                <div className="max-w-2xl">
                    <h2 className="text-5xl lg:text-[4rem] font-extrabold leading-[1.15] mb-6 tracking-tight">
                        Access new <br />
                        wealth opportunities.
                    </h2>

                    <p className="text-gray-200 text-xl font-light mb-10 max-w-2xl">
                        Explore the growth potential of digital assets with secure, modern banking.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            to="/register"
                            style={{ textDecoration: 'none' }}
                            className="hero-btn-hover bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition duration-300"
                        >
                            Get Started →
                        </Link>
                        <button
                            className="hero-btn-hover border border-white/30 hover:border-white/80 hover:bg-white/5 bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg transition duration-300"
                        >
                            Explore Platform
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-12 flex flex-wrap items-center gap-5 text-sm">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-[#121212] flex justify-center items-center overflow-hidden"><img src="https://i.pravatar.cc/100?img=33" alt="User" /></div>
                            <div className="w-10 h-10 rounded-full border-2 border-[#121212] flex justify-center items-center overflow-hidden"><img src="https://i.pravatar.cc/100?img=47" alt="User" /></div>
                            <div className="w-10 h-10 rounded-full border-2 border-[#121212] flex justify-center items-center overflow-hidden"><img src="https://i.pravatar.cc/100?img=12" alt="User" /></div>
                            <div className="w-10 h-10 rounded-full border-2 border-[#121212] bg-emerald-500 flex justify-center items-center text-white font-bold text-xs">+</div>
                        </div>
                        <div>
                            <p className="font-semibold text-white text-[15px] mb-0.5">Trusted by 10,000+ users globally</p>
                            <p className="flex items-center gap-1 text-[#00e97a] text-xs m-0">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                                <span className="text-gray-400 ml-1 font-medium text-[13px]">4.8 rating</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Floating Cards Cluster */}
                <div
                    ref={floatingRef}
                    className="hero-floating-wrapper hidden lg:block"
                >

                    {/* CARD 1 - BAR */}
                    <div className="floating-card card-1">
                        <div className="card-title">Portfolio Growth</div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={lineData}>
                                    <Bar
                                        dataKey="v"
                                        fill="#00e97a"
                                        radius={[4, 4, 0, 0]}
                                        barSize={14}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* CARD 2 - AREA */}
                    <div className="floating-card card-2">
                        <div className="card-title">Revenue Trend</div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={areaData}>
                                    <Area
                                        type="monotone"
                                        dataKey="v"
                                        stroke="#19bcfd"
                                        fill="#19bcfd33"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* CARD 3 - PIE */}
                    <div className="floating-card card-3">
                        <div className="card-title">Asset Allocation</div>
                        <div className="chart-wrapper center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        innerRadius={35}
                                        outerRadius={55}
                                        fill="#00e97a"
                                        stroke="none"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

            </div>





            {/* Dual Info Section */}
            <section className="relative z-10 w-full pt-40 pb-32 px-12">
                <div className="mx-auto grid md:grid-cols-2 gap-12 w-full max-w-[1200px]">

                    {/* SECURITY BOX */}
                    <div ref={securityRef} className="relative hover-container">
                        <div className="main-card bg-[#0f0f13]/95 backdrop-blur-md p-10 rounded-[2rem] shadow-2xl relative z-10 min-h-[280px] flex flex-col justify-center">
                            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6">
                                <i className="fas fa-shield-alt text-emerald-400 text-2xl"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Bank-Level Security
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Your assets are protected with multi-layer encryption,
                                real-time monitoring, and advanced fraud detection systems.
                            </p>
                        </div>

                        {/* Mini Cards */}
                        <div className="mini-card top-card bg-[#14161c] text-white">
                            256-bit Encryption
                        </div>

                        <div className="mini-card bottom-card bg-[#14161c] text-white">
                            Real-time Fraud Detection
                        </div>

                        <div className="mini-card bottom-card-2 bg-[#14161c] text-white">
                            Secure Infrastructure
                        </div>
                    </div>

                    {/* WEALTH BOX */}
                    <div ref={wealthRef} className="relative hover-container">
                        <div className="main-card bg-white p-10 rounded-[2rem] shadow-2xl relative z-10 min-h-[280px] flex flex-col justify-center">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <i className="fas fa-chart-pie text-black text-2xl"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-black mb-4">
                                Intelligent Wealth Tools
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Access analytics, portfolio tracking, and AI-powered
                                financial insights to grow your wealth strategically.
                            </p>
                        </div>

                        {/* Mini Cards */}
                        <div className="mini-card top-card bg-white text-black shadow-xl border border-gray-100">
                            AI Portfolio Insights
                        </div>

                        <div className="mini-card bottom-card bg-white text-black shadow-xl border border-gray-100">
                            Smart Analytics
                        </div>

                        <div className="mini-card bottom-card-2 bg-white text-black shadow-xl border border-gray-100">
                            Growth Tracking
                        </div>
                    </div>

                </div>
            </section>
            {/* Stats Section */}
            <div className="relative z-10 w-full flex flex-wrap justify-center gap-16 md:gap-32 text-center pb-24 pt-8">
                <div className="flex flex-col items-center">
                    <p className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">2025</p>
                    <p className="text-gray-200 text-sm md:text-base tracking-[0.25em] uppercase font-medium drop-shadow-md">Founded</p>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">24/7</p>
                    <p className="text-gray-200 text-sm md:text-base tracking-[0.25em] uppercase font-medium drop-shadow-md">Support</p>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-5xl md:text-6xl font-bold text-emerald-400 mb-3 drop-shadow-lg tracking-tight">$1B+</p>
                    <p className="text-gray-200 text-sm md:text-base tracking-[0.25em] uppercase font-medium drop-shadow-md">Assets</p>
                </div>
            </div>

            {/* 3 Minimal Feature Cards */}
            <section className="relative z-10 w-full pt-16 pb-20 px-12">
                <div className="mx-auto grid md:grid-cols-3 gap-12 max-w-[1200px]">
                    <div className="bg-[#0f0f13]/50 p-8 rounded-[1.5rem] hover:-translate-y-2 transition duration-300">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                            <i className="fas fa-bolt text-emerald-400 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">Instant Transfers</h3>
                        <p className="text-gray-400 leading-relaxed">Send money globally in seconds with zero hidden fees or delays.</p>
                    </div>
                    <div className="bg-[#0f0f13]/50 p-8 rounded-[1.5rem] hover:-translate-y-2 transition duration-300">
                        <div className="w-12 h-12 rounded-full bg-[#19bcfd]/10 flex items-center justify-center mb-6">
                            <i className="fas fa-shield-alt text-[#19bcfd] text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">Advanced Security</h3>
                        <p className="text-gray-400 leading-relaxed">Military-grade encryption and real-time fraud monitoring 24/7.</p>
                    </div>
                    <div className="bg-[#0f0f13]/50 p-8 rounded-[1.5rem] hover:-translate-y-2 transition duration-300">
                        <div className="w-12 h-12 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mb-6">
                            <i className="fas fa-chart-line text-[#f59e0b] text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">Real-time Analytics</h3>
                        <p className="text-gray-400 leading-relaxed">Track your portfolio and spending habits with smart insights.</p>
                    </div>
                </div>
            </section>


            {/* Brand Statement Section */}
            <section className="relative z-10 bg-[#0c0f14] pt-12 pb-32 px-8">
                <div className="max-w-[1000px] mx-auto text-center">

                    <p className="text-emerald-400 font-semibold tracking-widest text-sm mb-6">
                        OUR PHILOSOPHY
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-10 text-white">
                        Banking built for the <br />
                        <span className="text-emerald-400">modern investor.</span>
                    </h2>

                    <p className="text-gray-400 text-lg leading-relaxed max-w-[750px] mx-auto">
                        NexBank combines institutional-grade security with intelligent financial tools,
                        delivering a seamless digital banking experience. Designed for individuals and
                        businesses who expect more — transparency, speed, and complete control.
                    </p>

                </div>
            </section>

            <style>{`
                .nav-link {
                    position: relative;
                }
                .nav-link::after {
                    content: "";
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -6px;
                    left: 0;
                    background: #00e97a;
                    transition: width 0.3s ease;
                }
                .nav-link:hover::after {
                    width: 100%;
                }
            .signup-btn {
                box-shadow: 0 8px 25px rgba(0,233,122,0.3);
                }
            .hero-btn-hover:hover {
                transform: translateY(-3px);
                }
            .hero-animate-fade-in {
                animation: fadeInHero 1s ease-out forwards;
                }
            @keyframes fadeInHero {
                from {opacity: 0; transform: translateY(20px); }
            to {opacity: 1; transform: translateY(0); }
                }

            /* Wrapper */
            .hero-floating-wrapper {
                position: absolute;
            right: 4%;
            top: 15%;
            width: 520px;
            height: 580px;
                }

            /* Card Base */
            .floating-card {
                position: absolute;
            width: 260px;
            height: 260px;
            padding: 24px;
            border-radius: 26px;
            backdrop-filter: blur(25px);
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
                }

            .chart-wrapper {
                flex: 1;
            margin-top: 12px;
                }

            .chart-wrapper.center {
                display: flex;
            align-items: center;
            justify-content: center;
                }

            /* Individual Positions */
            .card-1 {
                top: 0;
            right: 0;
            z-index: 3;
                }

            .card-2 {
                top: 200px;
            left: 0;
            z-index: 2;
            animation-delay: 1s;
                }

            .card-3 {
                bottom: 0;
            right: 70px;
            z-index: 1;
            animation-delay: 2s;
                }

            /* Title */
            .card-title {
                font-size: 0.9rem;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
                }

            /* Glow Background */
            .hero-floating-wrapper::before {
                content: "";
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(0,233,122,0.25) 0%, transparent 70%);
            top: -180px;
            right: -180px;
            z-index: -1;
            filter: blur(120px);
                }



            .hover-container {
                position: relative;
                }
            .mini-card {
                position: absolute;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 20px;
            border-radius: 16px;
            font-size: 0.85rem;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }
            /* Positioning */
            .top-card {
                top: -60px;
                }
            .bottom-card {
                bottom: -60px;
                }
            .bottom-card-2 {
                bottom: -120px;
                }
            `}</style>
        </div >
    );
};

export default Home;