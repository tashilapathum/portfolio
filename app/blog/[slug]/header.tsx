"use client";
import {ArrowLeft, Linkedin, Share2, Link2, Github} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FacebookShareButton, LinkedinShareButton, RedditShareButton } from "react-share";
import { FacebookIcon, LinkedinIcon, RedditIcon } from "react-share";
import ShareSheet from "@/app/components/share";

type Props = {
    post: {
        title: string;
        description?: string;
        date?: string;
    };
};

export const Header: React.FC<Props> = ({ post }) => {
    const ref = useRef<HTMLElement>(null);
    const [isIntersecting, setIntersecting] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const toggleShareSheet = () => setIsOpen(!isOpen);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting),
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <header
            ref={ref}
            className="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black"
        >
            <div
                className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
                    isIntersecting
                        ? "bg-zinc-900/0 border-transparent"
                        : "bg-white/10  border-zinc-200 lg:border-transparent"
                }`}
            >
                <div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
                    <div className="flex justify-between gap-8">
                        <div className="relative">
                            <button
                                onClick={toggleShareSheet}
                                className={`w-6 h-6 duration-200 hover:font-medium ${
                                    isIntersecting
                                        ? "text-zinc-400 hover:text-zinc-100"
                                        : "text-zinc-600 hover:text-zinc-900"
                                }`}
                            >
                                <Share2
                                    className={`w-6 h-6 duration-200 hover:font-medium ${
                                        isIntersecting
                                            ? " text-zinc-400 hover:text-zinc-100"
                                            : "text-zinc-600 hover:text-zinc-900"
                                    } `}
                                />
                            </button>

                            {/* Share Sheet */}
                            {isOpen && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                                    <ShareSheet url={window.location.href} />
                                </div>
                            )}
                        </div>
                        <Link target="_blank" href="https://www.linkedin.com/in/tashilapathum">
                            <Linkedin
                                className={`w-6 h-6 duration-200 hover:font-medium ${
                                    isIntersecting
                                        ? " text-zinc-400 hover:text-zinc-100"
                                        : "text-zinc-600 hover:text-zinc-900"
                                } `}
                            />
                        </Link>
                        <Link target="_blank" href="https://github.com/tashilapathum">
                            <Github
                                className={`w-6 h-6 duration-200 hover:font-medium ${
                                    isIntersecting
                                        ? " text-zinc-400 hover:text-zinc-100"
                                        : "text-zinc-600 hover:text-zinc-900"
                                } `}
                            />
                        </Link>
                    </div>

                    <Link
                        href="./"
                        className={`duration-200 hover:font-medium ${
                            isIntersecting
                                ? " text-zinc-400 hover:text-zinc-100"
                                : "text-zinc-600 hover:text-zinc-900"
                        } `}
                    >
                        <ArrowLeft className="w-6 h-6 "/>
                    </Link>
                </div>
            </div>
            <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
                            {post.title}
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-zinc-300">
                            {post.description}
                        </p>
                        {post.date && (
                            <time className="mt-4 text-zinc-400 block">
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};