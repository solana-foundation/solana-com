"use client";

import React from "react";
import { Award, Star, Gift } from "react-feather";

interface HackathonPrizesProps {
  translations: {
    title: string;
    placeHeader: string;
    amountHeader: string;
    firstPlace: string;
    secondPlace: string;
    thirdPlace: string;
    firstPrize: string;
    secondPrize: string;
    thirdPrize: string;
    part2Label: string;
    part2Description: string;
  };
}

export default function HackathonPrizes({
  translations,
}: HackathonPrizesProps) {
  const prizes = [
    {
      place: translations.firstPlace,
      amount: translations.firstPrize,
      icon: <Star size={24} />,
      textColor: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      place: translations.secondPlace,
      amount: translations.secondPrize,
      icon: <Award size={24} />,
      textColor: "text-gray-300",
      bgColor: "bg-gray-300/10",
    },
    {
      place: translations.thirdPlace,
      amount: translations.thirdPrize,
      icon: <Gift size={24} />,
      textColor: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 text-center">
          {translations.title}
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-4 md:px-6 text-green-400 font-semibold text-sm uppercase tracking-wider">
                    {translations.placeHeader}
                  </th>
                  <th className="py-4 px-4 md:px-6 text-green-400 font-semibold text-sm uppercase tracking-wider text-right">
                    {translations.amountHeader}
                  </th>
                </tr>
              </thead>
              <tbody>
                {prizes.map((prize, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-800 hover:${prize.bgColor} transition-colors`}
                  >
                    <td className="py-4 px-4 md:px-6">
                      <div className="flex items-center space-x-3">
                        <span className={prize.textColor}>{prize.icon}</span>
                        <span className="text-white font-semibold">
                          {prize.place}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`py-4 px-4 md:px-6 text-right ${prize.textColor} text-2xl font-bold`}
                    >
                      {prize.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 p-4 bg-green-400/10 rounded-lg border border-green-400/30">
            <p className="text-center text-gray-300">
              <span className="text-green-400 font-semibold">
                {translations.part2Label}
              </span>{" "}
              {translations.part2Description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
