const skillGroups = [
    {
        label: "Languages",
        skills: ["Kotlin", "Java", "Dart"],
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
        label: "Cross-platform",
        skills: ["Flutter", "Compose Multiplatform"],
    },
    {
        label: "Cloud & Backend",
        skills: ["Firebase", "Supabase", "Ktor", "OpenAI API"],
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
