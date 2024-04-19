// "use client"
import { motion } from 'framer-motion';

const TreeAnimation = ({ treesNeeded, windowWidth }) => {

  
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
    const spread = 4; // Percentage of the container width each tree will be apart
  
    // Function to calculate position based on index
    const calculatePosition = (index) => {
      let offset = spread * Math.floor((index + 1) / 2);
      if (index % 2 === 0) { // Even index, place to the right
        return centerOffset + offset;
      } else { // Odd index, place to the left
        return centerOffset - offset;
      }
    };
  
    const treesArray = Array.from({ length: Math.min(Math.floor(windowWidth / 70), treesNeeded)  }, (_, i) => ({
      id: i,
      x: calculatePosition(i),
      y: Math.floor(Math.random() * 10) + 50 , // Reduced and centered Y range (35% to 45%)
    }));
  
    return (
      <div className=" relative w-full h-[300px] overflow-hidden flex justify-center gap-10">
        <div className="flex justify-center p-20 text-center">
          <h2 className="text-xl font-bold">You saved {treesNeeded/10} tones CO2 by choosing the green option. This is equivalent to {treesNeeded} trees planted</h2>
        </div>
        {treesArray.map((tree, index) => (
          <motion.img
            key={tree.id}
            // src="https://atlas-content-cdn.pixelsquid.com/stock-images/low-poly-tree-QJ46DNA-600.jpg"
            src= {index % 3 == 0 ? "https://atlas-content-cdn.pixelsquid.com/stock-images/low-poly-tree-z01Dn42-600.jpg" : "https://atlas-content-cdn.pixelsquid.com/stock-images/low-poly-tree-QJ46DNA-600.jpg"}
            
            
            // https://atlas-content-cdn.pixelsquid.com/stock-images/low-poly-pine-tree-G9QZGk6-600.jpg
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
      </div>
    );
  };

  export { TreeAnimation }