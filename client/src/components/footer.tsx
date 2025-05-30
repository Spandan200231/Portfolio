import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Heart } from "lucide-react";
import { SiLinkedin, SiFacebook, SiInstagram, SiBehance } from "react-icons/si";

export default function Footer() {
  const { data: socialData } = useQuery({
    queryKey: ["/api/content/social"],
  });

  const { data: miscData } = useQuery({
    queryKey: ["/api/content/miscellaneous"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const socialContent = socialData?.content || {
    linkedin: "https://www.linkedin.com/in/spandan-majumder-6b7b52366/",
    facebook: "https://www.facebook.com/profile.php?id=61576610008524",
    instagram: "https://www.instagram.com/uiux.spandan/?__pwa=1",
    behance: "https://www.behance.net/spandanmajumder3"
  };

  const miscContent = miscData?.content || {
    footerCopyright: "© 2025 Spandan Majumder. All rights reserved.",
    footerText: "Available for freelance projects and collaborations.",
    availabilityText: "Available for freelance projects and collaborations.",
    heroTitle: "Spandan Majumder",
    heroSubtitle: "Creating meaningful digital experiences through thoughtful design and user-centered approaches."
  };

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{miscContent.heroTitle}</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              {miscContent.heroSubtitle}
            </p>
            {miscContent.heroTagline && (
              <p className="text-gray-400 text-sm italic leading-relaxed">
                {miscContent.heroTagline}
              </p>
            )}
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
                href={socialContent.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="LinkedIn Profile"
              >
                <SiLinkedin className="h-5 w-5" />
              </a>
              <a
                href={socialContent.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Behance Portfolio"
              >
                <SiBehance className="h-5 w-5" />
              </a>
              <a
                href={socialContent.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Instagram Profile"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href={socialContent.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Facebook Profile"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              {miscContent.availabilityText || miscContent.footerText}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400">
          <p>{miscContent.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
}