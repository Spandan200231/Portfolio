import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  SiLinkedin, 
  SiFacebook, 
  SiInstagram, 
  SiBehance 
} from "react-icons/si";

export default function Footer() {
  const { data: socialContent, isLoading } = useQuery({
    queryKey: ["/api/content/social"],
  });

  const { data: heroContent } = useQuery({
    queryKey: ["/api/content/hero"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const socialData = socialContent?.content || {
    linkedin: "https://www.linkedin.com/in/spandan-majumder-6b7b52366/",
    facebook: "https://www.facebook.com/profile.php?id=61576610008524",
    instagram: "https://www.instagram.com/uiux.spandan/?__pwa=1",
    behance: "https://www.behance.net/spandanmajumder3"
  };

  const designerName = heroContent?.content?.name || "Spandan Majumder";

  if (isLoading) {
    return (
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Skeleton className="h-6 w-48 mb-4 bg-white/20" />
              <Skeleton className="h-4 w-full mb-2 bg-white/10" />
              <Skeleton className="h-4 w-3/4 bg-white/10" />
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-4 bg-white/20" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20 bg-white/10" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-4 bg-white/20" />
              <div className="flex space-x-4 mb-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 bg-white/10" />
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 mt-8 text-center">
            <Skeleton className="h-4 w-64 mx-auto bg-white/10" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{designerName}</h3>
            <p className="text-gray-300 leading-relaxed">
              Creating meaningful digital experiences through thoughtful design and user-centered approaches.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="hover:text-white transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("portfolio")}
                  className="hover:text-white transition-colors text-left"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("case-studies")}
                  className="hover:text-white transition-colors text-left"
                >
                  Case Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a
                href={socialData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="LinkedIn Profile"
              >
                <SiLinkedin className="h-5 w-5" />
              </a>
              <a
                href={socialData.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Behance Portfolio"
              >
                <SiBehance className="h-5 w-5" />
              </a>
              <a
                href={socialData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Instagram Profile"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href={socialData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Facebook Profile"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Available for freelance projects and collaborations.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {designerName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
