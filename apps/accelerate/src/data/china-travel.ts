export type ChinaTravelStop = {
  city: string;
  date: string;
  venue: string;
  hotel: string;
  address: string;
  hotelWebsite: string;
  directionsUrl: string;
  hotelPhone: string;
  entry: string;
  primaryAirport: string;
  alternativeAirport?: string;
  arrivalNote?: string;
  groundTransport: string[];
  ferryLink?: {
    label: string;
    href: string;
  };
  accessibility: string;
};

export const chinaTravelStops: ChinaTravelStop[] = [
  {
    city: "Shanghai",
    date: "16 Oct 2026",
    venue: "Jing An Grand Ballroom, Level 5",
    hotel: "Jing An Shangri-La, West Shanghai",
    address:
      "1218 Middle Yan'an Road, Jing'an District, Shanghai 200040, China",
    hotelWebsite: "https://www.shangri-la.com/shanghai/jinganshangrila/",
    directionsUrl:
      "https://www.shangri-la.com/shanghai/jinganshangrila/about/map-directions/",
    hotelPhone: "+86 21 2203 8888",
    entry:
      "At the hotel lobby, ask for Solana Accelerate and directions to Jing An Grand Ballroom on Level 5. Dedicated entrance, check-in time and admission requirements: to be confirmed.",
    primaryAirport: "Shanghai Hongqiao International Airport (SHA)",
    alternativeAirport:
      "Shanghai Pudong International Airport (PVG). Choose PVG if it offers a more convenient flight.",
    groundTransport: [
      "Taxi / pre-booked car: approximately 30 minutes from SHA and 45 minutes from PVG. Allow extra time for traffic.",
      "Metro: Line 2 from Hongqiao Terminal 2 or Pudong to Jing'an Temple; the hotel is a short walk away.",
    ],
    accessibility:
      "The hotel lists facilities for guests with disabilities. Contact Charlotte in advance to confirm the step-free route to Level 5 and any assistance.",
  },
  {
    city: "Hangzhou",
    date: "18 Oct 2026",
    venue: "Grand Ballroom, Level 2",
    hotel: "Midtown Shangri-La, Hangzhou",
    address: "6 Changshou Road, Gongshu District, Hangzhou 310006, China",
    hotelWebsite: "https://www.shangri-la.com/hangzhou/midtownshangrila/",
    directionsUrl:
      "https://www.shangri-la.com/hangzhou/midtownshangrila/about/map-directions/",
    hotelPhone: "+86 571 8733 8888",
    entry:
      "At the hotel lobby, ask for Accelerate and directions to Grand Ballroom on Level 2. Dedicated entrance, check-in time and admission requirements: to be confirmed.",
    primaryAirport: "Hangzhou Xiaoshan International Airport (HGH)",
    arrivalNote:
      "HGH is the local arrival airport. Guests continuing from Shanghai can request a seat on the 17 October group coach.",
    groundTransport: [
      "Taxi / pre-booked car: approximately 50 minutes from HGH, according to the hotel. Allow extra time for traffic.",
      "Metro: Line 1 connects HGH with Fengqi Road. Complete the last leg to the hotel on foot or by taxi.",
    ],
    accessibility:
      "Contact Charlotte in advance about step-free access, lifts, accessible toilets or seating needs. The event access route is awaiting hotel confirmation.",
  },
  {
    city: "Shenzhen",
    date: "20 Oct 2026",
    venue: "Sea World Grand Ballroom, Level 1",
    hotel: "Hilton Shenzhen Shekou Nanhai",
    address: "1177 Wanghai Road, Nanshan District, Shenzhen 518067, China",
    hotelWebsite:
      "https://www.hilton.com/en/hotels/szxsshi-hilton-shenzhen-shekou-nanhai/",
    directionsUrl:
      "https://www.hilton.com/en/hotels/szxsshi-hilton-shenzhen-shekou-nanhai/hotel-location/",
    hotelPhone: "+86 755 2162 8888",
    entry:
      "At the hotel lobby, ask for Accelerate and directions to Sea World Grand Ballroom on Level 1. Dedicated entrance, check-in time and admission requirements: to be confirmed.",
    primaryAirport: "Shenzhen Bao'an International Airport (SZX)",
    alternativeAirport:
      "Hong Kong International Airport (HKG), with an additional cross-border transfer to Shenzhen.",
    groundTransport: [
      "From SZX: take a taxi or pre-booked car to the hotel, approximately 25 km away.",
      "From HKG: eligible air-transfer passengers can take the SkyPier ferry to Shekou, then a taxi. Check transfer rules first.",
    ],
    ferryLink: {
      label: "HKIA ferry rules & connections",
      href: "https://www.hongkongairport.com/en/transport/mainland-connection/ferry-transfer.page",
    },
    accessibility:
      "Contact Charlotte about step-free access, accessible toilets or seating needs. The event route awaits hotel confirmation.",
  },
  {
    city: "Beijing",
    date: "22 Oct 2026",
    venue: "Ballroom, Level 1",
    hotel: "The St. Regis Beijing",
    address:
      "21 Jianguomenwai Street, Chaoyang District, Beijing 100020, China",
    hotelWebsite:
      "https://www.marriott.com/en-us/hotels/bjsxr-the-st-regis-beijing/overview/",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=The%20St.%20Regis%20Beijing%2021%20Jianguomenwai%20Street%20Beijing",
    hotelPhone: "+86 10 6460 6688",
    entry:
      "At the hotel lobby, ask for Accelerate and directions to the ballroom on Level 1. Dedicated entrance, check-in time and admission requirements: to be confirmed.",
    primaryAirport: "Beijing Capital International Airport (PEK)",
    alternativeAirport:
      "Beijing Daxing International Airport (PKX), if it offers a more convenient flight.",
    groundTransport: [
      "Taxi / pre-booked car: the hotel lists PEK at 25.6 km and PKX at 60 km. Allow extra time for city traffic.",
      "For metro journeys, use Jianguomen Station on Lines 1 and 2. The hotel is about a seven-minute walk away.",
    ],
    accessibility:
      "The hotel lists an accessible main entrance and meeting spaces. Contact Charlotte in advance to confirm the event route and any assistance.",
  },
];
