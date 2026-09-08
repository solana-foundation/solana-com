export type ChinaStop = {
  city: string;
  date: string;
  time: string;
  startDate: string;
  endDate: string;
  venue: string;
  address: string;
  description: string;
  registrationUrl: string;
  mapUrl: string;
  capacity: string;
  image: string;
};

export const chinaStops: ChinaStop[] = [
  {
    city: "Shanghai",
    date: "Oct 16, 2026",
    time: "10:00–18:00 GMT+8",
    startDate: "2026-10-16T10:00:00+08:00",
    endDate: "2026-10-16T18:00:00+08:00",
    venue: "Jing An Grand Ballroom (5F)",
    address:
      "Jing An Shangri-La, West Shanghai, 1218 Middle Yan'an Road, Jing'an District, Shanghai 200040, China",
    description:
      "Where Heritage Meets the Future. A global city defined by ambition, innovation and culture. From the historic Bund to the iconic Pudong skyline, Shanghai brings together rich heritage and forward-thinking energy — making it a natural meeting point for ideas, connections and what comes next.",
    registrationUrl: "https://luma.com/acc-shanghai-26",
    mapUrl: "https://maps.app.goo.gl/EfLgSuTm9W81Dpuu6",
    capacity: "400 attendees",
    image: "/images/china/shanghai-card.webp",
  },
  {
    city: "Hangzhou",
    date: "Oct 18, 2026",
    time: "10:00–17:00 GMT+8",
    startDate: "2026-10-18T10:00:00+08:00",
    endDate: "2026-10-18T17:00:00+08:00",
    venue: "Grand Ballroom (2F)",
    address:
      "Midtown Shangri-La, Hangzhou, 6 Changshou Road, Gongshu District, Hangzhou 310006, China",
    description:
      "Where Tradition Inspires Innovation. A city where natural beauty, rich heritage and modern innovation come together. From the timeless scenery of West Lake to its thriving technology ecosystem, Hangzhou blends centuries of culture with a forward-looking spirit — creating a city shaped by both imagination and progress.",
    registrationUrl: "https://luma.com/acc-hangzhou-26",
    mapUrl: "https://maps.app.goo.gl/87zVXbEPBkt2fPp17",
    capacity: "480 attendees",
    image: "/images/china/hangzhou-card.webp",
  },
  {
    city: "Shenzhen",
    date: "Oct 20, 2026",
    time: "10:00–17:00 GMT+8",
    startDate: "2026-10-20T10:00:00+08:00",
    endDate: "2026-10-20T17:00:00+08:00",
    venue: "Seaworld Grand Ballroom (1F)",
    address:
      "Hilton Shenzhen Shekou Nanhai, 1177 Wanghai Road, Nanshan District, Shenzhen 518067, China",
    description:
      "Where Innovation Moves Fast. A city built on bold ideas and entrepreneurial energy. From a fishing village to a global technology powerhouse, Shenzhen represents China’s spirit of transformation — a dynamic meeting point for technology, creativity and the people building what comes next.",
    registrationUrl: "https://luma.com/acc-shenzhen-26",
    mapUrl: "https://maps.app.goo.gl/AEU5NUBQ8FwhZ2Z58",
    capacity: "480 attendees",
    image: "/images/china/shenzhen-card.webp",
  },
  {
    city: "Beijing",
    date: "Oct 22, 2026",
    time: "10:00–17:00 GMT+8",
    startDate: "2026-10-22T10:00:00+08:00",
    endDate: "2026-10-22T17:00:00+08:00",
    venue: "Astor Ballroom (1F)",
    address:
      "The St. Regis Beijing, 21 Jianguomenwai Street, Chaoyang District, Beijing 100020, China",
    description:
      "Where History Shapes the Future. A city where centuries of history meet bold ideas and modern ambition. From its iconic cultural landmarks to its thriving technology and innovation ecosystem, Beijing brings together heritage, influence and forward-thinking energy — a place where China’s past and future converge.",
    registrationUrl: "https://luma.com/acc-beijing-26",
    mapUrl: "https://maps.app.goo.gl/5bCoYaoxG72q1aeW8",
    capacity: "480 attendees",
    image: "/images/china/beijing-card.webp",
  },
];
