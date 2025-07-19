import React from "react";
import { ExternalLink, Github, Mail, Youtube } from "lucide-react";
import { links } from "api";
import { Translation } from "@/shared/translations";

export function Footer(props: { translation: Translation }) {
  const { translation } = props;

  const memoCardFooterLinks = {
    support: [
      {
        icon: Mail,
        text: links.supportEmail,
        href: "mailto:" + links.supportEmail,
      },
      {
        icon: ExternalLink,
        text: translation.footer.links.tgSupport,
        href: links.supportChat,
      },
    ],
    run: [
      {
        icon: ExternalLink,
        text: translation.footer.links.runInBrowser,
        href: links.appBrowser,
      },
      {
        icon: ExternalLink,
        text: translation.footer.links.runInTelegram,
        href: links.appTelegram,
      },
    ],
    youtube: [
      {
        icon: Youtube,
        text: translation.footer.links.youtubeChannelEn,
        href: links.youtubeChannelEn,
      },
      {
        icon: Youtube,
        text: translation.footer.links.youtubeChannelRu,
        href: links.youtubeChannelRu,
      },
    ],
    other: [
      {
        icon: ExternalLink,
        text: translation.footer.links.telegramChannel,
        href: links.botChannel,
      },
      {
        icon: Github,
        text: "GitHub",
        href: links.github,
      },
      {
        icon: ExternalLink,
        text: translation.footer.links.privacyPolicy,
        href: links.privacyPolicy,
      },
      {
        icon: ExternalLink,
        text: translation.footer.links.termsOfService,
        href: links.termsOfService,
      },
    ],
  };

  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-(--breakpoint-lg) lg:max-w-5xl xl:max-w-6xl">
        {/* MemoCard Footer Section - Only shown if translation is provided */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-2">
                {translation.footer.groupTitles.support}
              </h4>
              <ul className="space-y-2">
                {memoCardFooterLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center hover:text-blue-600"
                    >
                      {link.icon && <link.icon className="mr-2" size={16} />}
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                {translation.footer.groupTitles.run}
              </h4>
              <ul className="space-y-2">
                {memoCardFooterLinks.run.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center hover:text-blue-600"
                    >
                      {link.icon && <link.icon className="mr-2" size={16} />}
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">YouTube</h4>
              <ul className="space-y-2">
                {memoCardFooterLinks.youtube.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center hover:text-blue-600"
                    >
                      {link.icon && <link.icon className="mr-2" size={16} />}
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                {translation.footer.groupTitles.other}
              </h4>
              <ul className="space-y-2">
                {memoCardFooterLinks.other.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center hover:text-blue-600"
                    >
                      {link.icon && <link.icon className="mr-2" size={16} />}
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            © 2023 - {new Date().getFullYear()} MemoCard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
