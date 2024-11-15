"use client";
import {ArrowLeft, Copy, CopyIcon, Github, Link2, Share2, Twitter} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, RedditShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, LinkedinIcon, RedditIcon } from "react-share";

type Props = {
	project: {
		url?: string;
		title: string;
		description: string;
		repository?: string;
	};

	views: number;
};
export const Header: React.FC<Props> = ({ project, views }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const toggleShareSheet = () => setIsOpen(!isOpen);
	const [copied, setCopied] = useState(false);

	const links: { label: string; href: string }[] = [];
	if (project.repository) {
		links.push({
			label: "View source on GitHub",
			href: `https://github.com/${project.repository}`,
		});
	}
	if (project.url) {
		links.push({
			label: "Download on Google Play",
			href: project.url,
		});
	}
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
								<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-zinc-800 shadow-md p-4 rounded-lg z-10 max-w-xs">
									<p className="text-sm mb-2 font-medium text-zinc-200 text-center">Share this page</p>
									<div className="flex space-x-2">
										<FacebookShareButton url={window.location.href}>
											<FacebookIcon size={32} round iconFillColor="white"
														  bgStyle={{fill: '#3b5998'}}/>
										</FacebookShareButton>
										<LinkedinShareButton url={window.location.href}>
											<LinkedinIcon size={32} round iconFillColor="white"
														  bgStyle={{fill: '#0077B5'}}/>
										</LinkedinShareButton>
										<RedditShareButton url={window.location.href}>
											<RedditIcon size={32} round iconFillColor="white"/>
										</RedditShareButton>

										{/* Copy Link Button */}
										<button
											onClick={() => {
												navigator.clipboard.writeText(window.location.href).then(r => {
													setCopied(true);
													setTimeout(() => setCopied(false), 2000);
												});
											}}
											className="flex items-center justify-center w-8 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-full"
										>
											<Link2
												className={`w-6 h-6 duration-200 hover:font-medium ${
													isIntersecting
														? " text-zinc-400 hover:text-zinc-100"
														: "text-zinc-600 hover:text-zinc-900"
												} `}
											/>
										</button>
									</div>
									{copied && <p className="text-xs text-green-500 text-center mt-2">Copied!</p>}
								</div>
							)}
						</div>
						<Link target="_blank" href="https://tashilapathum.bsky.social">
							<Twitter
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
						href="/projects"
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
			<div className="container mx-auto relative isolate overflow-hidden  py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
							{project.title}
						</h1>
						<p className="mt-6 text-lg leading-8 text-zinc-300">
							{project.description}
						</p>
					</div>

					<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
						<div
							className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
							{links.map((link) => (
								<Link target="_blank" key={link.label} href={link.href}>
									{link.label} <span aria-hidden="true">&rarr;</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
