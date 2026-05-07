import React, { useState, useEffect, useRef } from 'react';

import screen1 from "@/assets/iphone-showcase/1.png";
import screen2 from "@/assets/iphone-showcase/2.png";
import screen3 from "@/assets/iphone-showcase/3.png";
import screen4 from "@/assets/iphone-showcase/4.png";
import screen5 from "@/assets/iphone-showcase/5.png";
import screen6 from "@/assets/iphone-showcase/6.png";
import screen7 from "@/assets/iphone-showcase/7.png";
import screen8 from "@/assets/iphone-showcase/8.png";

const screens = [screen1, screen2, screen3, screen4, screen5, screen6, screen7, screen8];

export default function AngledIphoneMockup() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(isHovered);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Indices corresponding to 1, 4, 6, 7.png
  const scrollIndices = [0, 3, 5, 6];

  useEffect(() => {
    const isScrolling = scrollIndices.includes(activeIndex);
    const delay = isScrolling ? 8000 : 4000;

    let elapsed = 0;
    const interval = setInterval(() => {
      // Only advance the elapsed timer if we are NOT hovering
      if (!isHoveredRef.current) {
        elapsed += 100;
        if (elapsed >= delay) {
          setActiveIndex((prev) => (prev + 1) % screens.length);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <div 
      className="relative group [perspective:1200px] w-full max-w-[400px] flex justify-center items-center iphone-stage"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background ambient glows for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[650px] bg-indigo-500/10 blur-[100px] rounded-full animate-subtle-glow pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[400px] bg-purple-500/10 blur-[80px] rounded-full pointer-events-none z-0"></div>
      
      {/* Contact shadows (layered for realism) */}
      <div className="absolute -bottom-8 left-[5%] w-[90%] h-[40px] bg-black/40 blur-[25px] rounded-[100%] transition-all duration-500 group-hover:scale-95 group-hover:blur-[30px] group-hover:opacity-30 z-0"></div>
      <div className="absolute -bottom-6 left-[15%] w-[70%] h-[20px] bg-black/70 blur-[10px] rounded-[100%] transition-all duration-500 group-hover:scale-90 group-hover:blur-[15px] group-hover:translate-y-2 z-0"></div>
      <div className="absolute -bottom-3 left-[25%] w-[50%] h-[10px] bg-black/90 blur-[4px] rounded-[100%] transition-all duration-500 group-hover:scale-75 group-hover:blur-[8px] group-hover:translate-y-4 z-0"></div>

      {/* 3D Phone Wrapper */}
      <div 
        className="relative w-[320px] h-[660px] [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{
          transform: 'rotateY(-22deg) rotateX(7deg) rotateZ(-2deg)',
        }}
      >
        {/* Hover trigger overlay (invisible) */}
        <div className="absolute inset-[-60px] z-50 rounded-[80px]" />

        <div className="w-full h-full [transform-style:preserve-3d] transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform:translateY(0)_rotateY(0)_rotateX(0)] group-hover:[transform:translateY(-1rem)_rotateY(-5deg)_rotateX(3deg)]">
          
          {/* FAKE THICKNESS (Back Titanium Layer) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-950 rounded-[56px] border-[1px] border-zinc-700 [transform:translateZ(-16px)_translateX(8px)_translateY(3px)] shadow-[25px_25px_50px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
          
          {/* FAKE THICKNESS (Right edge connector for 3D extrusion effect) */}
          <div className="absolute top-[56px] bottom-[56px] -right-[8px] w-[16px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 [transform:translateZ(-8px)_translateX(2px)_skewY(45deg)] rounded-r-xl opacity-[0.85] border-r border-zinc-600/30"></div>
          {/* Fake thickness (Bottom edge connector) */}
          <div className="absolute bottom-[3px] right-[56px] left-[56px] h-[16px] bg-gradient-to-r from-zinc-800 to-zinc-950 [transform:translateZ(-8px)_translateY(2px)_skewX(45deg)] rounded-b-xl opacity-[0.85] border-b border-zinc-700/40"></div>

          {/* SIDE BUTTONS */}
          {/* Action button */}
          <div className="absolute top-[125px] -left-[4px] w-[14px] h-[24px] bg-gradient-to-b from-zinc-500 via-zinc-600 to-zinc-700 rounded-l-[4px] border-l border-zinc-400/80"></div>
          {/* Volume Up */}
          <div className="absolute top-[170px] -left-[5px] w-[15px] h-[48px] bg-gradient-to-b from-zinc-500 via-zinc-600 to-zinc-700 rounded-l-[4px] border-l border-zinc-400/80"></div>
          {/* Volume Down */}
          <div className="absolute top-[230px] -left-[5px] w-[15px] h-[48px] bg-gradient-to-b from-zinc-500 via-zinc-600 to-zinc-700 rounded-l-[4px] border-l border-zinc-400/80"></div>
          {/* Power Button */}
          <div className="absolute top-[200px] -right-[5px] w-[15px] h-[68px] bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-800 rounded-r-[4px] border-r border-zinc-500/80"></div>

          {/* MAIN FRONT BODY (Outer Titanium Frame) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-700 via-zinc-500 to-zinc-700 rounded-[56px] p-[2px] shadow-[inset_0_0_15px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.2)] border-[0.5px] border-zinc-500/30">
            
            {/* ANTENNA BANDS (Removed to fix floating corner artifacts) */}
            
            {/* INNER BEZEL (Ultra-thin 17 Pro style) */}
            <div className="w-full h-full bg-[#0a0a0a] rounded-[54px] p-[5px] relative overflow-hidden shadow-[inset_0_0_8px_rgba(0,0,0,1)] border-[0.5px] border-zinc-800">
              
              {/* SCREEN GLASS / CONTENT AREA */}
              <div className="w-full h-full bg-[#030303] rounded-[49px] relative overflow-hidden flex flex-col shadow-[inset_0_0_4px_rgba(255,255,255,0.05)]">
                
                {/* STATUS BAR */}
                <div className="absolute top-[17px] left-0 right-0 w-full px-[20px] flex justify-between items-center z-50 text-black font-semibold text-[10px] tracking-tight pointer-events-none drop-shadow-sm">
                  {/* Left: Time */}
                  <div className="w-[50px] flex justify-center">
                    <Clock />
                  </div>
                  {/* Right: Icons (Cellular, WiFi, Battery) */}
                  <div className="w-[50px] flex justify-end items-center gap-[4px] opacity-90 pr-1">
                    {/* Fake Cellular (4 bars) */}
                    <div className="flex items-end gap-[1px] h-[8px]">
                      <div className="w-[2px] h-[3px] bg-black rounded-sm"></div>
                      <div className="w-[2px] h-[4.5px] bg-black rounded-sm"></div>
                      <div className="w-[2px] h-[6px] bg-black rounded-sm"></div>
                      <div className="w-[2px] h-[8px] bg-black rounded-sm"></div>
                    </div>
                    {/* Fake WiFi (Arcs) */}
                    <div className="relative w-[10px] h-[8px] flex justify-center items-end overflow-hidden pb-[1px]">
                      <div className="absolute bottom-[0px] w-[2px] h-[2px] bg-black rounded-full"></div>
                      <div className="absolute bottom-[2px] w-[6px] h-[6px] border-t-[1.5px] border-black rounded-full"></div>
                      <div className="absolute bottom-[4.5px] w-[10px] h-[10px] border-t-[1.5px] border-black rounded-full"></div>
                    </div>
                    {/* Fake Battery */}
                    <div className="relative w-[16px] h-[8px] border-[1px] border-black/80 rounded-[3px] p-[1px] flex ml-0.5">
                      <div className="w-full h-full bg-black rounded-[1.5px]"></div>
                      <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1.5px] h-[3px] bg-black/80 rounded-r-sm"></div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC ISLAND */}
                <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[116px] h-[34px] bg-black rounded-[24px] z-40 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_-1px_2px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center px-2.5 justify-between ring-1 ring-white/5">
                   {/* IR sensor / FaceID array */}
                   <div className="w-[12px] h-[12px] rounded-full bg-gradient-to-br from-indigo-950/50 to-black/90 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05)]"></div>
                   
                   {/* Camera lens */}
                   <div className="w-[14px] h-[14px] rounded-full bg-gradient-to-br from-[#1c1c28] to-black shadow-[inset_1px_1px_3px_rgba(255,255,255,0.15)] relative overflow-hidden border-[0.5px] border-white/10">
                     <div className="absolute top-[3px] right-[3px] w-[4px] h-[4px] bg-blue-500/40 rounded-full blur-[0.5px]"></div>
                     <div className="absolute bottom-[2px] left-[2px] w-[2px] h-[2px] bg-purple-500/30 rounded-full blur-[0.5px]"></div>
                   </div>
                </div>

                {/* APP CONTENT AREA */}
                <div className="flex-1 w-full relative overflow-hidden bg-[#030303] rounded-[49px] transform-gpu isolate ring-1 ring-black/5">
                  <ScreenContent activeIndex={activeIndex} />
                </div>

                {/* PAGINATION DOTS (Removed per request) */}

                {/* HOME INDICATOR */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[130px] h-[4.5px] bg-white rounded-full z-30 shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></div>
                
                {/* GLASS REFLECTION OVERLAYS (Ultra-realistic) */}
                {/* Primary diagonal sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-40 mix-blend-overlay"></div>
                {/* Harsh edge reflection */}
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-[35deg] pointer-events-none z-40 translate-y-[20%]"></div>
                {/* Subtle top rim highlight */}
                <div className="absolute top-0 left-0 right-0 h-[20px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-40 rounded-t-[49px]"></div>
                {/* Side edge glow */}
                <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-gradient-to-r from-white/10 to-transparent pointer-events-none z-40 rounded-l-[49px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PLACEHOLDER UI COMPONENTS ---

type ScreenContentProps = {
  activeIndex: number;
};

function ScreenContent({ activeIndex }: ScreenContentProps) {
  const scrollIndices = [0, 3, 5, 6];

  return (
    <div className="w-full h-full relative">
      {screens.map((src, idx) => {
        const isActive = activeIndex === idx;
        const isPrev = idx === (activeIndex - 1 + screens.length) % screens.length;
        const needsScroll = scrollIndices.includes(idx);
        
        // Directional slide logic: incoming from right, outgoing to left.
        // Removing scale to prevent border-radius mismatch. Using transform-gpu for maximum smoothness.
        let positionClass = 'translate-x-4 opacity-0 z-0'; // Next screens waiting on the right
        if (isActive) positionClass = 'translate-x-0 opacity-100 z-10';
        else if (isPrev) positionClass = '-translate-x-4 opacity-0 z-0'; // Previous screen exiting to the left
        
        return (
          <img
            key={idx}
            src={src}
            alt={`Screenshot ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transform-gpu transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${positionClass} ${
              isActive && needsScroll ? 'animate-scroll-image group-hover:[animation-play-state:paused]' : ''
            } ${needsScroll ? 'object-top' : ''}`}
          />
        );
      })}
    </div>
  );
}

// --- CLOCK COMPONENT ---
function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes: string | number = now.getMinutes();
      
      // 12-hour format typical for iOS
      hours = hours % 12;
      hours = hours ? hours : 12; // '0' becomes '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    // Update every second to ensure it stays in sync
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{time}</span>;
}
