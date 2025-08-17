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

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-12 backdrop-blur-sm border border-white/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your City's Transport?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the future of intelligent public transportation with
                happYatra's AI-powered optimization platform.
              </p>
              <Link to="/auth">
                <Button size="lg" className="text-lg px-12 py-6">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
