
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MemoryNode, UserProfile, Project } from '../../types';
import { MOCK_MEMORY_GRAPH_NODES } from '../../constants';

interface MemoryGraphProps {
  profile?: UserProfile;
  projects?: Project[];
}

const MemoryGraph: React.FC<MemoryGraphProps> = ({ profile, projects = [] }) => {
  const [nodes, setNodes] = useState<MemoryNode[]>([]);

  // Generate dynamic nodes based on user data
  useEffect(() => {
    if (!profile) {
      setNodes(MOCK_MEMORY_GRAPH_NODES);
      return;
    }

    const dynamicNodes: MemoryNode[] = [];

    // Add archetype as central trait
    dynamicNodes.push({
      id: 'archetype',
      label: profile.archetype || 'Visionary Architect',
      type: 'TRAIT',
      value: profile.level || 1,
      x: 50,
      y: 50,
      connections: []
    });

    // Add traits from profile
    if (profile.traits) {
      profile.traits.forEach((trait, index) => {
        const angle = (index / profile.traits!.length) * 2 * Math.PI;
        const radius = 30;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;

        dynamicNodes.push({
          id: `trait_${trait.name.toLowerCase()}`,
          label: trait.name,
          type: trait.score > 70 ? 'STRENGTH' : trait.score > 40 ? 'INTEREST' : 'WEAKNESS',
          value: trait.score,
          x,
          y,
          connections: ['archetype']
        });

        // Connect to archetype
        const archetypeNode = dynamicNodes.find(n => n.id === 'archetype');
        if (archetypeNode) {
          archetypeNode.connections.push(`trait_${trait.name.toLowerCase()}`);
        }
      });
    }

    // Add project insights
    const validatedProjects = projects.filter(p => p.stage === 'Validation' || p.stage === 'Build');
    if (validatedProjects.length > 0) {
      dynamicNodes.push({
        id: 'validation_strength',
        label: 'Validation',
        type: 'STRENGTH',
        value: Math.min(validatedProjects.length * 20, 100),
        x: 70,
        y: 30,
        connections: ['archetype']
      });

      // Connect archetype to validation
      const archetypeNode = dynamicNodes.find(n => n.id === 'archetype');
      if (archetypeNode) {
        archetypeNode.connections.push('validation_strength');
      }
    }

    // Add industry focus
    const industries = [...new Set(projects.map(p => p.industry).filter(Boolean))];
    if (industries.length > 0) {
      industries.forEach((industry, index) => {
        const angle = (index / industries.length) * 2 * Math.PI;
        const radius = 40;
        const x = 50 + Math.cos(angle + Math.PI) * radius; // Opposite side
        const y = 50 + Math.sin(angle + Math.PI) * radius;

        dynamicNodes.push({
          id: `industry_${industry.toLowerCase()}`,
          label: industry,
          type: 'INTEREST',
          value: 60 + Math.random() * 20, // Random interest level
          x,
          y,
          connections: ['archetype']
        });

        // Connect archetype to industry
        const archetypeNode = dynamicNodes.find(n => n.id === 'archetype');
        if (archetypeNode) {
          archetypeNode.connections.push(`industry_${industry.toLowerCase()}`);
        }
      });
    }

    setNodes(dynamicNodes);
  }, [profile, projects]);

  // Simple physics simulation for drifting nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        x: node.x + (Math.random() - 0.5) * 0.5,
        y: node.y + (Math.random() - 0.5) * 0.5
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'STRENGTH': return '#2EC7FF'; // Primary
      case 'WEAKNESS': return '#EF4444'; // Red
      case 'INTEREST': return '#FFD60A'; // Accent
      case 'TRAIT': return '#AA66FF';    // Secondary
      default: return '#FFFFFF';
    }
  };

  return (
    <div className="relative mt-20 w-full h-[400px] bg-black/40 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-sm">
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <h3 className="text-white font-bold text-lg">Memory Graph</h3>
        <p className="text-xs text-text-muted">Dynamic behavioral mapping</p>
      </div>

      <svg className="w-full h-full">
        {/* Connections */}
        {nodes.map(node => (
          node.connections.map(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;
            return (
              <motion.line
                key={`${node.id}-${target.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            );
          })
        ))}

        {/* Nodes */}
        {nodes.map(node => (
          <g key={node.id}>
             <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.value / 3} // Scale radius
                fill={getTypeColor(node.type)}
                fillOpacity="0.1"
                stroke={getTypeColor(node.type)}
                strokeWidth="1"
                animate={{
                   r: [node.value / 3, node.value / 3 + 5, node.value / 3],
                   strokeOpacity: [0.5, 1, 0.5]
                }}
                transition={{
                   duration: 4,
                   repeat: Infinity,
                   ease: "easeInOut"
                }}
                className="cursor-pointer hover:fill-opacity-30 transition-all"
             />
             <motion.text
               x={`${node.x}%`}
               y={`${node.y}%`}
               dy={5}
               textAnchor="middle"
               fill="white"
               fontSize="10"
               fontWeight="bold"
               className="pointer-events-none"
             >
                {node.label}
             </motion.text>
          </g>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-6 flex flex-col gap-2 pointer-events-none">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2EC7FF]"></div>
            <span className="text-[10px] text-text-muted">Strength</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
            <span className="text-[10px] text-text-muted">Gap</span>
         </div>
      </div>
    </div>
  );
};

export default MemoryGraph;
