import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Download } from "lucide-react";
import { 
  SiLinkedin, 
  SiFacebook, 
  SiInstagram, 
  SiBehance,
  SiFigma,
  SiAdobexd,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiHtml5,
  SiReact,
  SiNodedotjs,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiGit,
  SiDocker,
  SiAdobeillustrator,
  SiAdobeindesign,
  SiAdobeaftereffects,
  SiSketch,
  SiInvision,
  SiMiro,
  SiNotion,
  SiCanva,
  SiFramer
} from "react-icons/si";

import { 
  Pen,
  Layout,
  Layers,
  PenTool,
  Users,
  FileText,
  Presentation
} from "lucide-react";

// Skill icon mapping
const skillIcons = {
  "Figma": SiFigma,
  "HTML & CSS": SiHtml5,
  "Adobe XD": SiAdobexd,
  "Photoshop": SiAdobephotoshop,
  "Premiere Pro": SiAdobepremierepro,
  "React": SiReact,
  "Node.js": SiNodedotjs,
  "Python": SiPython,
  "JavaScript": SiJavascript,
  "TypeScript": SiTypescript,
  "Git": SiGit,
  "Docker": SiDocker,
  "Illustrator": SiAdobeillustrator,
  "InDesign": SiAdobeindesign,
  "After Effects": SiAdobeaftereffects,
  "Sketch": SiSketch,
  "Canva": SiCanva,
  "Framer": SiFramer,
  "InVision": SiInvision,
  "Marvel": PenTool,
  "Miro": SiMiro,
  "UI Design": Layout,
  "UX Design": Users,
  "Prototyping": Layers,
  "Wireframing": PenTool,
  "Brand Design": Pen,
  "Microsoft Office": FileText,
  "Word": FileText,
  "Excel": Layout,
  "PowerPoint": Presentation,
  "Notion": SiNotion,
};

export default function Hero() {
  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ["/api/content/hero"],
  });

  const { data: socialData } = useQuery({
    queryKey: ["/api/content/social"],
  });

  const { data: miscData } = useQuery({
    queryKey: ["/api/content/miscellaneous"],
  });

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResumeDownload = () => {
    if (miscContent?.resumeUrl && miscContent.resumeUrl.trim() !== '') {
      try {
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = miscContent.resumeUrl;
        link.download = miscContent.resumeUrl.split('/').pop() || 'resume.pdf';
        link.target = '_blank'; // Open in new tab as fallback
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading resume:', error);
        // Fallback: open in new window
        window.open(miscContent.resumeUrl, '_blank');
      }
    }
  };

  if (heroLoading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <div className="flex flex-wrap gap-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20" />
                ))}
              </div>
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="flex justify-center">
              <Skeleton className="w-80 h-80 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const heroContent = heroData?.content || {
    name: "Spandan Majumder",
    introduction: "A passionate UI/UX Designer crafting intuitive digital experiences that bridge the gap between user needs and business goals.",
    skills: [],
    imageUrl: "",
  };

  const socialContent = socialData?.content || {
    linkedin: "",
    facebook: "",
    instagram: "",
    behance: "",
  };

  const miscContent = miscData?.content || {
    heroTagline: "Creating meaningful digital experiences through thoughtful design and user-centered approaches.",
    availabilityText: "Available for freelance projects and collaborations.",
    resumeUrl: "",
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-contrast leading-tight">
                {heroContent.name}
              </h1>
              <p className="text-xl text-contrast-secondary leading-relaxed">
                {heroContent.introduction}
              </p>
              {miscContent.heroTagline && (
                <p className="text-lg text-contrast-secondary/80 italic leading-relaxed">
                  {miscContent.heroTagline}
                </p>
              )}
              {miscContent.availabilityText && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg inline-block">
                  ✨ {miscContent.availabilityText}
                </p>
              )}
            </div>

            {/* Skills */}
            {heroContent.skills && heroContent.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-contrast-secondary uppercase tracking-wider">
                  Skills & Tools
                </h3>
                <div className="flex flex-wrap gap-3">
                  {heroContent.skills.map((skill: any, index: number) => {
                    const IconComponent = skillIcons[skill.name as keyof typeof skillIcons];
                    return (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:scale-105 transition-transform"
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {skill.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get In Touch
              </Button>
              
              {/* Resume Download Button - Always visible */}
              <Button
                onClick={handleResumeDownload}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!miscContent?.resumeUrl || miscContent.resumeUrl.trim() === ''}
              >
                <Download className="h-4 w-4 mr-2" />
                {miscContent?.resumeUrl && miscContent.resumeUrl.trim() !== '' ? 'Download Resume' : 'Resume Coming Soon'}
              </Button>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialContent.linkedin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                  >
                    <a
                      href={socialContent.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                    >
                      <SiLinkedin className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {socialContent.behance && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                  >
                    <a
                      href={socialContent.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Behance Portfolio"
                    >
                      <SiBehance className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {socialContent.instagram && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/20 dark:hover:text-pink-400 transition-colors"
                  >
                    <a
                      href={socialContent.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram Profile"
                    >
                      <SiInstagram className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {socialContent.facebook && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                  >
                    <a
                      href={socialContent.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook Profile"
                    >
                      <SiFacebook className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                <img
                  src={
                    heroContent.imageUrl ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  }
                  alt={heroContent.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
                  }}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

