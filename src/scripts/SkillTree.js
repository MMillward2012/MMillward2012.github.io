import React from 'react';

const SkillTree = () => {
  const skills = [
    {
      name: 'Python',
      icon: '🐍', // Using emoji as a placeholder, you can replace with your SVG/image path
    },
    {
      name: 'JavaScript',
      icon: '🟨',
    },
    {
      name: 'R',
      icon: '📊',
    },
    {
      name: 'SQL',
      icon: '🗄️',
    },
  ];

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Skill Tree
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6
                       flex flex-col items-center justify-center gap-3 
                       transform transition-all duration-300
                       hover:scale-105 hover:bg-gray-700/50 hover:border-purple-500/50
                       group cursor-pointer"
          >
            <div className="text-4xl mb-2 transform transition-transform duration-300 group-hover:scale-110">
              {skill.icon}
            </div>
            <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;