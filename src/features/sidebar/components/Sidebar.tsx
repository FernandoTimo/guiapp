"use client";
import React, { useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = React.useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isMobile && (
        <div className="fixed bottom-4 left-4 z-11">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-30 left-[0%] h-30 w-10 p-3 bg-neutral-900 rounded-r-3xl text-white shadow-lg transition-all duration-100 hover:bg-neutral-800"
          >
            {isOpen ? "<-" : "->"}
          </button>
        </div>
      )}

      <aside
        className={
          isMobile
            ? `fixed inset-0 z-10 flex flex-col transition-transform duration-300 ${
                isOpen
                  ? "translate-x-0 delay-0"
                  : "-translate-x-full delay-[325ms]"
              }`
            : "w-64 bg-[#1e1e1e] text-white p-4 overflow-y-auto"
        }
      >
        {isMobile && (
          <div
            className={`fixed inset-0 z-10 transition-opacity duration-200 ${
              isOpen ? "delay-[200ms] opacity-100" : "opacity-0"
            }`}
            onClick={handleClickOutside}
          ></div>
        )}

        {isMobile ? (
          <div
            ref={panelRef}
            className="relative h-full w-[50%] p-4 overflow-y-auto bg-neutral-900 pointer-events-auto z-20"
          >
            <SidebarContent />
          </div>
        ) : (
          <SidebarContent />
        )}
      </aside>
    </>
  );
}
