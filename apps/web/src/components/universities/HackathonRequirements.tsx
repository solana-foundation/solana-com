"use client";

import React from "react";
import { Check } from "react-feather";

interface HackathonRequirementsProps {
  title: string;
  problemTitle: string;
  problemDescription: string;
  requirementsItems: string[];
}

export default function HackathonRequirements({
  title,
  problemTitle,
  problemDescription,
  requirementsItems,
}: HackathonRequirementsProps) {
  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {problemTitle}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {problemDescription}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-8 md:p-10 border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
            <ul className="space-y-4">
              {requirementsItems.map((req, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-4">
                    <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                      <Check size={14} className="text-green-400" />
                    </div>
                  </div>
                  <span className="text-gray-300 text-lg">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
