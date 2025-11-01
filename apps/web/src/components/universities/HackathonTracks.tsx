"use client";

import React from "react";
import { Code, Zap, Server, Tool, Users } from "react-feather";

interface HackathonTracksProps {
  translations: {
    title: string;
    subtitle: string;
    prizeAmount: string;
    tracks: Array<{
      title: string;
      description: string;
    }>;
  };
}

export default function HackathonTracks({
  translations,
}: HackathonTracksProps) {
  const trackIcons = [
    {
      icon: <Users size={32} />,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/30",
    },
    {
      icon: <Zap size={32} />,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/30",
    },
    {
      icon: <Server size={32} />,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/30",
    },
    {
      icon: <Tool size={32} />,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/30",
    },
    {
      icon: <Code size={32} />,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/30",
    },
  ];

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {translations.title}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {translations.subtitle}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {translations.tracks.map((track, index) => {
            const iconConfig = trackIcons[index % trackIcons.length];
            return (
              <div
                key={index}
                className={`bg-gray-900/50 rounded-2xl p-6 border ${iconConfig.border} hover:${iconConfig.bg} transition-all duration-300 hover:transform hover:scale-105`}
              >
                <div
                  className={`w-16 h-16 rounded-xl ${iconConfig.bg} flex items-center justify-center mb-4 ${iconConfig.color}`}
                >
                  {iconConfig.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {track.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {track.description}
                </p>
                <div className={`pt-4 border-t border-gray-800`}>
                  <span className={`text-2xl font-bold ${iconConfig.color}`}>
                    {translations.prizeAmount}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">prize</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
