import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiInstagram, SiPinterest } from "react-icons/si";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Gifts", href: "/" },
    { label: "Featured Collections", href: "/#featured" },
    { label: "Shop by Occasion", href: "/#occasions" },
    { label: "New Arrivals", href: "/" },
  ],
  Company: [
    { label: "Our Story", href: "/#about" },
    { label: "Gift Curation", href: "/" },
    { label: "Sustainability", href: "/" },
    { label: "Press", href: "/" },
  ],
  Support: [
    { label: "Gift Guide", href: "/" },
    { label: "Delivery & Returns", href: "/" },
    { label: "Contact Us", href: "/" },
    { label: "FAQ", href: "/" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  function handleAnchorLink(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.slice(2);
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link
              to="/"
              className="font-display text-2xl font-semibold text-foreground tracking-tight"
            >
              Appreciate
            </Link>
            <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-xs">
              Thoughtfully curated gifts for life's most meaningful moments.
              Every box tells a story worth giving.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-accent transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://pinterest.com"
                aria-label="Pinterest"
                className="text-muted-foreground hover:text-accent transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiPinterest className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-3">
              <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-foreground">
                {section}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorLink(e, link.href)}
                      className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-body">
          <span>© {year} Appreciate. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with <Heart className="h-3 w-3 fill-accent text-accent" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors duration-200 underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
