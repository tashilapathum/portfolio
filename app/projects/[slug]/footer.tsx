"use client";
import React, {useRef} from "react";
import {Project} from "contentlayer/generated";
import Link from "next/link";

type Props = {
    project: Project
};
export const Footer: React.FC<Props> = ({project}) => {
    const ref = useRef<HTMLElement>(null);
    const links: { label: string; href: string }[] = [];

    links.push({
        label: "Privacy Policy",
        href: `/projects/${project.slug}/privacy`,
    });
    links.push({
        label: "Terms of Service",
        href: `/projects/${project.slug}/terms`,
    });

    if (project.agreements)
        return (
            <footer
                ref={ref}
                className="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black py-12 sm:py-16">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <div
                        className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex md:justify-center lg:gap-x-10">
                        {links.map((link) => (
                            <Link target="_blank" key={link.label} href={link.href}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </footer>
        );
}