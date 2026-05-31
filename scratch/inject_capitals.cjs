const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '../src/data/routes.json');
let data = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

const cities = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília',
  'Curitiba', 'Florianópolis', 'Porto Alegre', 'Goiânia',
  'Salvador', 'Recife', 'Fortaleza', 'Campinas',
  'Ribeirão Preto', 'Londrina', 'Maringá', 'Foz do Iguaçu',
  'Balneário Camboriú', 'Caxias do Sul', 'Campo Grande', 'Cuiabá',
  'Vitória', 'Maceió', 'Natal', 'João Pessoa', 'Aracaju'
];

const companies = ['Catarinense', 'Cometa', '1001', 'Guanabara', 'Pluma', 'Penha', 'Garcia', 'Real Expresso', 'Águia Branca', 'Itapemirim'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTime() {
  const h = getRandomInt(0, 23).toString().padStart(2, '0');
  const m = (getRandomInt(0, 3) * 15).toString().padStart(2, '0');
  return `${h}:${m}`;
}

let added = 0;

for (let i = 0; i < cities.length; i++) {
  for (let j = 0; j < cities.length; j++) {
    if (i === j) continue;
    
    const origin = cities[i];
    const dest = cities[j];
    
    // Check if route exists
    const existing = data.filter(r => r.origin === origin && r.destination === dest);
    
    // Queremos pelo menos 1 a 2 ônibus por rota
    const targetBuses = getRandomInt(1, 2);
    
    if (existing.length < targetBuses) {
      for (let k = existing.length; k < targetBuses; k++) {
        const price = getRandomInt(120, 650);
        const depTime = generateTime();
        
        // Calcular arrival (horas baseadas no preco)
        const hours = Math.floor(price / 18) || 5;
        let [h, m] = depTime.split(':').map(Number);
        h = (h + hours) % 24;
        const arrTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        
        const company = companies[getRandomInt(0, companies.length - 1)];
        
        data.push({
          origin: origin,
          destination: dest,
          company: company,
          departureTime: depTime,
          arrivalTime: arrTime,
          price: price,
          buyUrl: 'https://tidd.ly/42W1t0i'
        });
        added++;
      }
    }
  }
}

fs.writeFileSync(routesPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Sucesso! Foram injetadas ${added} novas rotas entre as capitais e grandes hubs.`);
