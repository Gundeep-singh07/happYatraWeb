import { Button } from "@/components/ui/button";
import { Brain, Route, Clock, BarChart3, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/HomePage/Header";
import heroImage from "@/assets/hero-transport.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FeatureCard } from "@/components/HomePage/FeatureCard";

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Index = () => {
  const featuresSectionRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Advanced machine learning models analyze traffic patterns and predict optimal routes in real-time.",
    },
    {
      icon: Route,
      title: "Dynamic Route Optimization",
      description:
        "Continuously adjusts bus routes and schedules based on live traffic, road conditions, and passenger demand.",
    },
    {
      icon: Clock,
      title: "Real-Time Scheduling",
      description:
        "Reduces wait times and overcrowding through intelligent frequency balancing and predictive deployment.",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Comprehensive insights into operational efficiency, passenger flow, and system optimization metrics.",
    },
    {
      icon: Zap,
      title: "Instant Adaptation",
      description:
        "Responds immediately to changing conditions with automated adjustments to improve service reliability.",
    },
    {
      icon: Shield,
      title: "Scalable Integration",
      description:
        "Seamlessly integrates with existing transport systems and scales across multiple cities and networks.",
    },
  ];

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen scroll-smooth relative bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Animated Background Gradient */}
      <motion.div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgb(59, 130, 246, 0.15), transparent 25%)`,
        }}
      />

      <Header />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative pt-20 pb-16 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: backgroundY,
          }}
        />

        <div className="relative container mx-auto px-6 py-16">
          <motion.div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Smart Transport
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent block">
                  Revolution
                </span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                AI-driven dynamic route rationalization system that leverages
                real-time data to optimize public transport routes, reduce
                delays, and enhance commuter experience.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Link to="/auth">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 transition-all duration-300 hover:scale-105"
                >
                  Start Your Journey
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10 transition-all duration-300"
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section
        ref={featuresSectionRef}
        className="py-20 relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Intelligent Transport
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {" "}
                Solutions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Our AI-powered system revolutionizes public transport through
              advanced analytics, real-time optimization, and seamless
              integration.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Enhanced CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 relative overflow-hidden"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl transform -rotate-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl transform rotate-1" />

            {/* Main Content */}
            <div className="relative bg-black/40 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 overflow-hidden">
              {/* Animated Gradient Orbs */}
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />

              <div className="relative z-10">
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 opacity-10" />

                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  {/* Text Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                        Ready to Transform Your City's Transport?
                      </h2>
                      <p className="text-xl text-gray-400 mb-6">
                        Join the future of intelligent public transportation with
                        happYatra's AI-powered optimization platform.
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                          { value: "25+", label: "Cities" },
                          { value: "1M+", label: "Routes Optimized" },
                          { value: "98%", label: "Success Rate" },
                        ].map((stat, i) => (
                          <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="p-4 rounded-xl bg-white/5 backdrop-blur-sm"
                          >
                            <div className="text-2xl font-bold text-white">
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-400">
                              {stat.label}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Action Card */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full lg:w-auto"
                  >
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="flex flex-col gap-4">
                        <Link to="/auth">
                          <Button
                            size="lg"
                            className="w-full text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                          >
                            Get Started Today
                          </Button>
                        </Link>
                        <Link to="/demo">
                          <Button
                            variant="ghost"
                            size="lg"
                            className="w-full text-lg px-8 py-6 hover:bg-white/5"
                          >
                            Watch Demo
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
