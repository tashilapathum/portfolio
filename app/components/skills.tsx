const skillGroups = [
    {
        label: "Native Android",
        skills: ["Kotlin", "Java", "Gradle"],
    },
    {
        label: "Cross-platform",
        skills: ["Flutter", "Dart", "Compose Multiplatform"],
    },
    {
        label: "Android",
        skills: ["Jetpack Compose", "Room", "Coroutines", "Media3", "WorkManager", "Koin", "Material 3"],
    },
    {
        label: "Architecture",
        skills: ["MVVM", "Clean Architecture", "Multi-module", "Offline-first"],
    },
    {
        label: "Services & Cloud",
        skills: ["Firebase", "Google Cloud", "Supabase", "Vercel", "Jira"],
    },
    {
        label: "Backend",
        skills: ["Ktor", "PostgreSQL", "Render"],
    },
    {
        label: "Web",
        skills: ["Next.js", "TailwindCSS"],
    },
    {
        label: "iOS",
        skills: ["Swift", "Objective-C"],
    },
];

export function Skills() {
    return (
        <div className="w-full space-y-6">
            {skillGroups.map((group) => (
                <div key={group.label}>
                    <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">
                        {group.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {group.skills.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 text-sm text-zinc-300 border border-zinc-700 rounded-full bg-zinc-900/50 hover:border-accent/50 hover:text-white transition-colors duration-200 cursor-default"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
