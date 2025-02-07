import React, { useState, useEffect, useCallback, useMemo } from 'react';

const MLNodeGraph = React.memo(() => {
  const skills = useMemo(() => ({
    input: [
      { name: 'Mathematics', icon: '📐', description: 'Foundational analytical skills' },
      { name: 'Statistics', icon: '📊', description: 'Data interpretation and analysis' },
      { name: 'Computer Science', icon: '💻', description: 'Technical computational knowledge' },
    ],
    hidden1: [
      { name: 'Python', icon: '🐍', description: 'Primary programming language' },
      { name: 'C', icon: '🟦', description: 'Low-level systems programming' },
      { name: 'R', icon: '📈', description: 'Statistical computing' },
      { name: 'SQL', icon: '🗄️', description: 'Database management' },
      { name: 'MATLAB', icon: '🧮', description: 'Numerical analysis' },
    ],
    hidden2: [
      { name: 'Machine Learning', icon: '🤖', description: 'Advanced AI techniques' },
      { name: 'Data Analysis', icon: '📑', description: 'Extracting insights from data' },
      { name: 'Web Development', icon: '🌐', description: 'Creating web applications' },
    ],
    output: [
      { name: 'Projects', icon: '🎯', description: 'Practical applications' },
      { name: 'Research', icon: '🔬', description: 'Academic and innovative work' },
      { name: 'Applications', icon: '⚡', description: 'Real-world solutions' },
    ]
  }), []);

  // Helper array to define the order of layers.
  const layerOrder = useMemo(() => ['input', 'hidden1', 'hidden2', 'output'], []);

  // Initialize each signal path with one random node per layer.
  const generateRandomPath = useCallback(() => {
    return layerOrder.map(layerName => ({
      layer: layerName,
      node: Math.floor(Math.random() * skills[layerName].length)
    }));
  }, [layerOrder, skills]);

  const [animationState, setAnimationState] = useState({
    activeSignalPaths: [generateRandomPath(), generateRandomPath()],
    signalProgress: [0, 0],
    currentLayerIndexes: [0, 0],
    hoveredNode: null,
    activeNodes: [] // This will hold the currently lit node for each path.
  });

  const layers = useMemo(() => ({
    input: { x: 100, items: skills.input },
    hidden1: { x: 300, items: skills.hidden1 },
    hidden2: { x: 500, items: skills.hidden2 },
    output: { x: 700, items: skills.output },
  }), [skills]);

  // Calculate the vertical position for nodes in a given layer.
  // All nodes are spaced equally (using fixed spacing), and the entire column is centered.
  const calculateNodeY = useCallback((layer, index) => {
    const { items } = layers[layer];
    const nodeCount = items.length;
    
    const spacing = 100; // Fixed vertical spacing between nodes.
    
    if (nodeCount === 1) {
      return 250; // Center a single node vertically.
    }
    
    const totalHeight = (nodeCount - 1) * spacing;
    const topOffset = (500 - totalHeight) / 2;
    
    return topOffset + index * spacing;
  }, [layers]);

  const renderNode = useCallback((x, y, skill, isActive, layer, index) => {
    const isNodeActive = animationState.activeNodes.some(
      activeNode => activeNode.layer === layer && activeNode.node === index
    );

    return (
      <g
        key={`${layer}-${index}`}
        onMouseEnter={() => setAnimationState(prev => ({ ...prev, hoveredNode: { layer, index } }))}
        onMouseLeave={() => setAnimationState(prev => ({ ...prev, hoveredNode: null }))}
        className="cursor-pointer"
        role="button"
        aria-label={`${skill.name} skill node`}
        tabIndex={0}
      >
        {isNodeActive && (
          <circle
            cx={x}
            cy={y}
            r={45}
            fill="rgba(147, 51, 234, 0.2)"
            filter="blur(10px)"
            className="animate-pulse"
          />
        )}
        <circle
          cx={x}
          cy={y}
          r={35}
          fill={
            isNodeActive 
              ? 'rgba(147, 51, 234, 0.5)' 
              : (isActive ? 'rgba(147, 51, 234, 0.3)' : 'rgba(31, 41, 55, 0.5)')
          }
          stroke={
            isNodeActive 
              ? 'rgba(147, 51, 234, 1)' 
              : (isActive ? 'rgba(147, 51, 234, 0.8)' : 'rgba(75, 85, 99, 0.5)')
          }
          strokeWidth={3}
          className="transition-all duration-300"
          aria-hidden="true"
        />
        <text
          x={x}
          y={y - 7}
          textAnchor="middle"
          fill="white"
          fontSize="22"
          className="select-none pointer-events-none"
          aria-hidden="true"
        >
          {skill.icon}
        </text>
        <text
          x={x}
          y={y + 22}
          textAnchor="middle"
          fill="white"
          fontSize="13"
          className="select-none pointer-events-none"
          aria-hidden="true"
        >
          {skill.name}
        </text>
        <title>{skill.description}</title>
      </g>
    );
  }, [animationState.activeNodes]);

  // Render connection lines with increased stroke width and opacity.
  const renderConnection = useCallback((x1, y1, x2, y2) => (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(147, 51, 234, 0.6)"
      strokeWidth={3}
      className="transition-all duration-300"
      aria-hidden="true"
    />
  ), []);

  const renderSignalDot = useCallback((x1, y1, x2, y2, progress) => {
    const x = x1 + (x2 - x1) * progress;
    const y = y1 + (y2 - y1) * progress;
    return (
      <>
        <circle
          cx={x}
          cy={y}
          r={6}
          fill="rgba(255, 255, 255, 0.4)"
          filter="blur(2px)"
          className="transition-all duration-150"
          aria-hidden="true"
        />
        <circle
          cx={x}
          cy={y}
          r={5}
          fill="rgb(255, 255, 255)"
          className="transition-all duration-150"
          aria-hidden="true"
        />
      </>
    );
  }, []);

  // Update animation: increment the progress for each signal path.
  // Once the progress reaches 1:
  //   - If the current node is not the last in its path, move forward.
  //   - If the current node is the last (i.e. output layer), generate a new random path.
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState(prev => {
        // Clone state arrays so we can modify them.
        const newSignalProgress = [...prev.signalProgress];
        const newLayerIndexes = [...prev.currentLayerIndexes];
        const newPaths = [...prev.activeSignalPaths];

        newSignalProgress.forEach((progress, idx) => {
          let newProgress = progress + 0.1;
          if (newProgress >= 1) {
            // If we are not yet at the last layer, move forward.
            if (newLayerIndexes[idx] < newPaths[idx].length - 1) {
              newLayerIndexes[idx] = newLayerIndexes[idx] + 1;
            } else {
              // Otherwise, generate a new random path.
              newPaths[idx] = generateRandomPath();
              newLayerIndexes[idx] = 0;
            }
            newProgress = 0;
          }
          newSignalProgress[idx] = newProgress;
        });

        // Update the active nodes to always include the node at the current index for each path.
        const newActiveNodes = newPaths.map((path, idx) => path[newLayerIndexes[idx]]);

        return {
          ...prev,
          signalProgress: newSignalProgress,
          currentLayerIndexes: newLayerIndexes,
          activeNodes: newActiveNodes,
          activeSignalPaths: newPaths
        };
      });
    }, 150);

    return () => clearInterval(interval);
  }, [generateRandomPath]);

  return (
    <div 
      className="w-full bg-gray-900 rounded-xl p-6" 
      aria-label="Skills and Expertise Visualization"
    >
      <h3 
        className="text-4xl font-extrabold text-white text-center 
                  bg-gradient-to-r from-purple-400 to-purple-700 
                  bg-clip-text text-transparent drop-shadow-lg"
        id="skills-heading"
      >
        Skills & Expertise
      </h3>
      <div className="w-32 h-1 bg-blue-800 mx-auto mt-2 rounded-full"></div>

      <svg 
        viewBox="0 0 800 500" 
        className="w-full" 
        aria-labelledby="skills-heading"
        role="img"
      >
        {/* Optional: add SVG filter definitions here for extra glow if desired */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render connections between nodes */}
        {Object.keys(layers).slice(0, -1).map((sourceLayer, layerIndex) => {
          const targetLayer = Object.keys(layers)[layerIndex + 1];
          return layers[sourceLayer].items.flatMap((_, sourceIndex) =>
            layers[targetLayer].items.map((_, targetIndex) =>
              renderConnection(
                layers[sourceLayer].x,
                calculateNodeY(sourceLayer, sourceIndex),
                layers[targetLayer].x,
                calculateNodeY(targetLayer, targetIndex)
              )
            )
          );
        })}

        {/* Render nodes */}
        {Object.entries(layers).map(([layerName, layer]) =>
          layer.items.map((skill, index) =>
            renderNode(
              layer.x,
              calculateNodeY(layerName, index),
              skill,
              animationState.hoveredNode?.layer === layerName && animationState.hoveredNode?.index === index,
              layerName,
              index
            )
          )
        )}

        {/* Render signal dots between the current and next node */}
        {animationState.activeSignalPaths.map((path, idx) => {
          const currentLayer = path[animationState.currentLayerIndexes[idx]];
          // Only draw the dot if there is a next layer in the current path.
          if (animationState.currentLayerIndexes[idx] < path.length - 1) {
            const nextLayer = path[animationState.currentLayerIndexes[idx] + 1];
            return renderSignalDot(
              layers[currentLayer.layer].x,
              calculateNodeY(currentLayer.layer, currentLayer.node),
              layers[nextLayer.layer].x,
              calculateNodeY(nextLayer.layer, nextLayer.node),
              animationState.signalProgress[idx]
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
});

export default MLNodeGraph;
