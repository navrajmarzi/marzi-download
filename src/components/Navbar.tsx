"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px- flex items-center justify-between h-16">
     
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/marzi_crop.png"
            alt="Marzi"
            width={80}
            height={32}
            className="h-10 w-auto"
          />
        </Link>

     
        <nav className="flex items-center gap-8">
    
          <a
            href="https://play.google.com/store/apps/details?id=marzi.app&hl=en_IN"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors border border-primary px-4 py-2 rounded-full"
          >
            Get the App
          </a>
        </nav>
      </div> 
    </header>
  );
}
