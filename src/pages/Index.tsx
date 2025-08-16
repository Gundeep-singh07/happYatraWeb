import { Button } from "@/components/ui/button";
import { Brain, Route, Clock, BarChart3, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";
import heroImage from "@/assets/hero-transport.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning models analyze traffic patterns and predict optimal routes in real-time.",
      delay: 200,
    },
    {
      icon: Route,
      title: "Dynamic Route Optimization",
      description: "Continuously adjusts bus routes and schedules based on live traffic, road conditions, and passenger demand.",
      delay: 400,
    },
    {
      icon: Clock,
      title: "Real-Time Scheduling",
      description: "Reduces wait times and overcrowding through intelligent frequency balancing and predictive deployment.",
      delay: 600,
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Comprehensive insights into operational efficiency, passenger flow, and system optimization metrics.",
      delay: 800,
    },
    {
      icon: Zap,
      title: "Instant Adaptation",
      description: "Responds immediately to changing conditions with automated adjustments to improve service reliability.",
      delay: 1000,
    },
    {
      icon: Shield,
      title: "Scalable Integration",
      description: "Seamlessly integrates with existing transport systems and scales across multiple cities and networks.",
      delay: 1200,
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Smart Transport
                <span className="hero-gradient block">Revolution</span>
              </h1>
            </div>
            
            <div className="animate-slide-in">
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                AI-driven dynamic route rationalization system that leverages real-time data to optimize public transport routes, reduce delays, and enhance commuter experience.
              </p>
            </div>
            
            <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center items-center pt-8" style={{ animationDelay: '800ms' }}>
              <Link to="/auth">
                <Button size="lg" className="glow-effect text-lg px-8 py-6 animate-pulse-glow">
                  Start Your Journey
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Intelligent Transport
              <span className="hero-gradient"> Solutions</span>
            </h2>
            <p className="text-xl text-muted-foreground animate-slide-in">
              Our AI-powered system revolutionizes public transport through advanced analytics, real-time optimization, and seamless integration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-12 card-hover">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your City's Transport?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the future of intelligent public transportation with happYatra's AI-powered optimization platform.
              </p>
              <Link to="/auth">
                <Button size="lg" className="glow-effect text-lg px-12 py-6">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
