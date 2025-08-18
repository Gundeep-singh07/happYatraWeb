import { Suspense, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Stars = () => {
  const ref = useRef<any>()
  const [sphere] = useMemo(() => random.inSphere(new Float32Array(3000), { radius: 1.5 }), [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20
      ref.current.rotation.y -= delta / 25
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.006}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

const MapsPage = () => {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas camera={{ position: [0, 0, 1.5] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg mb-6"
        >
          Real-Time Maps
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl text-blue-300 mb-12 tracking-wide"
        >
          This feature is available in our application.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95, rotate: -5 }}
        >
          <Link to="/dashboard">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl rounded-2xl"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* floating animated shapes for crazy vibes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -30, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
    </div>
  )
}

export default MapsPage;
