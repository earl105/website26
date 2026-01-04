import React from "react";

export interface TechIcon {
  id: string;
  name: string;
  // svg as a React node so it's easy to render and still driven by data
  svg: React.ReactNode;
}

// Simple, small SVG placeholders for each technology. Replace `svg` with
// proper SVG content or import SVG files when available.
export const techIcons: TechIcon[] = [
  { id: "arduino", name: "Arduino IDE", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#00979D"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="white">ARD</text>
    </svg>
  )},
  { id: "asm", name: "x86-64 Assembly", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#6B7280"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fill="white">ASM</text>
    </svg>
  )},
  { id: "c", name: "C", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#A8B9CC"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fill="#0B4F6C">C</text>
    </svg>
  )},
  { id: "css3", name: "CSS3", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#264DE4"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="white">CSS</text>
    </svg>
  )},
  { id: "excel", name: "Excel", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#217346"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fill="white">XLS</text>
    </svg>
  )},
  { id: "fusion", name: "Fusion 360", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#F36F21"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fill="white">Fusion</text>
    </svg>
  )},
  { id: "html5", name: "HTML5", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#E34F26"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="white">HTML</text>
    </svg>
  )},
  { id: "inventor", name: "Inventor", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#0073A8"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fill="white">Inv</text>
    </svg>
  )},
  { id: "ruby", name: "Ruby", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#CC342D"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="white">Rb</text>
    </svg>
  )},
  { id: "ror", name: "Ruby on Rails", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#CC0000"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="6" fill="white">Rails</text>
    </svg>
  )},
  { id: "java", name: "Java", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#007396"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="white">Java</text>
    </svg>
  )},
  { id: "matlab", name: "MATLAB", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#0076A8"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fill="white">MAT</text>
    </svg>
  )},
  { id: "onshape", name: "Onshape", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#2C2F33"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="7" fill="white">Ons</text>
    </svg>
  )},
  { id: "xml", name: "XML", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#0066A1"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="white">XML</text>
    </svg>
  )},
  { id: "python", name: "Python", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#3776AB"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fill="white">Py</text>
    </svg>
  )},
  { id: "js", name: "JavaScript", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#F7DF1E"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fill="#111">JS</text>
    </svg>
  )},
  { id: "ts", name: "TypeScript", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#3178C6"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fill="white">TS</text>
    </svg>
  )},
  { id: "react", name: "React", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#61DAFB"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fill="#0B1626">React</text>
    </svg>
  )},
  { id: "tailwind", name: "Tailwind CSS", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#06B6D4"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="7" fill="#023047">TW</text>
    </svg>
  )},
  { id: "vercel", name: "Vercel", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#111827"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fill="white">Vercel</text>
    </svg>
  )},
  { id: "eclipse", name: "Eclipse IDE", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#2C2C54"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="7" fill="white">Ecl</text>
    </svg>
  )},
  { id: "g-suite", name: "Google Suite", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#4285F4"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fill="white">G</text>
    </svg>
  )},
  { id: "ms-suite", name: "Microsoft Suite", svg: (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect rx="8" width="48" height="48" fill="#0078D4"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="7" fill="white">MS</text>
    </svg>
  )},
];

export default techIcons;
