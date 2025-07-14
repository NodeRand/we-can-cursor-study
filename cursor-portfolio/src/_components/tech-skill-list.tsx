'use client';

const skills = ['JS', 'TS', 'React', 'Tailwindcss', 'Premierepro'];

const TechSkillList = () => (
    <div className="flex flex-wrap gap-3 mt-4">
        {skills.map(skill => (
            <span
                key={skill}
                className="inline-flex items-center border border-gray-400 rounded-full px-4 py-1 text-xs font-semibold bg-gray-50 text-gray-900"
            >
                {skill}
            </span>
        ))}
    </div>
);

export default TechSkillList;
