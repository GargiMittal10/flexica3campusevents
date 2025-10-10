import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award, TrendingUp } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To revolutionize campus event management through innovative technology and seamless user experience.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Built by students, for students. We understand the unique challenges of managing campus events.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering the highest quality platform with cutting-edge features and reliable performance.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Constantly evolving with new features based on user feedback and emerging technologies.",
    },
  ];

  return (
    <section id="about" className="py-20 px-4 scroll-mt-20">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl font-bold">About CampusEvents</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're transforming how educational institutions manage events, making attendance tracking
            effortless and analytics insightful. Our platform bridges the gap between students, faculty,
            and event organizers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <Card
              key={index}
              className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 hover-scale">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center animate-fade-in">
          <div className="space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              500+
            </div>
            <p className="text-muted-foreground">Educational Institutions</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              50K+
            </div>
            <p className="text-muted-foreground">Active Students</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              98%
            </div>
            <p className="text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
