
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} TextCraft. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link to="/terms" className="text-sm font-medium hover:underline">
            Terms
          </Link>
          <Link to="/privacy" className="text-sm font-medium hover:underline">
            Privacy
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
