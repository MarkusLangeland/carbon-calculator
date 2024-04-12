// "use client"
import { motion } from 'framer-motion';

const TreeAnimation = ({ treesNeeded }) => {
    const treeVariants = {
      hidden: { scale: 0 },
      visible: i => ({
        scale: [0, Math.random() * 0.5 + 0.75], // random scale between 0.75 and 1.25
        transition: {
          delay: i * 0.1,
        },
      }),
    };
  
    const centerOffset = 45; // Start at the center of the container
    const spread = 5; // Percentage of the container width each tree will be apart
  
    // Function to calculate position based on index
    const calculatePosition = (index) => {
      let offset = spread * Math.floor((index + 1) / 2);
      if (index % 2 === 0) { // Even index, place to the right
        return centerOffset + offset;
      } else { // Odd index, place to the left
        return centerOffset - offset;
      }
    };
  
    const treesArray = Array.from({ length: treesNeeded }, (_, i) => ({
      id: i,
      x: calculatePosition(i),
      y: Math.floor(Math.random() * 10) + 35, // Reduced and centered Y range (35% to 45%)
    }));
  
    return (
      <div className=" relative w-full h-[300px] overflow-hidden flex justify-center">
        {treesArray.map((tree) => (
          <motion.img
            key={tree.id}
            src="https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Foak-tree-vector-graphic-2d-vector-style-detailed-illustration_961038-36700.jpg"
            alt="Tree"
            variants={treeVariants}
            initial="hidden"
            animate="visible"
            custom={tree.id}
            className="absolute mix-blend-darken w-[125px] h-auto"
            style={{
              left: `${tree.x}%`,
              top: `${tree.y}%`,
            }}
          />
        ))}
        <div className="flex justify-center p-20 text-center">
          <h2 className="text-xl font-bold">You saved the equivalent of {treesNeeded} trees by choosing the green option.</h2>
        </div>
      </div>
    );
  };

  export { TreeAnimation }