import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Mail, 
  MapPin, 
  Clock, 
  Upload, 
  X, 
  Loader2, 
  Send, 
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import { 
  SiLinkedin, 
  SiFacebook, 
  SiInstagram, 
  SiBehance 
} from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useEffect } from "react";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: contactContent, refetch: refetchContact } = useQuery({
    queryKey: ["/api/content/contact"],
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 3000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
  });

  const { data: socialContent, refetch: refetchSocial } = useQuery({
    queryKey: ["/api/content/social"],
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 3000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
  });

  const { data: miscData, refetch: refetchMisc } = useQuery({
    queryKey: ["/api/content/miscellaneous"],
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 3000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
  });

  // Force refetch on component mount
  useEffect(() => {
    refetchContact();
    refetchSocial();
    refetchMisc();
  }, [refetchContact, refetchSocial, refetchMisc]);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      selectedFiles.forEach(file => {
        formData.append("attachments", file);
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your message. I'll get back to you within 24 hours.",
      });
      form.reset();
      setSelectedFiles([]);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = /^(image|application\/pdf|text|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)/.test(file.type);

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        return false;
      }

      if (!allowedTypes) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  const contactData = contactContent?.content || {
    email: "spandan.majumder0231@gmail.com",
    location: "Kolkata, West Bengal, India",
    responseTime: "Usually within 24 hours"
  };

  const socialData = socialContent?.content || {
    linkedin: "https://www.linkedin.com/in/spandan-majumder-6b7b52366/",
    facebook: "https://www.facebook.com/profile.php?id=61576610008524",
    instagram: "https://www.instagram.com/uiux.spandan/?__pwa=1",
    behance: "https://www.behance.net/spandanmajumder3"
  };



  return (
    <section id="contact" className="py-20 bg-secondary/30 dark:bg-gray-800/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="heading-secondary mb-6">Let's Work Together</h2>
            <p className="body-text max-w-2xl mx-auto">
              Ready to bring your ideas to life? I'm always excited to collaborate on meaningful projects that make a positive impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8 animate-fade-in-up">
              <h3 className="text-2xl font-semibold text-contrast mb-6">Get in Touch</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-contrast">Email</h4>
                    <a 
                      href={`mailto:${contactData.email}`}
                      className="text-contrast-secondary hover:text-accent transition-colors"
                    >
                      {contactData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-contrast">Location</h4>
                    <p className="text-contrast-secondary">{contactData.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-contrast">Response Time</h4>
                    <p className="text-contrast-secondary">{contactData.responseTime}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-border">
                <h4 className="font-medium mb-4 text-contrast">Follow Me</h4>
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

            {/* Contact Form */}
            <Card className="animate-fade-in-up shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-contrast">Send a Message</CardTitle>
                <CardDescription className="text-contrast-secondary">
                  Fill out the form below and I'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-contrast">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        className="form-input"
                        {...form.register("firstName")}
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-contrast">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        className="form-input"
                        {...form.register("lastName")}
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-contrast">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="form-input"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject" className="text-contrast">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      className="form-input"
                      {...form.register("subject")}
                    />
                    {form.formState.errors.subject && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="text-contrast">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Tell me about your project..."
                      className="form-input resize-none"
                      {...form.register("message")}
                    />
                    {form.formState.errors.message && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* File Upload */}
                  <div>
                    <Label className="text-contrast mb-2 block">
                      Attachments (Optional)
                    </Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        isDragOver
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-contrast-secondary mb-1">
                        Click to upload or drag and drop files
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max file size: 10MB • Up to 5 files
                      </p>
                    </div>

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 bg-accent/10 rounded flex items-center justify-center">
                                <Upload className="h-4 w-4 text-accent" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-contrast">
                                  {file.name}
                                </p>
                                <p className="text-xs text-contrast-secondary">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full btn-primary"
                  >
                    {contactMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="text-contrast-secondary text-sm">
          {miscData?.content?.copyrightText || "© 2025 Spandan Majumder. All rights reserved."}
        </p>
      </div>
    </section>
  );
}