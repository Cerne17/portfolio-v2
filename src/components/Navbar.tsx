import Link from "next/link";
import React from "react"; // Often good practice to import React for FC or JSX types

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-white dark:bg-primary-dark dark:text-text-color-dark shadow-md">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Miguel Cerne
          </Link>
          {/* Mobile menu button (optional) */}
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="hover:text-secondary dark:hover:text-secondary-dark"
          >
            Home
          </Link>
          <Link
            href="/#projects"
            className="hover:text-secondary dark:hover:text-secondary-dark"
          >
            Projects
          </Link>
          <Link
            href="/#blog"
            className="hover:text-secondary dark:hover:text-secondary-dark"
          >
            Blog
          </Link>
          <Link
            href="/#contact"
            className="bg-accent hover:bg-opacity-90 text-white dark:bg-accent-dark dark:hover:bg-opacity-90 py-2 px-4 rounded-md transition duration-300"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
