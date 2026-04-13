import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useCartStore } from "../store/cart";

const NAV_LINKS = [
  { label: "Browse Gifts", href: "/" },
  { label: "Occasions", href: "/#occasions" },
  { label: "About", href: "/#about" },
];

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount());
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    shortPrincipal,
    login,
    logout,
  } = useAuth();

  function handleOccasionLink(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.navigate({ to: "/" });
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="header-logo"
        >
          <span className="font-display text-2xl font-semibold text-foreground tracking-tight group-hover:text-accent transition-colors duration-200">
            Appreciate
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleOccasionLink(e, link.href)}
              className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              data-ocid="header-nav-link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth + Cart + Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Auth buttons — desktop */}
          {!isInitializing && (
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/account" data-ocid="header-account-link">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1.5 text-sm font-medium hover:bg-accent/10 hover:text-accent transition-smooth"
                    >
                      <User className="h-4 w-4" />
                      <span className="max-w-[80px] truncate">
                        {shortPrincipal}
                      </span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-smooth"
                    data-ocid="header-logout-btn"
                    aria-label="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="flex items-center gap-1.5 border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
                  data-ocid="header-login-btn"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{isLoggingIn ? "Signing in…" : "Sign in"}</span>
                </Button>
              )}
            </div>
          )}

          {/* Cart */}
          <Link
            to="/checkout"
            className="relative"
            aria-label="View cart"
            data-ocid="header-cart"
          >
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent/10 transition-smooth"
            >
              <ShoppingBag className="h-5 w-5 text-foreground" />
              {itemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-accent text-accent-foreground border-0 rounded-full"
                  data-ocid="cart-badge"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-accent/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            data-ocid="header-mobile-menu-toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="md:hidden bg-card border-t border-border px-4 pb-4 pt-2"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                handleOccasionLink(e, link.href);
                setMobileOpen(false);
              }}
              className="block py-3 text-base font-body font-medium text-foreground border-b border-border/50 last:border-0 hover:text-accent transition-colors duration-200"
              data-ocid="header-mobile-nav-link"
            >
              {link.label}
            </a>
          ))}

          {/* Mobile auth */}
          {!isInitializing && (
            <div className="pt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    data-ocid="header-mobile-account-link"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-foreground hover:text-accent"
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                    data-ocid="header-mobile-logout-btn"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  disabled={isLoggingIn}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  data-ocid="header-mobile-login-btn"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoggingIn
                    ? "Signing in…"
                    : "Sign in with Internet Identity"}
                </Button>
              )}
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
