import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, QrCode, BarChart3, MessageSquare, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import DocumentationSection from "@/components/sections/DocumentationSection";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 -z-10 animate-fade-in" />
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary border border-primary/20 hover-scale">
                ✨ Modern Event Management Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Streamline Your{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Campus Events
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Effortlessly manage events, track attendance with QR codes, and gain insights with powerful analytics. Built for modern educational institutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg hover-scale">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="hover-scale">
                    Student Login
                  </Button>
                </Link>
                <Link to="/faculty-login">
                  <Button size="lg" variant="outline" className="hover-scale">
                    Faculty Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl animate-pulse" />
              <img 
                src={heroImage} 
                alt="Students engaging with campus events" 
                className="relative rounded-2xl shadow-2xl border border-border/50 hover-scale transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-4xl font-bold">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to simplify event management and enhance student engagement
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Event Management</CardTitle>
                <CardDescription>
                  Create, update, and manage campus events with ease. Automatic notifications keep students informed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in group" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <QrCode className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>QR Code Attendance</CardTitle>
                <CardDescription>
                  Students generate unique QR codes. Faculty scan to mark attendance instantly and accurately.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in group" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track attendance percentages, view participation trends, and generate detailed reports.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in group" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Feedback & Surveys</CardTitle>
                <CardDescription>
                  Collect student ratings and comments. View comprehensive feedback reports in real-time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in group" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security ensures your data is protected. Role-based access control included.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in group" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Built with modern technology for optimal performance. Quick response times guaranteed.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <AboutSection />
      <DocumentationSection />
      <ContactSection />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-2xl hover-scale transition-all duration-500 animate-fade-in">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Transform Your Campus Events?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join hundreds of institutions already using CampusEvents to streamline their event management
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="shadow-lg hover-scale">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/#contact">
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover-scale">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
