import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, 
  Plus, 
  Search, 
  User, 
  Mail, 
  Share2, 
  Settings, 
  LogOut,
  Home,
  FileText,
  Briefcase
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Presentation
} from "lucide-react";

const availableSkills = [
  { name: "Figma", icon: SiFigma },
  { name: "HTML & CSS", icon: SiHtml5 },
  { name: "Adobe XD", icon: SiAdobexd },
  { name: "Photoshop", icon: SiAdobephotoshop },
  { name: "Premiere Pro", icon: SiAdobepremierepro },
  { name: "React", icon: SiReact },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Python", icon: SiPython },
  { name: "JavaScript", icon: SiJavascript },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Git", icon: SiGit },
  { name: "Docker", icon: SiDocker },
  { name: "Illustrator", icon: SiAdobeillustrator },
  { name: "InDesign", icon: SiAdobeindesign },
  { name: "After Effects", icon: SiAdobeaftereffects },
  { name: "Sketch", icon: SiSketch },
  { name: "Canva", icon: SiCanva },
  { name: "Framer", icon: SiFramer },
  { name: "InVision", icon: SiInvision },
  { name: "Marvel", icon: PenTool },
  { name: "Miro", icon: SiMiro },
  { name: "UI Design", icon: Layout },
  { name: "UX Design", icon: Users },
  { name: "Prototyping", icon: Layers },
  { name: "Wireframing", icon: PenTool },
  { name: "Brand Design", icon: Pen },
  { name: "Microsoft Office", icon: FileText },
  { name: "Word", icon: FileText },
  { name: "Excel", icon: Layout },
  { name: "PowerPoint", icon: Presentation },
  { name: "Notion", icon: SiNotion },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [openSkillPopover, setOpenSkillPopover] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Fetch hero content
  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ["/api/content/hero"],
  });

  // Fetch contact content
  const { data: contactData, isLoading: contactLoading } = useQuery({
    queryKey: ["/api/content/contact"],
  });

  // Fetch social content
  const { data: socialData, isLoading: socialLoading } = useQuery({
    queryKey: ["/api/content/social"],
  });

  // Hero content mutation
  const updateHeroMutation = useMutation({
    mutationFn: async (content: any) => {
      const token = localStorage.getItem("portfolio_admin_token");
      const response = await fetch("/api/content/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to update hero content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/hero"] });
      toast({ title: "Hero content updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update hero content", variant: "destructive" });
    },
  });

  // Contact content mutation
  const updateContactMutation = useMutation({
    mutationFn: async (content: any) => {
      const token = localStorage.getItem("portfolio_admin_token");
      const response = await fetch("/api/content/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to update contact content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/contact"] });
      toast({ title: "Contact content updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update contact content", variant: "destructive" });
    },
  });

  // Social content mutation
  const updateSocialMutation = useMutation({
    mutationFn: async (content: any) => {
      const token = localStorage.getItem("portfolio_admin_token");
      const response = await fetch("/api/content/social", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to update social content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/social"] });
      toast({ title: "Social content updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update social content", variant: "destructive" });
    },
  });

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = {
      name: formData.get("name"),
      introduction: formData.get("introduction"),
      skills: selectedSkills.map(skill => ({ name: skill })),
    };
    updateHeroMutation.mutate(content);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = {
      email: formData.get("email"),
      responseTime: formData.get("responseTime"),
      location: formData.get("location"),
    };
    updateContactMutation.mutate(content);
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = {
      linkedin: formData.get("linkedin"),
      facebook: formData.get("facebook"),
      instagram: formData.get("instagram"),
      behance: formData.get("behance"),
    };
    updateSocialMutation.mutate(content);
  };

  const addSkill = (skillName: string) => {
    if (!selectedSkills.includes(skillName)) {
      setSelectedSkills([...selectedSkills, skillName]);
    }
    setOpenSkillPopover(false);
  };

  const removeSkill = (skillName: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillName));
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.includes(skill.name)
  );

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_token");
    window.location.href = "/admin/login";
  };

  React.useEffect(() => {
    if (heroData?.content?.skills) {
      setSelectedSkills(heroData.content.skills.map((skill: any) => skill.name));
    }
  }, [heroData]);

  if (heroLoading || contactLoading || socialLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-contrast">Admin Panel</h2>
          <p className="text-sm text-contrast-secondary">Portfolio Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveSection("hero")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === "hero" 
                  ? "bg-accent text-accent-foreground" 
                  : "text-contrast hover:bg-accent/10"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Hero Section</span>
            </button>

            <button
              onClick={() => setActiveSection("contact")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === "contact" 
                  ? "bg-accent text-accent-foreground" 
                  : "text-contrast hover:bg-accent/10"
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Contact Info</span>
            </button>

            <button
              onClick={() => setActiveSection("social")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === "social" 
                  ? "bg-accent text-accent-foreground" 
                  : "text-contrast hover:bg-accent/10"
              }`}
            >
              <Share2 className="h-4 w-4" />
              <span>Social Links</span>
            </button>

            <div className="border-t border-border my-4"></div>

            <button
              onClick={() => window.open("/", "_blank")}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-contrast hover:bg-accent/10"
            >
              <Home className="h-4 w-4" />
              <span>View Site</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-contrast hover:bg-accent/10"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-contrast">
              {activeSection === "hero" && "Hero Section"}
              {activeSection === "contact" && "Contact Information"}
              {activeSection === "social" && "Social Media Links"}
            </h1>
            <p className="text-contrast-secondary mt-2">
              {activeSection === "hero" && "Manage your personal information and skills"}
              {activeSection === "contact" && "Update your contact details"}
              {activeSection === "social" && "Configure your social media presence"}
            </p>
          </div>

          {activeSection === "hero" && (
        <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={heroData?.content?.name || ""}
                  required
                />
              </div>
              <div>
                <Label htmlFor="introduction">Introduction</Label>
                <Textarea
                  id="introduction"
                  name="introduction"
                  defaultValue={heroData?.content?.introduction || ""}
                  required
                />
              </div>
              <div>
                <Label>Skills</Label>
                <div className="space-y-2">
                  <Popover open={openSkillPopover} onOpenChange={setOpenSkillPopover}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search skills..."
                          value={skillSearch}
                          onValueChange={setSkillSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No skills found.</CommandEmpty>
                          <CommandGroup>
                            {filteredSkills.map((skill) => {
                              const IconComponent = skill.icon;
                              return (
                                <CommandItem
                                  key={skill.name}
                                  onSelect={() => addSkill(skill.name)}
                                >
                                  <IconComponent className="h-4 w-4 mr-2" />
                                  {skill.name}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skillName) => {
                      const skill = availableSkills.find(s => s.name === skillName);
                      const IconComponent = skill?.icon;
                      return (
                        <Badge key={skillName} variant="secondary" className="flex items-center gap-1">
                          {IconComponent && <IconComponent className="h-3 w-3" />}
                          {skillName}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => removeSkill(skillName)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={updateHeroMutation.isPending}>
                  {updateHeroMutation.isPending ? "Updating..." : "Update Hero"}
                </Button>
              </form>
            </CardContent>
            </Card>
          )}

          {activeSection === "contact" && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  defaultValue={contactData?.content?.email || ""}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact-responseTime">Response Time</Label>
                <Select name="responseTime" defaultValue={contactData?.content?.responseTime || "Within 24 hours"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select response time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Within 2 hours">Within 2 hours</SelectItem>
                    <SelectItem value="Within 24 hours">Within 24 hours</SelectItem>
                    <SelectItem value="Within 48 hours">Within 48 hours</SelectItem>
                    <SelectItem value="Within 72 hours">Within 72 hours</SelectItem>
                    <SelectItem value="Within 1 week">Within 1 week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={contactData?.content?.location || ""}
                />
              </div>
              <Button type="submit" disabled={updateContactMutation.isPending}>
                  {updateContactMutation.isPending ? "Updating..." : "Update Contact"}
                </Button>
              </form>
            </CardContent>
            </Card>
          )}

          {activeSection === "social" && (
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent>
            <form onSubmit={handleSocialSubmit} className="space-y-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  defaultValue={socialData?.content?.linkedin || ""}
                />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  type="url"
                  defaultValue={socialData?.content?.facebook || ""}
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  type="url"
                  defaultValue={socialData?.content?.instagram || ""}
                />
              </div>
              <div>
                <Label htmlFor="behance">Behance URL</Label>
                <Input
                  id="behance"
                  name="behance"
                  type="url"
                  defaultValue={socialData?.content?.behance || ""}
                />
              </div>
              <Button type="submit" disabled={updateSocialMutation.isPending}>
                  {updateSocialMutation.isPending ? "Updating..." : "Update Social Links"}
                </Button>
              </form>
            </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}