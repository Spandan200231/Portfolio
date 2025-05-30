import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Search } from "lucide-react";
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
  SiMicrosoftoffice,
  SiMicrosoftword,
  SiMicrosoftpowerpoint,
  SiCanva,
  SiFramer
} from "react-icons/si";

import { 
  Pen,
  Layout,
  Layers,
  PenTool,
  Users
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
  { name: "Microsoft Office", icon: SiMicrosoftoffice },
  { name: "Word", icon: SiMicrosoftword },
  { name: "Excel", icon: Layout },
  { name: "PowerPoint", icon: SiMicrosoftpowerpoint },
  { name: "Notion", icon: SiNotion },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [openSkillPopover, setOpenSkillPopover] = useState(false);

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
      const token = localStorage.getItem("adminToken");
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
      const token = localStorage.getItem("adminToken");
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
      const token = localStorage.getItem("adminToken");
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
      email: formData.get("email"),
      responseTime: formData.get("responseTime"),
      skills: selectedSkills.map(skill => ({ name: skill })),
    };
    updateHeroMutation.mutate(content);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = {
      email: formData.get("email"),
      phone: formData.get("phone"),
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hero Content */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={heroData?.content?.email || ""}
                  required
                />
              </div>
              <div>
                <Label htmlFor="responseTime">Response Time</Label>
                <Input
                  id="responseTime"
                  name="responseTime"
                  defaultValue={heroData?.content?.responseTime || ""}
                  placeholder="e.g., Usually responds within 24 hours"
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

        {/* Contact Information */}
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={contactData?.content?.phone || ""}
                />
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

        {/* Social Links */}
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
      </div>
    </div>
  );
}