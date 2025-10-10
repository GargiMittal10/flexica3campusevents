import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

const DocumentationSection = () => {
  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-border/50 shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Project Documentation</CardTitle>
            <CardDescription className="text-base">
              Complete technical documentation and API reference for the College Event & Attendance Manager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="border-border/50 bg-background hover:shadow-md transition-all hover-scale">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Technical Report
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive project report with problem statement, architecture, and implementation details
                </p>
                <a 
                  href="https://drive.google.com/file/d/1StHYKW51qEOb-ROTiPaw9_bDIk0DEdXU/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-gradient-to-r from-primary to-accent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </a>
              </CardContent>
            </Card>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3">
              <h4 className="font-semibold text-lg">What's Included:</h4>
              <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Problem Statement & Objectives
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Technology Stack Details
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  REST API Endpoints
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Authentication Implementation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  QR Code Management
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Database Schema
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Analytics Dashboard Logic
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Notification System
                </li>
              </ul>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Developed by: Gargi Mittal, Meet Golani, Aryan Malkani, Yogita Beniwal</p>
              <p className="mt-1">Symbiosis Institute of Technology, Pune</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DocumentationSection;
