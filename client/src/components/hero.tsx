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
    if (miscData?.content?.resumeUrl) {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = miscData.content.resumeUrl;
      link.download = miscData.content.resumeUrl.split('/').pop() || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
              
              {/* Resume Download Button */}
              {miscContent.resumeUrl && (
                <Button
                  onClick={handleResumeDownload}
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              )}

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

const skillIcons: { [key: string]: any } = {
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
  const { data: heroContent, isLoading: heroLoading } = useQuery({
    queryKey: ["/api/content/hero"],
  });

  const { data: socialContent, isLoading: socialLoading } = useQuery({
    queryKey: ["/api/content/social"],
  });

  const { data: miscData } = useQuery({
    queryKey: ["/api/content/miscellaneous"],
  });

  const isLoading = heroLoading || socialLoading;

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section id="home" className="pt-24 pb-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-12 rounded-lg" />
                ))}
              </div>
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const heroData = heroContent?.content || {
    name: "Spandan Majumder",
    introduction: "A passionate UI/UX Designer crafting intuitive digital experiences that bridge the gap between user needs and business goals. Based in Kolkata, I specialize in creating meaningful interactions through thoughtful design.",
    skills: [
      { name: "Figma", icon: "fas fa-paint-brush" },
      { name: "HTML & CSS", icon: "fab fa-html5" },
      { name: "Prototyping", icon: "fas fa-pen-nib" },
      { name: "Wireframing", icon: "fas fa-sitemap" },
      { name: "Adobe XD", icon: "fab fa-adobe" },
      { name: "InDesign", icon: "fas fa-layer-group" },
      { name: "Photoshop", icon: "fab fa-adobe" },
      { name: "Premiere Pro", icon: "fab fa-adobe" },
      { name: "Dora", icon: "fas fa-magic" }
    ]
  };

  // Ensure skills is always an array - check both heroData and heroData.skills
  const skills = Array.isArray(heroData?.skills) ? heroData.skills : [];

  const socialData = socialContent?.content || {
    linkedin: "https://www.linkedin.com/in/spandan-majumder-6b7b52366/",
    facebook: "https://www.facebook.com/profile.php?id=61576610008524",
    instagram: "https://www.instagram.com/uiux.spandan/?__pwa=1",
    behance: "https://www.behance.net/spandanmajumder3"
  };

  return (
    <section id="home" className="pt-24 pb-20 px-6 bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            {/* Introduction */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-contrast">Hi, I'm</span>
                  <span className="block text-accent">{heroData.name}</span>
                </h1>
                <p className="text-xl body-text leading-relaxed">
                  {heroData.introduction}
                </p>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={scrollToContact} className="btn-primary">
                  Get In Touch
                </Button>
                {miscData?.content?.resumeUrl && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(miscData.content.resumeUrl, "_blank")}
                    className="flex items-center space-x-2"
                  >
                    <span>Download Resume</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => window.open(socialData.behance, "_blank")}
                  className="flex items-center space-x-2"
                >
                  <span>View Portfolio</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-contrast">Design Skills</h3>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  Professional
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {heroData.skills?.map((skill: any, index: number) => {
                  const IconComponent = skillIcons[skill.name];

                  return (
                    <div 
                      key={index}
                      className="bg-secondary/50 dark:bg-gray-800/50 rounded-lg p-4 text-center hover:shadow-md hover:bg-secondary/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover-lift group"
                    >
                      <div className="flex justify-center mb-3">
                        {IconComponent ? (
                          <IconComponent className="h-8 w-8 text-accent group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {skill.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="block text-sm font-medium text-contrast">
                        {skill.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-contrast">Connect With Me</h3>
              <div className="flex space-x-4">
                <a
                  href={socialData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link bg-linkedin"
                  aria-label="LinkedIn Profile"
                >
                  <SiLinkedin className="h-5 w-5" />
                </a>
                <a
                  href={socialData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link bg-facebook"
                  aria-label="Facebook Profile"
                >
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a
                  href={socialData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link bg-instagram"
                  aria-label="Instagram Profile"
                >
                  <SiInstagram className="h-5 w-5" />
                </a>
                <a
                  href={socialData.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link bg-behance"
                  aria-label="Behance Portfolio"
                >
                  <SiBehance className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in-up">
            <div className="relative">
              <img
                src={heroData.imageUrl || "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"}
                alt={heroData.imageUrl ? `${heroData.name} - Hero Image` : "Modern UI/UX designer workspace with multiple monitors and design tools"}
                className="rounded-2xl shadow-2xl w-full object-cover h-96 lg:h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent text-white p-3 rounded-xl shadow-lg animate-pulse">
                <SiFigma className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-border">
                <span className="text-sm font-medium text-contrast">UI/UX Designer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}