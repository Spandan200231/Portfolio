import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Edit3, 
  Trash2, 
  Plus, 
  Upload, 
  ExternalLink, 
  Settings, 
  FileText, 
  User, 
  Mail, 
  Calendar,
  BarChart3,
  Eye,
  MessageCircle,
  Users,
  TrendingUp,
  Activity,
  BookOpen,
  PenTool,
  Star,
  X,
  Home,
  LogOut,
  Briefcase,
  Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import type { PortfolioItem, ContactMessage, SiteContent, InsertPortfolioItem, CaseStudy, InsertCaseStudy } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  { name: "PowerPoint", icon: FileText },
  { name: "Notion", icon: SiNotion },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [openSkillPopover, setOpenSkillPopover] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [portfolioImage, setPortfolioImage] = useState<File | null>(null);
  const [portfolioImagePreview, setPortfolioImagePreview] = useState<string>("");
  const [caseStudyImage, setCaseStudyImage] = useState<File | null>(null);
  const [caseStudyImagePreview, setCaseStudyImagePreview] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>("");

  // Portfolio state
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    projectUrl: "",
    tags: "",
    category: "",
    featured: false,
  });

  // Case Studies state
  const [isCaseStudyDialogOpen, setIsCaseStudyDialogOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [caseStudyForm, setCaseStudyForm] = useState({
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    content: "",
    imageUrl: "",
    duration: "",
    category: "",
    tags: "",
    featured: false,
    published: false,
  });

  const token = localStorage.getItem("portfolio_admin_token");

  // Fetch data
  const { data: portfolioItems = [], isLoading: portfolioLoading } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  const { data: caseStudies = [], isLoading: caseStudiesLoading } = useQuery({
    queryKey: ["/api/case-studies/all"],
    queryFn: async () => {
      const response = await fetch("/api/case-studies/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch case studies");
      return response.json();
    },
  });

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

  // Fetch miscellaneous content
  const { data: miscData, isLoading: miscLoading } = useQuery({
    queryKey: ["/api/content/miscellaneous"],
  });

  const { data: contactMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/contact/messages"],
    queryFn: async () => {
      const response = await fetch("/api/contact/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch contact messages");
      return response.json();
    },
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics"],
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

  // Miscellaneous content mutation
  const updateMiscMutation = useMutation({
    mutationFn: async (content: any) => {
      const token = localStorage.getItem("portfolio_admin_token");
      const response = await fetch("/api/content/miscellaneous", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to update miscellaneous content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/miscellaneous"] });
      toast({ title: "Miscellaneous content updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update miscellaneous content", variant: "destructive" });
    },
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = localStorage.getItem("portfolio_admin_token");
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/hero-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Image uploaded successfully!" });
      setImagePreview(data.imageUrl);
      setSelectedImage(null);
    },
    onError: () => {
      toast({ title: "Failed to upload image", variant: "destructive" });
    },
  });

  // Portfolio image upload mutation
  const uploadPortfolioImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = localStorage.getItem("portfolio_admin_token");
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/portfolio-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Portfolio image uploaded successfully!" });
      setPortfolioImagePreview(data.imageUrl);
      setPortfolioImage(null);
    },
    onError: () => {
      toast({ title: "Failed to upload portfolio image", variant: "destructive" });
    },
  });

  // Case study image upload mutation
  const uploadCaseStudyImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = localStorage.getItem("portfolio_admin_token");
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/case-study-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Case study image uploaded successfully!" });
      setCaseStudyImagePreview(data.imageUrl);
      setCaseStudyForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
      setCaseStudyImage(null);
    },
    onError: () => {
      toast({ title: "Failed to upload case study image", variant: "destructive" });
    },
  });

  // Resume upload mutation
  const uploadResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = localStorage.getItem("portfolio_admin_token");
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/upload/resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload resume");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Resume uploaded successfully!" });
      setResumeFileName(data.fileName);
      setResumeFile(null);
      // Update miscellaneous content with resume URL
      updateMiscMutation.mutate({
        ...miscData?.content,
        resumeUrl: data.resumeUrl,
      });
    },
    onError: () => {
      toast({ title: "Failed to upload resume", variant: "destructive" });
    },
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await fetch(`/api/contact/messages/${messageId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to mark message as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact/messages"] });
      toast({ title: "Message marked as read" });
    },
    onError: () => {
      toast({ title: "Failed to mark message as read", variant: "destructive" });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await fetch(`/api/contact/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact/messages"] });
      toast({ title: "Message deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete message", variant: "destructive" });
    },
  });

  // Portfolio mutations
  const createPortfolioItem = useMutation({
    mutationFn: async (data: InsertPortfolioItem) => {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create portfolio item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsPortfolioDialogOpen(false);
      resetPortfolioForm();
      toast({ title: "Portfolio item created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create portfolio item", variant: "destructive" });
    },
  });

  const updatePortfolioItem = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPortfolioItem> }) => {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update portfolio item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsPortfolioDialogOpen(false);
      setEditingPortfolioItem(null);
      resetPortfolioForm();
      toast({ title: "Portfolio item updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update portfolio item", variant: "destructive" });
    },
  });

  const deletePortfolioItem = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete portfolio item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({ title: "Portfolio item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete portfolio item", variant: "destructive" });
    },
  });

  // Case Study mutations
  const createCaseStudy = useMutation({
    mutationFn: async (data: InsertCaseStudy) => {
      const response = await fetch("/api/case-studies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create case study");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies/all"] });
      setIsCaseStudyDialogOpen(false);
      resetCaseStudyForm();
      toast({ title: "Case study created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create case study", variant: "destructive" });
    },
  });

  const updateCaseStudy = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCaseStudy> }) => {
      const response = await fetch(`/api/case-studies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update case study");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies/all"] });
      setIsCaseStudyDialogOpen(false);
      setEditingCaseStudy(null);
      resetCaseStudyForm();
      toast({ title: "Case study updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update case study", variant: "destructive" });
    },
  });

  const deleteCaseStudy = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/case-studies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete case study");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies/all"] });
      toast({ title: "Case study deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete case study", variant: "destructive" });
    },
  });

  // Hero form helpers
  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = {
      name: formData.get("name"),
      introduction: formData.get("introduction"),
      skills: selectedSkills.map(skill => ({ name: skill })),
      imageUrl: imagePreview || heroData?.content?.imageUrl || "",
    };
    updateHeroMutation.mutate(content);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (selectedImage) {
      uploadImageMutation.mutate(selectedImage);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  // Contact form helpers
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

  // Social form helpers
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

  // Miscellaneous form helpers
  const handleMiscSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = {
      heroTagline: formData.get("heroTagline"),
      availabilityText: formData.get("availabilityText"),
      copyrightText: formData.get("copyrightText"),
      footerCopyright: formData.get("footerCopyright"),
      caseStudiesDescription: formData.get("caseStudiesDescription"),
      portfolioDescription: formData.get("portfolioDescription"),
      // Preserve existing resumeUrl
      resumeUrl: miscData?.content?.resumeUrl || "",
    };
    updateMiscMutation.mutate(content);
  };

  // Portfolio form helpers
  const resetPortfolioForm = () => {
    setPortfolioForm({
      title: "",
      description: "",
      imageUrl: "",
      projectUrl: "",
      tags: "",
      category: "",
      featured: false,
    });
  };

  const handlePortfolioEdit = (item: PortfolioItem) => {
    setEditingPortfolioItem(item);
    setPortfolioForm({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      projectUrl: item.projectUrl || "",
      tags: item.tags?.join(", ") || "",
      category: item.category || "",
      featured: item.featured || false,
    });
    setIsPortfolioDialogOpen(true);
  };

  const handlePortfolioSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...portfolioForm,
      imageUrl: portfolioImagePreview || portfolioForm.imageUrl,
      tags: portfolioForm.tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };

    if (editingPortfolioItem) {
      updatePortfolioItem.mutate({ id: editingPortfolioItem.id, data });
    } else {
      createPortfolioItem.mutate(data);
    }
  };

  const handlePortfolioImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPortfolioImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPortfolioImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioImageUpload = () => {
    if (portfolioImage) {
      uploadPortfolioImageMutation.mutate(portfolioImage);
    }
  };

  const removePortfolioImage = () => {
    setPortfolioImage(null);
    setPortfolioImagePreview("");
  };

  const handleCaseStudyImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCaseStudyImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCaseStudyImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaseStudyImageUpload = () => {
    if (caseStudyImage) {
      uploadCaseStudyImageMutation.mutate(caseStudyImage);
    }
  };

  const removeCaseStudyImage = () => {
    setCaseStudyImage(null);
    setCaseStudyImagePreview("");
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setResumeFile(file);
        setResumeFileName(file.name);
      } else {
        toast({ title: "Please select a PDF file", variant: "destructive" });
      }
    }
  };

  const handleResumeUpload = () => {
    if (resumeFile) {
      uploadResumeMutation.mutate(resumeFile);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeFileName("");
  };

  // Case Study form helpers
  const resetCaseStudyForm = () => {
    setCaseStudyForm({
      slug: "",
      title: "",
      subtitle: "",
      description: "",
      content: "",
      imageUrl: "",
      duration: "",
      category: "",
      tags: "",
      featured: false,
      published: false,
    });
    setCaseStudyImage(null);
    setCaseStudyImagePreview("");
  };

  const handleCaseStudyEdit = (caseStudy: CaseStudy) => {
    setEditingCaseStudy(caseStudy);
    setCaseStudyForm({
      slug: caseStudy.slug,
      title: caseStudy.title,
      subtitle: caseStudy.subtitle || "",
      description: caseStudy.description || "",
      content: caseStudy.content || "",
      imageUrl: caseStudy.imageUrl || "",
      duration: caseStudy.duration || "",
      category: caseStudy.category || "",
      tags: caseStudy.tags?.join(", ") || "",
      featured: caseStudy.featured || false,
      published: caseStudy.published || false,
    });
    setCaseStudyImagePreview(caseStudy.imageUrl || "");
    setIsCaseStudyDialogOpen(true);
  };

  const handleCaseStudySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...caseStudyForm,
      imageUrl: caseStudyImagePreview || caseStudyForm.imageUrl,
      tags: caseStudyForm.tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };

    if (editingCaseStudy) {
      updateCaseStudy.mutate({ id: editingCaseStudy.id, data });
    } else {
      createCaseStudy.mutate(data);
    }
  };

  const handleCaseStudyUpdate = (id: number, updates: any) => {
    updateCaseStudy.mutate({ id, data: updates });
  };

  const handleCaseStudyDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      deleteCaseStudy.mutate(id);
    }
  };

  const handlePortfolioUpdate = (id: number, updates: any) => {
    updatePortfolioItem.mutate({ id, data: updates });
  };

  const handlePortfolioDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this portfolio item?")) {
      deletePortfolioItem.mutate(id);
    }
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
    if (heroData?.content?.imageUrl) {
      setImagePreview(heroData.content.imageUrl);
    }
  }, [heroData]);

  if (heroLoading || contactLoading || socialLoading || portfolioLoading || miscLoading) {
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

            <button
              onClick={() => setActiveSection("portfolio")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === "portfolio" 
                  ? "bg-accent text-accent-foreground" 
                  : "text-contrast hover:bg-accent/10"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Portfolio</span>
            </button>

            {/* Case Studies Tab */}
            <button
              onClick={() => setActiveSection("case-studies")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === "case-studies" 
                  ? "bg-accent text-accent-foreground" 
                  : "text-contrast hover:bg-accent/10"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Case Studies</span>
            </button>

            {/* Messages Tab */}
            <button
              onClick={() => setActiveSection("messages")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === "messages" 
                  ? "bg-accent text-accent-foreground" 
                  : "text-contrast hover:bg-accent/10"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Messages</span>
              {contactMessages.length > 0 && (
                <Badge variant="destructive" className="ml-auto text-xs">
                  {contactMessages.filter(msg => !msg.read).length}
                </Badge>
              )}
            </button>

            {/* Miscellaneous Tab */}
            <button
              onClick={() => setActiveSection("miscellaneous")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === "miscellaneous" 
                  ? "bg-accent text-accent-foreground" 
                  : "text-contrast hover:bg-accent/10"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Miscellaneous</span>
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
              {activeSection === "portfolio" && "Portfolio Management"}
              {activeSection === "case-studies" && "Case Studies Management"}
              {activeSection === "messages" && "Contact Messages"}
              {activeSection === "miscellaneous" && "Miscellaneous Content"}
            </h1>
            <p className="text-contrast-secondary mt-2">
              {activeSection === "hero" && "Manage your personal information and skills"}
              {activeSection === "contact" && "Update your contact details"}
              {activeSection === "social" && "Configure your social media presence"}
              {activeSection === "portfolio" && "Manage your portfolio items and featured work"}
              {activeSection === "case-studies" && "Manage your case studies for UI/UX and graphics design"}
              {activeSection === "messages" && "View and manage contact form submissions"}
              {activeSection === "miscellaneous" && "Manage various text content throughout the website"}
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
                <Label>Hero Image</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="flex-1"
                    />
                    {selectedImage && (
                      <Button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploadImageMutation.isPending}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{uploadImageMutation.isPending ? "Uploading..." : "Upload"}</span>
                      </Button>
                    )}
                  </div>

                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Hero preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
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

          {activeSection === "portfolio" && (
            <div className="space-y-6">
              {/* Add New Portfolio Item */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Portfolio Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="portfolio-title">Title</Label>
                        <Input
                          id="portfolio-title"
                          name="title"
                          value={portfolioForm.title}
                          onChange={(e) => setPortfolioForm({...portfolioForm, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="portfolio-category">Category</Label>
                        <Input
                          id="portfolio-category"
                          name="category"
                          value={portfolioForm.category}
                          onChange={(e) => setPortfolioForm({...portfolioForm, category: e.target.value})}
                          placeholder="e.g., UI/UX Design, Web Development"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="portfolio-description">Description</Label>
                      <Textarea
                        id="portfolio-description"
                        name="description"
                        value={portfolioForm.description}
                        onChange={(e) => setPortfolioForm({...portfolioForm, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Portfolio Image</Label>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handlePortfolioImageSelect}
                            className="flex-1"
                          />
                          {portfolioImage && (
                            <Button
                              type="button"
                              onClick={handlePortfolioImageUpload}
                              disabled={uploadPortfolioImageMutation.isPending}
                              className="flex items-center space-x-2"
                            >
                              <Upload className="h-4 w-4" />
                              <span>{uploadPortfolioImageMutation.isPending ? "Uploading..." : "Upload"}</span>
                            </Button>
                          )}
                        </div>

                        {portfolioImagePreview && (
                          <div className="relative inline-block">
                            <img
                              src={portfolioImagePreview}
                              alt="Portfolio preview"
                              className="w-32 h-24 object-cover rounded-lg border-2 border-border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                              onClick={removePortfolioImage}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="portfolio-projectUrl">Project URL</Label>
                      <Input
                        id="portfolio-projectUrl"
                        name="projectUrl"
                        type="url"
                        value={portfolioForm.projectUrl}
                        onChange={(e) => setPortfolioForm({...portfolioForm, projectUrl: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolio-tags">Tags (comma-separated)</Label>
                      <Input
                        id="portfolio-tags"
                        name="tags"
                        value={portfolioForm.tags}
                        onChange={(e) => setPortfolioForm({...portfolioForm, tags: e.target.value})}
                        placeholder="React, TypeScript, UI Design"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="portfolio-featured"
                        name="featured"
                        checked={portfolioForm.featured}
                        onChange={(e) => setPortfolioForm({...portfolioForm, featured: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="portfolio-featured">Featured Item</Label>
                    </div>
                    <Button type="submit" disabled={createPortfolioItem.isPending}>
                      {createPortfolioItem.isPending ? "Creating..." : "Create Portfolio Item"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Portfolio Items List */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Items ({portfolioItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolioLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <Skeleton className="h-16 w-16 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : portfolioItems.length === 0 ? (
                    <div className="text-center py-8 text-contrast-secondary">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No portfolio items yet. Add your first project above!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {portfolioItems.map((item: any) => (
                        <div key={`admin-portfolio-${item.id}`} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-16 w-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-contrast flex items-center gap-2">
                                  {item.title}
                                  {item.featured && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      Featured
                                    </Badge>
                                  )}
                                  {item.behanceId && (
                                    <Badge variant="outline" className="text-xs">
                                      Behance
                                    </Badge>
                                  )}
                                </h3>
                                <p className="text-sm text-contrast-secondary">{item.description}</p>
                                {item.category && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {item.category}
                                  </Badge>
                                )}
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {item.tags.map((tag: string, index: number) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                {item.projectUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(item.projectUrl, "_blank")}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePortfolioUpdate(item.id, { featured: !item.featured })}
                                >
                                  <Star className={`h-4 w-4 ${item.featured ? "fill-current" : ""}`} />
                                </Button>
                                {!item.behanceId && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePortfolioDelete(item.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "case-studies" && (
            <div className="space-y-6">
              {/* Add New Case Study */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Case Study</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCaseStudySubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="case-study-title">Title</Label>
                        <Input
                          id="case-study-title"
                          name="title"
                          value={caseStudyForm.title}
                          onChange={(e) => setCaseStudyForm({ ...caseStudyForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="case-study-slug">Slug</Label>
                        <Input
                          id="case-study-slug"
                          name="slug"
                          value={caseStudyForm.slug}
                          onChange={(e) => setCaseStudyForm({ ...caseStudyForm, slug: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="case-study-subtitle">Subtitle</Label>
                      <Input
                        id="case-study-subtitle"
                        name="subtitle"
                        value={caseStudyForm.subtitle}
                        onChange={(e) => setCaseStudyForm({ ...caseStudyForm, subtitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="case-study-description">Description</Label>
                      <Textarea
                        id="case-study-description"
                        name="description"
                        value={caseStudyForm.description}
                        onChange={(e) => setCaseStudyForm({ ...caseStudyForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="case-study-content">Content</Label>
                      <Textarea
                        id="case-study-content"
                        name="content"
                        value={caseStudyForm.content}
                        onChange={(e) => setCaseStudyForm({ ...caseStudyForm, content: e.target.value })}
                        rows={6}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="case-study-category">Category</Label>
                        <Input
                          id="case-study-category"
                          name="category"
                          value={caseStudyForm.category}
                          onChange={(e) => setCaseStudyForm({ ...caseStudyForm, category: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="case-study-duration">Duration</Label>
                        <Input
                          id="case-study-duration"
                          name="duration"
                          value={caseStudyForm.duration}
                          onChange={(e) => setCaseStudyForm({ ...caseStudyForm, duration: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Case Study Image</Label>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleCaseStudyImageSelect}
                            className="flex-1"
                          />
                          {caseStudyImage && (
                            <Button
                              type="button"
                              onClick={handleCaseStudyImageUpload}
                              disabled={uploadCaseStudyImageMutation.isPending}
                              className="flex items-center space-x-2"
                            >
                              <Upload className="h-4 w-4" />
                              <span>{uploadCaseStudyImageMutation.isPending ? "Uploading..." : "Upload"}</span>
                            </Button>
                          )}
                        </div>

                        {caseStudyImagePreview && (
                          <div className="relative inline-block">
                            <img
                              src={caseStudyImagePreview}
                              alt="Case study preview"
                              className="w-32 h-24 object-cover rounded-lg border-2 border-border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                              onClick={removeCaseStudyImage}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="case-study-tags">Tags (comma-separated)</Label>
                      <Input
                        id="case-study-tags"
                        name="tags"
                        value={caseStudyForm.tags}
                        onChange={(e) => setCaseStudyForm({ ...caseStudyForm, tags: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="case-study-featured"
                          name="featured"
                          checked={caseStudyForm.featured}
                          onChange={(e) => setCaseStudyForm({ ...caseStudyForm, featured: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="case-study-featured">Featured Item</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="case-study-published"
                          name="published"
                          checked={caseStudyForm.published}
                          onChange={(e) => setCaseStudyForm({ ...caseStudyForm, published: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="case-study-published">Published</Label>
                      </div>
                    </div>
                    <Button type="submit" disabled={createCaseStudy.isPending}>
                      {createCaseStudy.isPending ? "Creating..." : "Create Case Study"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Case Studies List */}
              <Card>
                <CardHeader>
                  <CardTitle>Case Studies ({caseStudies.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {caseStudiesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <Skeleton className="h-16 w-16 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : caseStudies.length === 0 ? (
                    <div className="text-center py-8 text-contrast-secondary">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No case studies yet. Add your first case study above!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {caseStudies.map((item: any) => (
                        <div key={`admin-case-study-${item.id}`} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                          <img
                            src={item.imageUrl && item.imageUrl.trim() !== "" 
                              ? item.imageUrl 
                              : "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                            }
                            alt={item.title}
                            className="h-16 w-16 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-contrast flex items-center gap-2">
                                  {item.title}
                                  {item.featured && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      Featured
                                    </Badge>
                                  )}
                                  {item.published && (
                                    <Badge variant="outline" className="text-xs">
                                      Published
                                    </Badge>
                                  )}
                                </h3>
                                <p className="text-sm text-contrast-secondary">{item.description}</p>
                                {item.category && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {item.category}
                                  </Badge>
                                )}
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {item.tags.map((tag: string, index: number) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCaseStudyUpdate(item.id, { published: !item.published })}
                                  className={item.published ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                  title={item.published ? "Unpublish case study" : "Publish case study"}
                                >
                                  {item.published ? <Eye className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCaseStudyUpdate(item.id, { featured: !item.featured })}
                                >
                                  <Star className={`h-4 w-4 ${item.featured ? "fill-current" : ""}`} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCaseStudyDelete(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "messages" && (
            <div className="space-y-6">
              {/* Messages Overview */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-contrast-secondary">Total Messages</p>
                        <p className="text-2xl font-bold text-contrast">{contactMessages.length}</p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-contrast-secondary">Unread</p>
                        <p className="text-2xl font-bold text-contrast">
                          {contactMessages.filter(msg => !msg.read).length}
                        </p>
                      </div>
                      <Mail className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-contrast-secondary">Read</p>
                        <p className="text-2xl font-bold text-contrast">
                          {contactMessages.filter(msg => msg.read).length}
                        </p>
                      </div>
                      <Eye className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Messages List */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Messages</CardTitle>
                  <CardDescription>
                    Messages received through the contact form
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : contactMessages.length === 0 ? (
                    <div className="text-center py-12 text-contrast-secondary">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No messages yet</p>
                      <p className="text-sm">Contact form submissions will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contactMessages.map((message: any, index: number) => (
                        <div 
                          key={`message-${message.id}-${index}`}
                          className={`p-6 border rounded-lg transition-colors ${
                            message.read 
                              ? "border-border bg-card" 
                              : "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {message.firstName.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-contrast">
                                  {message.firstName} {message.lastName}
                                  {!message.read && (
                                    <Badge variant="destructive" className="ml-2 text-xs">
                                      New
                                    </Badge>
                                  )}
                                </h3>
                                <p className="text-sm text-contrast-secondary">{message.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-contrast-secondary">
                                {new Date(message.createdAt).toLocaleString()}
                              </span>
                              <div className="flex space-x-1">
                                {!message.read && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => markAsReadMutation.mutate(message.id)}
                                    disabled={markAsReadMutation.isPending}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Mark Read
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
                                      deleteMessageMutation.mutate(message.id);
                                    }
                                  }}
                                  disabled={deleteMessageMutation.isPending}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-contrast-secondary mb-1">Subject:</p>
                              <p className="text-contrast">{message.subject}</p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-contrast-secondary mb-1">Message:</p>
                              <div className="bg-muted/50 p-3 rounded border">
                                <p className="text-contrast whitespace-pre-wrap">{message.message}</p>
                              </div>
                            </div>

                            {message.attachments && message.attachments.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-contrast-secondary mb-2">Attachments:</p>
                                <div className="flex flex-wrap gap-2">
                                  {message.attachments.map((attachment: string, index: number) => (
                                    <a
                                      key={index}
                                      href={`/api/uploads/${attachment}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors"
                                    >
                                      <div className="flex-shrink-0">
                                        {attachment.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                                          <img
                                            src={`/api/uploads/${attachment}`}
                                            alt="Attachment"
                                            className="h-8 w-8 object-cover rounded border"
                                          />
                                        ) : (
                                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-sm text-blue-700 dark:text-blue-300 hover:underline">
                                        {attachment}
                                      </span>
                                      <ExternalLink className="h-3 w-3 text-blue-500" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <div className="flex items-center space-x-4 text-xs text-contrast-secondary">
                                <span>📧 Reply to: {message.email}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "miscellaneous" && (
            <Card>
              <CardHeader>
                <CardTitle>Miscellaneous Content</CardTitle>
                <CardDescription>
                  Manage various text content displayed throughout the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMiscSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="heroTagline">Hero Section Tagline</Label>
                    <Textarea
                      id="heroTagline"
                      name="heroTagline"
                      defaultValue={miscData?.content?.heroTagline || "Creating meaningful digital experiences through thoughtful design and user-centered approaches."}
                      rows={2}
                      placeholder="Enter hero section tagline"
                    />
                    <p className="text-sm text-contrast-secondary mt-1">Displayed below the main introduction on the hero section</p>
                  </div>

                  <div>
                    <Label htmlFor="availabilityText">Availability Text</Label>
                    <Input
                      id="availabilityText"
                      name="availabilityText"
                      defaultValue={miscData?.content?.availabilityText || "Available for freelance projects and collaborations."}
                      placeholder="Enter availability text"
                    />
                    <p className="text-sm text-contrast-secondary mt-1">Displayed in the hero/contact section</p>
                  </div>



                  <div>
                    <Label htmlFor="footerCopyright">Footer Copyright Text</Label>
                    <Input
                      id="footerCopyright"
                      name="footerCopyright"
                      defaultValue={miscData?.content?.footerCopyright || "© 2025 Spandan Majumder. All rights reserved."}
                      placeholder="Enter footer copyright text"
                    />
                    <p className="text-sm text-contrast-secondary mt-1">Displayed in the footer</p>
                  </div>

                  <div>
                    <Label htmlFor="caseStudiesDescription">Case Studies Section Description</Label>
                    <Textarea
                      id="caseStudiesDescription"
                      name="caseStudiesDescription"
                      defaultValue={miscData?.content?.caseStudiesDescription || "Deep dives into my design process, challenges faced, and solutions delivered for complex user experience problems."}
                      rows={3}
                      placeholder="Enter case studies section description"
                    />
                    <p className="text-sm text-contrast-secondary mt-1">Displayed in the case studies section</p>
                  </div>

                  <div>
                    <Label htmlFor="portfolioDescription">Portfolio Section Description</Label>
                    <Textarea
                      id="portfolioDescription"
                      name="portfolioDescription"
                      defaultValue={miscData?.content?.portfolioDescription || "A curated selection of my recent projects showcasing user-centered design solutions across various digital platforms."}
                      rows={3}
                      placeholder="Enter portfolio section description"
                    />
                    <p className="text-sm text-contrast-secondary mt-1">Displayed in the portfolio section</p>
                  </div>

                  <div>
                    <Label>Resume/CV Upload</Label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={handleResumeSelect}
                          className="flex-1"
                        />
                        {resumeFile && (
                          <Button
                            type="button"
                            onClick={handleResumeUpload}
                            disabled={uploadResumeMutation.isPending}
                            className="flex items-center space-x-2"
                          >
                            <Upload className="h-4 w-4" />
                            <span>{uploadResumeMutation.isPending ? "Uploading..." : "Upload"}</span>
                          </Button>
                        )}
                      </div>

                      {miscData?.content?.resumeUrl && miscData.content.resumeUrl.trim() !== '' && (
                        <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                          <FileText className="h-5 w-5 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800 dark:text-green-300">
                              Current Resume: {miscData.content.resumeUrl.split('/').pop()}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Users can download this from the hero section
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(miscData.content.resumeUrl, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      )}

                      {(resumeFileName || (miscData?.content?.resumeUrl && !resumeFileName)) && (
                        <div className="relative inline-block">
                          <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-800 dark:text-blue-300">
                              {resumeFileName || (miscData?.content?.resumeUrl ? miscData.content.resumeUrl.split('/').pop() : 'Resume uploaded')}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={removeResume}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-contrast-secondary mt-1">Upload a PDF resume that users can download from the hero section</p>
                  </div>

                  <Button type="submit" disabled={updateMiscMutation.isPending}>
                    {updateMiscMutation.isPending ? "Updating..." : "Update Miscellaneous Content"}
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