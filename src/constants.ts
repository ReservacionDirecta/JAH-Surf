export const PRICE_TABLES = {
  grupales: [
    { name: "Una sola clase", price: 90, classesPerMonth: 1 },
    { name: "1 clase/semana (4 al mes)", price: 300, classesPerMonth: 4 },
    { name: "2 clases/semana (8 al mes)", price: 560, classesPerMonth: 8 },
    { name: "3 clases/semana (12 al mes)", price: 820, classesPerMonth: 12 },
    { name: "4 clases/semana (16 al mes)", price: 1000, classesPerMonth: 16 },
  ],
  individuales: [
    { name: "Una sola clase", price: 100, classesPerMonth: 1 },
    { name: "1 clase/semana (4 al mes)", price: 350, classesPerMonth: 4 },
    { name: "2 clases/semana (8 al mes)", price: 680, classesPerMonth: 8 },
    { name: "3 clases/semana (12 al mes)", price: 960, classesPerMonth: 12 },
    { name: "4 clases/semana (16 al mes)", price: 1200, classesPerMonth: 16 },
  ],
  otras: [
    { name: "Paseos en Paddle", price: 100, perPerson: true },
    { name: "Paseos en Kayak", price: 100, perPerson: true },
    { name: "Campamentos", price: 680, perPerson: true },
    { name: "Corporativo / Santos", price: 680, classesPerMonth: 8 },
  ]
};
