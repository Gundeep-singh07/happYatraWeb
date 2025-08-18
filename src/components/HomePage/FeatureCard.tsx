import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  stats?: { label: string; value: string }[];
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  index,
  stats 
}: FeatureCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Enhanced 3D movement
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Adjusted rotation values for more subtle effect
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  const scale = useSpring(1);
  const shadowOpacity = useSpring(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate center point
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);
    
    // Apply dampening factor
    const dampenedX = distanceX * 0.3;
    const dampenedY = distanceY * 0.3;
    
    x.set(dampenedX);
    y.set(dampenedY);
    scale.set(1.02); // Reduced scale for subtler effect
    shadowOpacity.set(0.5); // Reduced shadow opacity
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
    shadowOpacity.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setHovered(true)}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        transformPerspective: "1000px",
      }}
      className="relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 
        transition-all duration-300 will-change-transform"
    >
      {/* Background Gradient Animation */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
        style={{ opacity: shadowOpacity }}
      />

      {/* 3D Content Layer */}
      <motion.div style={{ transform: "translateZ(75px)" }} className="relative">
        {/* Floating Icon */}
        <motion.div 
          className="relative w-16 h-16 mb-6"
          animate={{ 
            y: [0, -8, 0],
            rotateZ: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-50 animate-pulse" />
          <div className="relative w-full h-full bg-black/50 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/10">
            <Icon className="w-8 h-8 text-blue-400" />
          </div>
          
          {/* Orbital Particles */}
          {hovered && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-blue-500/50"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${i * 120}deg) translateX(2rem)`,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
        
        {/* Content */}
        <motion.div style={{ transform: "translateZ(50px)" }}>
          <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
          <p className="text-gray-400 leading-relaxed">{description}</p>

          {/* Stats with 3D hover effect */}
          {stats && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, translateZ: 75 }}
                  className="p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-lg font-semibold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* AI Status Indicator */}
          <motion.div 
            className="mt-6 flex items-center space-x-2"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-gray-400">AI Processing</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};