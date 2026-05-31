document.addEventListener('DOMContentLoaded', () => {
  // 1. Pegar parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const origin = urlParams.get('origin');
  const dest = urlParams.get('dest');
  const date = urlParams.get('date');
  const company = urlParams.get('company') || 'viação parceira';

  // 2. Preencher a UI se tivermos os dados
  if (origin && dest) {
    document.getElementById('route-details').style.display = 'block';
    document.getElementById('val-origin').textContent = decodeURIComponent(origin);
    document.getElementById('val-dest').textContent = decodeURIComponent(dest);
    document.getElementById('status-title').textContent = `Transferindo para a ${decodeURIComponent(company)}...`;
  }

  // 3. Construir o Deep Link (Awin)
  let redirectUrl = 'https://tidd.ly/42W1t0i'; 
  
  if (origin && dest && date) {
    const slugify = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-');
    
    const originSlug = slugify(decodeURIComponent(origin));
    const destSlug = slugify(decodeURIComponent(dest));
    const decodedCompany = decodeURIComponent(company);

    const stateMap = {
      'sao-paulo': 'sp', 'rio-de-janeiro': 'rj', 'belo-horizonte': 'mg', 'brasilia': 'df',
      'curitiba': 'pr', 'florianopolis': 'sc', 'porto-alegre': 'rs', 'balneario-camboriu': 'sc',
      'foz-do-iguacu': 'pr', 'sao-borja': 'rs', 'goiania': 'go', 'salvador': 'ba',
      'recife': 'pe', 'fortaleza': 'ce', 'campinas': 'sp', 'ribeirao-preto': 'sp',
      'londrina': 'pr', 'maringa': 'pr', 'caxias-do-sul': 'rs', 'campo-grande': 'ms',
      'cuiaba': 'mt', 'vitoria': 'es', 'maceio': 'al', 'natal': 'rn', 'joao-pessoa': 'pb', 'aracaju': 'se'
    };

    // Inteligência de Roteamento de Frotas
    // Dizemos para qual plataforma a viação deve ir
    const partnerMap = {
      "Águia Branca": "buson",
      "Aguia Branca": "buson",
      "1001": "buson",
      "Pluma": "buson",
      "Garcia": "buson",
      "Viação Garcia": "buson",
      "Expresso do Sul": "buson",
      "Cometa": "quero_passagem",
      "Catarinense": "quero_passagem",
      "Guanabara": "quero_passagem",
      "Penha": "quero_passagem",
      "Real Expresso": "quero_passagem"
    };

    const targetPartner = partnerMap[decodedCompany] || "quero_passagem";
    const originState = stateMap[originSlug] ? `${stateMap[originSlug]}` : '';
    const destState = stateMap[destSlug] ? `${stateMap[destSlug]}` : '';

    let targetUrl = '';

    if (targetPartner === 'buson') {
      // BUSON: /passagem-de-onibus/sao-paulo-todos-sp/rio-de-janeiro-todos-rj?ida=2026-06-01
      const finalOrigin = originState ? `${originSlug}-todas-${originState}` : originSlug;
      const finalDest = destState ? `${destSlug}-todos-${destState}` : destSlug;
      targetUrl = `https://www.buson.com.br/passagem-de-onibus/${finalOrigin}/${finalDest}?ida=${date}`;
      // Placeholder: Se um dia tiver Link da Awin para a Buson, envolver aqui.
      // Por enquanto, enviamos direto para a Buson para testar a mecânica visual.
      redirectUrl = targetUrl;
      
    } else {
      // QUERO PASSAGEM: /onibus/sao-paulo-sp-todos-para-rio-de-janeiro-rj-todos?ida=31-05-2026
      const finalOrigin = originState ? `${originSlug}-${originState}` : originSlug;
      const finalDest = destState ? `${destSlug}-${destState}` : destSlug;
      
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      
      targetUrl = `https://queropassagem.com.br/onibus/${finalOrigin}-para-${finalDest}?ida=${formattedDate}`;
      redirectUrl = `https://tidd.ly/42W1t0i?ued=${encodeURIComponent(targetUrl)}`;
    }
  }

  // 4. Redirecionar após a animação (3.5 segundos)
  setTimeout(() => {
    window.location.replace(redirectUrl);
  }, 3500);
});
