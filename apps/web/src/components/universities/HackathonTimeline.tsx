"use client";

import React from "react";

interface HackathonTimelineProps {
  translations: {
    title: string;
    phaseHeader: string;
    dateHeader: string;
    descriptionHeader?: string;
    events: Array<{
      phase: string;
      date: string;
      description?: string;
    }>;
  };
}

export default function HackathonTimeline({
  translations,
}: HackathonTimelineProps) {
  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 text-center">
          {translations.title}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-4 md:px-6 text-green-400 font-semibold text-sm uppercase tracking-wider">
                    {translations.phaseHeader}
                  </th>
                  <th className="py-4 px-4 md:px-6 text-green-400 font-semibold text-sm uppercase tracking-wider">
                    {translations.dateHeader}
                  </th>
                  {translations.descriptionHeader && (
                    <th className="py-4 px-4 md:px-6 text-green-400 font-semibold text-sm uppercase tracking-wider">
                      {translations.descriptionHeader}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {translations.events.map((event, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                  >
                    <td className="py-4 px-4 md:px-6 text-white font-semibold">
                      {event.phase}
                    </td>
                    <td className="py-4 px-4 md:px-6 text-gray-300">
                      {event.date}
                    </td>
                    {translations.descriptionHeader && (
                      <td className="py-4 px-4 md:px-6 text-gray-400">
                        {event.description}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
