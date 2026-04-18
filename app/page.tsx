import Link from "next/link";
import React from "react";
import { Github, Linkedin, Smartphone } from "lucide-react";
import Particles from "./components/particles";
import { Skills } from "./components/skills";

const SOCIAL_LINKS = {
    github: "https://github.com/tashilapathum",
    linkedin: "https://linkedin.com/in/tashila-pathum",
    playStore: "https://play.google.com/store/apps/developer?id=Tashila+Pathum",
};

const navigation = [
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
];

const stats = [
    { label: "Years Experience", value: "7+" },
    { label: "Apps Built", value: "15+" },
    { label: "Languages", value: "3+" },
];

export default function Home() {
    return (
        <div className="flex flex-col items-center w-screen min-h-screen overflow-y-auto bg-gradient-to-tl from-black via-zinc-600/20 to-black">
            <nav className="mt-12 mb-8 sm:mt-16 sm:mb-12 animate-fade-in">
                <ul className="flex items-center justify-center gap-4 sm:gap-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="px-3 py-2 sm:px-4 text-sm sm:text-lg font-medium duration-300 transition-all
                                       rounded-lg hover:bg-zinc-800 hover:bg-opacity-50
                                       text-zinc-400 hover:text-white hover:scale-105
                                       border border-transparent hover:border-zinc-700"
                        >
                            {item.name}
                        </Link>
                    ))}
                </ul>
            </nav>

            <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />

            <Particles className="fixed inset-0 -z-10 animate-fade-in" quantity={100} />

            {/* Hero */}
            <div className="flex flex-col items-center text-center px-4 py-8 sm:py-12 animate-fade-in">
                <img
                    src="https://avatars.githubusercontent.com/u/43470527"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-6 ring-2 ring-zinc-700"
                    alt="Tashila Pathum"
                />
                <h1 className="py-3.5 px-0.5 z-10 text-5xl text-transparent duration-500 bg-white cursor-default text-edge-outline animate-title font-display sm:text-7xl md:text-9xl whitespace-nowrap bg-clip-text">
                    Tashila Pathum
                </h1>
                <p className="mt-4 text-base sm:text-lg text-zinc-400 font-medium">
                    Senior Mobile Software Engineer
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                    Android · Kotlin · Java · Flutter
                </p>

                {/* Social links */}
                <div className="flex items-center gap-4 mt-6">
                    <a
                        href={SOCIAL_LINKS.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="p-2 text-zinc-500 hover:text-white transition-colors duration-200"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                    <a
                        href={SOCIAL_LINKS.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="p-2 text-zinc-500 hover:text-accent transition-colors duration-200"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                        href={SOCIAL_LINKS.playStore}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Google Play"
                        className="p-2 text-zinc-500 hover:text-accent transition-colors duration-200"
                    >
                        <Smartphone className="w-5 h-5" />
                    </a>
                </div>
            </div>

            <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-16 py-8 sm:py-10 animate-fade-in">
                {stats.map((stat, i) => (
                    <React.Fragment key={stat.label}>
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-white font-display">
                                {stat.value}
                            </p>
                            <p className="text-xs sm:text-sm text-zinc-500 mt-1">{stat.label}</p>
                        </div>
                        {i < stats.length - 1 && (
                            <div className="h-8 w-px bg-zinc-800" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Skills */}
            <div className="w-full max-w-2xl px-6 pb-16 animate-fade-in">
                <p className="text-xs font-semibold text-accent uppercase tracking-widest text-center mb-8">
                    Skills & Technologies
                </p>
                <Skills />
            </div>
        </div>
    );
}
