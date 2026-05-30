import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StorybookLayoutProps {
  children: ReactNode;
  isTitle: boolean;
}

export default function StorybookLayout({ children, isTitle }: StorybookLayoutProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12 overflow-hidden pointer-events-none">
      {/* 
        The book container. 
        If it's the title page, it looks like a closed book. 
        If it's an open page, it's a wide two-page spread.
      */}
      <motion.div
        layout
        initial={false}
        animate={{
          width: isTitle ? "min(100%, 600px)" : "min(100%, 1200px)",
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative h-full max-h-[900px] w-full pointer-events-auto flex ${
          isTitle ? "book-cover" : "book-page"
        }`}
      >
        {/* Book spine (only visible when open) */}
        {!isTitle && (
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 md:w-16 book-spine z-0 shadow-inner" />
        )}

        {/* Page edges (subtle) */}
        {!isTitle && (
          <>
            <div className="absolute top-2 bottom-2 left-[-4px] w-4 rounded-l-md book-page-edges -z-10 shadow-sm" />
            <div className="absolute top-2 bottom-2 right-[-4px] w-4 rounded-r-md book-page-edges -z-10 shadow-sm" />
          </>
        )}

        {/* The actual content area inside the book */}
        <div className="w-full h-full relative z-10 overflow-hidden rounded-[inherit]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
