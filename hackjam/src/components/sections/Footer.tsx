import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-400 px-6 text-center gap-4">
      <p className="text-2xl font-bold text-white">{siteConfig.name}</p>
      <p className="text-sm">Made with ❤️ by the SHPE Tech team</p>
      <a
        href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
      >
        MLH Code of Conduct
      </a>
      <p className="text-xs text-gray-600 mt-4">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </p>
    </footer>
  );
}
