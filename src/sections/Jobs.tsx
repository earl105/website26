import React from "react";

type Job = {
  company: string;
  position: string;
  dates: string;
  color: string;
  img: { src: string; alt: string };
  bullets: string[];
};

const jobs: Job[] = [
  {
    company: "Lowes",
    position: "Cashier and Customer Service",
    dates: "May 2025 - July 2025",
    color: "#0b217a",
    img: { src: "/images/work/lowesLogo.png", alt: "Lowes Logo" },
    bullets: [
      "Operated registers and processed high-volume transactions accurately while delivering friendly customer service.",
      "Assisted customers with product inquiries, returns, and locating merchandise across multiple departments.",
      "Supported Lawn & Garden and Lumber departments by managing heavy inventory, outdoor sales, and seasonal product flow.",
      "Fulfilled and organized online orders, ensuring timely pick-up and delivery accuracy for customers.",
    ],
  },
  {
    company: "GOJO Industries Inc.",
    position: "Warehouse Associate",
    dates: "May 2024 - July 2024",
    color: "#3498db",
    img: { src: "/images/work/gojoLogo.png", alt: "GOJO Logo" },
    bullets: [
      "Performed tasks in two-stage blow molding, including box preparation, filling, labeling, and palletizing.",
      "Collaborated in a 6-person assembly line to efficiently process and package Purell soap and sanitizer bottles.",
      "Assisted in 4 departments: single-stage blow molding, sanitization, logistics, and automation.",
      "Over 6 million bottles were produced and packed under the blow molding operations team in 3 months.",
    ],
  },
  {
    company: "Dicks Sporting Goods",
    position: "Footwear Sales Associate and Cashier",
    dates: "August 2021 - 2023",
    color: "#2ecc71",
    img: { src: "/images/work/dicksLogo.png", alt: "DSG Logo" },
    bullets: [
      "Cross-trained across 4 departments (footwear, outerwear, apparel, and cashier) to provide adaptable service.",
      "Managed and updated inventory for a department with over 250+ UPCs weekly.",
      "Efficiently processed and organized stock, handling up to 300 items per truck delivery.",
      "Cultivated strong customer relationships, driving store metrics to rank among the nation's top locations.",
    ],
  },
];

export default function Jobs() {
  return (
    <section id="jobs" className="min-h-screen flex flex-col px-6 py-12 pt-16">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">Jobs</h2>

        <div className="space-y-4">
          {jobs.map((job) => (
            <article
              key={job.company + job.position}
              className="flex flex-col md:flex-row md:items-start md:gap-6 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow transform hover:scale-102 transition-transform duration-200"
              style={{ backgroundColor: 'var(--card)' }}
            >
                <div className="flex items-center md:w-40 md:flex-col md:items-start">
                <div
                  className="w-20 h-20 rounded-md flex items-center justify-center mr-4 md:mr-0"
                  style={{ backgroundColor: job.color }}
                >
                  <img
                    src={job.img.src}
                    alt={job.img.alt}
                    className="max-w-[70%] max-h-[70%] object-contain"
                  />
                </div>
                <div className="mt-2 md:mt-4">
                  <div className="font-semibold">{job.company}</div>
                  <div className="text-sm" style={{ color: 'var(--muted)' }}>{job.dates}</div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-medium">{job.position}</h3>
                  <span className="hidden md:inline text-sm" style={{ color: 'var(--muted)' }}>{job.dates}</span>
                </div>

                <ul className="list-disc list-inside mt-3 space-y-2" style={{ color: 'var(--fg)' }}>
                  {job.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}