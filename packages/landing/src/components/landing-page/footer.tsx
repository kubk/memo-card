import { ExternalLink, Github, Mail, Youtube } from "lucide-react";
import { LandingLanguage, links } from "api";
import { Translation } from "@/shared/translations";

export function Footer({
  language,
  translation,
}: {
  language: LandingLanguage;
  translation: Translation;
}) {
  const privacyPolicyHref =
    language === LandingLanguage.ru
      ? links.appBrowser + links.privacyPolicyRuPath
      : links.privacyPolicy;
  const termsOfServiceHref =
    language === LandingLanguage.ru
      ? links.appBrowser + links.tosRuPath
      : links.termsOfService;

  const footerLinkGroups = [
    {
      title: translation.footer.groupTitles.support,
      links: [
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
    },
    {
      title: translation.footer.groupTitles.run,
      links: [
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
    },
    {
      title: "YouTube",
      links: [
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
    },
    {
      title: translation.footer.groupTitles.other,
      links: [
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
          href: privacyPolicyHref,
        },
        {
          icon: ExternalLink,
          text: translation.footer.links.termsOfService,
          href: termsOfServiceHref,
        },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-(--breakpoint-lg) lg:max-w-5xl xl:max-w-6xl">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {footerLinkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="font-semibold mb-2">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((link, index) => (
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
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            © 2023 - {new Date().getFullYear()} MemoCard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
