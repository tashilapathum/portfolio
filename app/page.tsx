import Link from "next/link";
import React from "react";
import Particles from "./components/particles";

const navigation = [
    {name: "Projects", href: "/projects"},
    {name: "Contact", href: "/contact"},
];

export default function Home() {
    return (
        <div
            className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
            <nav className="my-16 animate-fade-in">
                <ul className="flex items-center justify-center gap-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
                        >
                            {item.name}
                        </Link>
                    ))}
                </ul>
            </nav>
            <div
                className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"/>
            <Particles
                className="absolute inset-0 -z-10 animate-fade-in"
                quantity={100}
            />
            <img src={"https://avatars.githubusercontent.com/u/43470527"} className={"w-64 h-64 rounded-full animate-fade-in"} alt={"profile picture"}/>
            <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-500 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
                Tashila Pathum
            </h1>

            <div
                className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"/>
            <div className="my-8 animate-fade-in">
                <h2 className="text-m text-zinc-500">
                    I'm a Mobile Software Engineer with:
                </h2>
                <ul className="list-disc pl-6 mt-2 text-zinc-500">
                    <li>5+ years of experience in Native Android development using Java, Kotlin and Firebase</li>
                    <li>Hands-on experience with Flutter for cross-platform development</li>
                    <li>Working knowledge of iOS development with Objective C</li>
                </ul>
            </div>
        </div>
    );

}
