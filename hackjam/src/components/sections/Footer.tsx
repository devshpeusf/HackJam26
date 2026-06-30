import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center px-6 py-20 text-white">
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-10 py-12 flex flex-col items-center gap-4 text-center">
        <p className="text-2xl font-bold">{siteConfig.name}</p>
        <p className="text-sm text-white/60">Made with ❤️ by the SHPE Tech team</p>
        <a
          href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-300 hover:text-indigo-200 underline transition-colors"
        >
          MLH Code of Conduct
        </a>
        <p className="text-xs text-white/30 mt-2">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
