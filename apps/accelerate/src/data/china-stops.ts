export type ChinaStop = {
  city: string;
  date: string;
  time: string;
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
    venue: "Jing An Grand Ballroom (5F)",
    address:
      "Jing An Shangri-La, West Shanghai, 1218 Middle Yan'an Road, Jing'an District, Shanghai 200040, China",
    description:
      "A global city defined by ambition, innovation and culture. From the historic Bund to the Pudong skyline, Shanghai is a natural meeting point for ideas, connections and what comes next.",
    registrationUrl: "https://luma.com/acc-shanghai-26",
    mapUrl: "https://maps.app.goo.gl/EfLgSuTm9W81Dpuu6",
    capacity: "400 attendees",
    image: "/images/china/shanghai-card.webp",
  },
  {
    city: "Hangzhou",
    date: "Oct 18, 2026",
    time: "10:00–17:00 GMT+8",
    venue: "Grand Ballroom (2F)",
    address:
      "Midtown Shangri-La, Hangzhou, 6 Changshou Road, Gongshu District, Hangzhou 310006, China",
    description:
      "A city where natural beauty, rich heritage and modern innovation come together. From West Lake to its technology ecosystem, Hangzhou pairs imagination with progress.",
    registrationUrl: "https://luma.com/acc-hangzhou-26",
    mapUrl: "https://maps.app.goo.gl/87zVXbEPBkt2fPp17",
    capacity: "480 attendees",
    image: "/images/china/hangzhou-card.webp",
  },
  {
    city: "Shenzhen",
    date: "Oct 20, 2026",
    time: "10:00–17:00 GMT+8",
    venue: "Seaworld Grand Ballroom (1F)",
    address:
      "Hilton Shenzhen Shekou Nanhai, 1177 Wanghai Road, Nanshan District, Shenzhen 518067, China",
    description:
      "A city built on bold ideas and entrepreneurial energy. Shenzhen is a dynamic meeting point for technology, creativity and the people building what comes next.",
    registrationUrl: "https://luma.com/acc-shenzhen-26",
    mapUrl: "https://maps.app.goo.gl/AEU5NUBQ8FwhZ2Z58",
    capacity: "480 attendees",
    image: "/images/china/shenzhen-card.webp",
  },
  {
    city: "Beijing",
    date: "Oct 22, 2026",
    time: "10:00–17:00 GMT+8",
    venue: "Astor Ballroom (1F)",
    address:
      "The St. Regis Beijing, 21 Jianguomenwai Street, Chaoyang District, Beijing 100020, China",
    description:
      "A city where centuries of history meet bold ideas and modern ambition. Beijing brings together heritage, influence and forward-thinking energy.",
    registrationUrl: "https://luma.com/acc-beijing-26",
    mapUrl: "https://maps.app.goo.gl/5bCoYaoxG72q1aeW8",
    capacity: "480 attendees",
    image: "/images/china/beijing-card.webp",
  },
];
