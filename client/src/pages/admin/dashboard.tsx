import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  LogOut, 
  Home, 
  User, 
  Briefcase, 
  BookOpen, 
  Mail, 
  Share2, 
  FolderSync,
  Trash2,
  Edit,
  Eye,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Users,
  MousePointer,
  Clock,
  Settings,
  Key,
  Globe,
  Palette
} from "lucide-react";
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
  SiDocker
} from "react-icons/si";
import { getAuthToken, removeAuthToken, verifyAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  { name: "Prototyping", icon: null },
  { name: "Wireframing", icon: null },
  { name: "InDesign", icon: null },
  { name: "Dora", icon: null }
];

const socialPlatforms = [
  { name: "LinkedIn", icon: SiLinkedin, color: "bg-linkedin" },
  { name: "Facebook", icon: SiFacebook, color: "bg-facebook" },
  { name: "Instagram", icon: SiInstagram, color: "bg-instagram" },
  { name: "Behance", icon: SiBehance, color: "bg-behance" },
  { name: "Twitter", icon: null, color: "bg-blue-500" },
  { name: "Dribbble", icon: null, color: "bg-pink-500" },
  { name: "GitHub", icon: null, color: "bg-gray-800" },
  { name: "YouTube", icon: null, color: "bg-red-500" }
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [newSkill, setNewSkill] = useState({ name: "", icon: "" });
  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "", icon: "" });

  // Auth verification
  const { data: user, isLoading: authLoading, error: authError } = useQuery({
    queryKey: ["/api/auth/verify"],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) throw new Error("No token");

      const response = await fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        removeAuthToken();
        throw new Error("Invalid token");
      }
      return response.json();
    },
    retry: false,
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLocation("/admin");
      return;
    }
  }, [setLocation]);

  useEffect(() => {
    if (authError || (!authLoading && !user)) {
      removeAuthToken();
      setLocation("/admin");
    }
  }, [user, authLoading, authError, setLocation]);

  // Data queries
  const { data: portfolioItems = [] } = useQuery({
    queryKey: ["/api/portfolio"],
    enabled: !!user && !authLoading,
  });

  const { data: caseStudies = [] } = useQuery({
    queryKey: ["/api/case-studies/all"],
    enabled: !!user && !authLoading,
  });

  const { data: contactMessages = [] } = useQuery({
    queryKey: ["/api/contact/messages"],
    enabled: !!user && !authLoading,
  });

  const { data: heroContent } = useQuery({
    queryKey: ["/api/content/hero"],
    enabled: !!user && !authLoading,
  });

  const { data: contactContent } = useQuery({
    queryKey: ["/api/content/contact"],
    enabled: !!user && !authLoading,
  });

  const { data: socialContent } = useQuery({
    queryKey: ["/api/content/social"],
    enabled: !!user && !authLoading,
  });

  const { data: trafficData } = useQuery({
    queryKey: ["/api/analytics/traffic"],
    enabled: !!user && !authLoading,
  });

  // Mutations
  const syncBehanceMutation = useMutation({
    mutationFn: async () => {
      const token = getAuthToken();
      const response = await apiRequest("POST", "/api/portfolio/sync", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sync Successful",
        description: "Portfolio has been synced with Behance",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Failed to sync with Behance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const token = getAuthToken();
      const response = await apiRequest("POST", "/api/auth/change-password", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });
      setPasswordData({ current: "", new: "", confirm: "" });
      setIsPasswordDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ section, content }: { section: string; content: any }) => {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const response = await fetch(`/api/content/${section}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update content");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Content Updated",
        description: "Changes have been saved successfully",
      });
      
      // Invalidate and refetch all content queries
      queryClient.invalidateQueries({ queryKey: ["/api/content/hero"] });
      queryClient.invalidateQueries({ queryKey: ["/api/content/contact"] });
      queryClient.invalidateQueries({ queryKey: ["/api/content/social"] });
      
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ["/api/content/hero"] });
      queryClient.refetchQueries({ queryKey: ["/api/content/contact"] });
      queryClient.refetchQueries({ queryKey: ["/api/content/social"] });
      
      // Also invalidate all queries to ensure consistency
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    },
  });

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.current,
      newPassword: passwordData.new,
    });
  };

  const logout = () => {
    removeAuthToken();
    setLocation("/admin");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const contactMessagesData = contactMessages as any[] || [];
  const portfolioItemsData = portfolioItems as any[] || [];
  const caseStudiesData = caseStudies as any[] || [];
  const heroContentData = heroContent as any || {};
  const contactContentData = contactContent as any || {};
  const socialContentData = socialContent as any || {};
  const trafficAnalytics = trafficData as any || {};

  const unreadMessages = contactMessagesData.filter((msg: any) => !msg.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-contrast">Portfolio Admin</h1>
            <Badge variant="secondary">Welcome, {user.user?.name}</Badge>
          </div>
          <Button variant="outline" onClick={logout} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 border-r border-border bg-card h-[calc(100vh-4rem)]">
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
              <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent">
                <TabsTrigger value="dashboard" className="justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="about" className="justify-start">
                  <User className="h-4 w-4 mr-2" />
                  About Me
                </TabsTrigger>
                <TabsTrigger value="skills" className="justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="case-studies" className="justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Case Studies
                </TabsTrigger>
                <TabsTrigger value="contact" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact & Messages
                  {unreadMessages > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {unreadMessages}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="social" className="justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Social Links
                </TabsTrigger>
                <TabsTrigger value="settings" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Analytics Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-contrast mb-2">Website Analytics</h2>
                <p className="text-contrast-secondary">Traffic insights and performance metrics</p>
              </div>

              {/* Traffic Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-contrast">{trafficAnalytics.totalVisits || 0}</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-contrast">{trafficAnalytics.uniqueVisitors || 0}</div>
                    <p className="text-xs text-muted-foreground">Unique visitors</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-contrast">{trafficAnalytics.pageViews || 0}</div>
                    <p className="text-xs text-muted-foreground">Total page views</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-contrast">
                      {Math.floor((trafficAnalytics.avgSessionDuration || 0) / 60)}m {(trafficAnalytics.avgSessionDuration || 0) % 60}s
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Bounce rate: {trafficAnalytics.bounceRate || 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Content Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-contrast-secondary">
                      Portfolio Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-contrast">{portfolioItemsData.length}</div>
                    <p className="text-xs text-muted-foreground">Synced from Behance</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-contrast-secondary">
                      Case Studies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-contrast">{caseStudiesData.length}</div>
                    <p className="text-xs text-muted-foreground">Published studies</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-contrast-secondary">
                      Total Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-contrast">{contactMessagesData.length}</div>
                    <p className="text-xs text-muted-foreground">Contact inquiries</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-contrast-secondary">
                      Unread Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">{unreadMessages}</div>
                    <p className="text-xs text-muted-foreground">Need attention</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Pages */}
              {trafficAnalytics.topPages && trafficAnalytics.topPages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-contrast">Top Pages</CardTitle>
                    <CardDescription>Most visited pages in the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {trafficAnalytics.topPages.map((page: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-contrast">
                            {page.page === '/' ? 'Home' : page.page}
                          </span>
                          <Badge variant="secondary">{page.views} views</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-contrast">Quick Actions</CardTitle>
                  <CardDescription>Instant portfolio synchronization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => syncBehanceMutation.mutate()}
                    disabled={syncBehanceMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {syncBehanceMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <FolderSync className="h-4 w-4 mr-2" />
                    )}
                    Sync with Behance Now
                  </Button>
                  <p className="text-sm text-contrast-secondary">
                    Manually trigger portfolio sync with your Behance profile. Auto-sync runs every 30 minutes.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* About Me Content */}
            <TabsContent value="about" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-contrast mb-2">About Me</h2>
                <p className="text-contrast-secondary">Edit your personal information and introduction</p>
              </div>

              {heroContentData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="about-name">Name</Label>
                        <Input
                          id="about-name"
                          defaultValue={heroContentData.content?.name || ""}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="about-title">Title</Label>
                        <Input
                          id="about-title"
                          defaultValue={heroContentData.content?.title || ""}
                          placeholder="Your professional title"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="about-description">Description</Label>
                      <Textarea
                        id="about-description"
                        rows={4}
                        defaultValue={heroContentData.content?.introduction || ""}
                        placeholder="Tell visitors about yourself and your expertise"
                      />
                    </div>

                    <div>
                      <Label htmlFor="about-location">Location</Label>
                      <Input
                        id="about-location"
                        defaultValue={contactContent?.content?.location || "Kolkata, West Bengal, India"}
                        placeholder="Your location"
                      />
                    </div>

                    <Button 
                      onClick={async () => {
                        const name = (document.getElementById('about-name') as HTMLInputElement).value;
                        const title = (document.getElementById('about-title') as HTMLInputElement).value;
                        const description = (document.getElementById('about-description') as HTMLTextAreaElement).value;
                        const location = (document.getElementById('about-location') as HTMLInputElement).value;

                        try {
                          // Update hero content
                          await updateContentMutation.mutateAsync({
                            section: 'hero',
                            content: {
                              ...heroContentData.content,
                              name,
                              title,
                              introduction: description
                            }
                          });

                          // Update contact content with new location
                          await updateContentMutation.mutateAsync({
                            section: 'contact',
                            content: {
                              ...contactContent?.content,
                              location
                            }
                          });

                          // Force immediate cache invalidation and refetch
                          await queryClient.invalidateQueries();
                          await queryClient.refetchQueries();
                          
                        } catch (error) {
                          console.error('Failed to update content:', error);
                        }
                      }}
                      disabled={updateContentMutation.isPending}
                    >
                      {updateContentMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Skills Management */}
            <TabsContent value="skills" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-contrast mb-2">Skills & Technologies</h2>
                <p className="text-contrast-secondary">Manage your technical skills and design tools</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Skills</CardTitle>
                    <CardDescription>Your displayed skills and expertise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {["Figma", "HTML & CSS", "Adobe XD", "Prototyping", "Wireframing", "Photoshop", "Premiere Pro", "InDesign"].map((skill) => (
                        <div key={skill} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{skill}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Add New Skill */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Skill</CardTitle>
                    <CardDescription>Add skills to showcase your expertise</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="skill-name">Skill Name</Label>
                      <Input
                        id="skill-name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        placeholder="e.g., React, Figma, Photography"
                      />
                    </div>

                    <div>
                      <Label htmlFor="skill-category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design Tools</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-contrast mb-2">Settings</h2>
                <p className="text-contrast-secondary">Manage your account and security settings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Email Address</Label>
                      <Input value="spandan.majumder0231@gmail.com" disabled />
                      <p className="text-xs text-muted-foreground mt-1">Contact support to change email</p>
                    </div>

                    <div>
                      <Label>Session Timeout</Label>
                      <Select defaultValue="20">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="20">20 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">Auto-logout after inactivity</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and choose a new one.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                              id="current-password"
                              type="password"
                              value={passwordData.current}
                              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={passwordData.new}
                              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={passwordData.confirm}
                              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handlePasswordChange} disabled={changePasswordMutation.isPending}>
                            {changePasswordMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Update Password
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Hero Content */}
            <TabsContent value="hero" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-contrast mb-2">Hero Content</h2>
                <p className="text-contrast-secondary">Manage your homepage hero section</p>
              </div>

              {heroContent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-contrast">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-contrast">Name</Label>
                        <Input
                          id="name"
                          defaultValue={heroContent.content.name}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="introduction" className="text-contrast">Introduction</Label>
                      <Textarea
                        id="introduction"
                        rows={4}
                        defaultValue={heroContent.content.introduction}
                        className="form-input"
                      />
                    </div>

                    <Button 
                      onClick={() => {
                        const name = (document.getElementById('name') as HTMLInputElement).value;
                        const introduction = (document.getElementById('introduction') as HTMLTextAreaElement).value;

                        updateContentMutation.mutate({
                          section: 'hero',
                          content: {
                            ...heroContent.content,
                            name,
                            introduction
                          }
                        }, {
                          onSuccess: () => {
                            // Force refresh hero content
                            queryClient.invalidateQueries({ queryKey: ["/api/content/hero"] });
                            queryClient.refetchQueries({ queryKey: ["/api/content/hero"] });
                          }
                        });
                      }}
                      disabled={updateContentMutation.isPending}
                    >
                      {updateContentMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Portfolio */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-contrast mb-2">Portfolio Management</h2>
                  <p className="text-contrast-secondary">Manage your portfolio items and Behance sync</p>
                </div>
                <Button
                  onClick={() => syncBehanceMutation.mutate()}
                  disabled={syncBehanceMutation.isPending}
                >
                  {syncBehanceMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FolderSync className="h-4 w-4 mr-2" />
                  )}
                  FolderSync Behance
                </Button>
              </div>

              <div className="grid gap-4">
                {portfolioItems.map((item: any) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-contrast">{item.title}</h3>
                          <p className="text-sm text-contrast-secondary">{item.category}</p>
                          {item.behanceId && (
                            <Badge variant="secondary" className="mt-1">
                              From Behance
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={item.featured} />
                        <span className="text-sm text-contrast-secondary">Featured</span>
                      </div>The About Me section in the admin panel is now properly connected to save changes to the backend, including name, title, description, and location.                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Case Studies */}
            <TabsContent value="case-studies" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-contrast mb-2">Case Studies</h2>
                  <p className="text-contrast-secondary">Manage your detailed case studies</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Case Study
                </Button>
              </div>

              <div className="grid gap-4">
                {caseStudies.map((study: any) => (
                  <Card key={study.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-contrast">{study.title}</h3>
                          <p className="text-sm text-contrast-secondary">{study.subtitle}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={study.published ? "default" : "secondary"}>
                              {study.published ? "Published" : "Draft"}
                            </Badge>
                            {study.featured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Contact & Messages */}
            <TabsContent value="contact" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-contrast mb-2">Contact & Messages</h2>
                <p className="text-contrast-secondary">Manage contact information and view messages</p>
              </div>

              {contactContent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-contrast">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-contrast">Email</Label>
                        <Input
                          id="email"
                          defaultValue={contactContent.content.email}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-contrast">Location</Label>
                        <Input
                          id="location"
                          defaultValue={contactContent.content.location}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-contrast">Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {contactMessages.map((message: any) => (
                        <div key={message.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-contrast">
                                {message.firstName} {message.lastName}
                              </h4>
                              {!message.read && (
                                <Badge variant="destructive" className="text-xs">New</Badge>
                              )}
                            </div>
                            <span className="text-sm text-contrast-secondary">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-contrast-secondary mb-2">{message.email}</p>
                          <p className="text-sm font-medium text-contrast mb-2">{message.subject}</p>
                          <p className="text-sm text-contrast-secondary">{message.message}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm text-contrast-secondary">
                                Attachments: {message.attachments.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Links */}
            <TabsContent value="social" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-contrast mb-2">Social Links</h2>
                <p className="text-contrast-secondary">Manage your social media profiles</p>
              </div>

              {socialContent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-contrast">Social Media Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="linkedin" className="text-contrast">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          defaultValue={socialContent.content.linkedin}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="behance" className="text-contrast">Behance</Label>
                        <Input
                          id="behance"
                          defaultValue={socialContent.content.behance}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram" className="text-contrast">Instagram</Label>
                        <Input
                          id="instagram"
                          defaultValue={socialContent.content.instagram}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook" className="text-contrast">Facebook</Label>
                        <Input
                          id="facebook"
                          defaultValue={socialContent.content.facebook}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}