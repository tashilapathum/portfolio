import {
    FacebookShareButton,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    RedditShareButton,
    RedditIcon,
} from "react-share";
import { Link2 } from "lucide-react";
import { useState } from "react";

interface ShareSheetProps {
    url: string; // Pass URL as a prop for flexibility
    className?: string; // Optional custom styling
}

export default function ShareSheet({ url, className }: ShareSheetProps) {
    const [copied, setCopied] = useState(false);

    return (
        <div className={`bg-zinc-800 shadow-md p-4 rounded-lg z-10 max-w-xs ${className}`}>
            <p className="text-sm mb-2 font-medium text-zinc-200 text-center">
                Share this page
            </p>
            <div className="flex space-x-2">
                <FacebookShareButton url={url}>
                    <FacebookIcon size={32} round iconFillColor="white" bgStyle={{ fill: "#3b5998" }} />
                </FacebookShareButton>

                <LinkedinShareButton url={url}>
                    <LinkedinIcon size={32} round iconFillColor="white" bgStyle={{ fill: "#0077B5" }} />
                </LinkedinShareButton>

                <RedditShareButton url={url}>
                    <RedditIcon size={32} round iconFillColor="white" />
                </RedditShareButton>

                {/* Copy Link Button */}
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(url).then(() => {
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        });
                    }}
                    className="flex items-center justify-center w-8 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-full"
                >
                    <Link2 className="w-6 h-6 text-zinc-400 hover:text-zinc-100" />
                </button>
            </div>
            {copied && <p className="text-xs text-green-500 text-center mt-2">Copied!</p>}
        </div>
    );
}