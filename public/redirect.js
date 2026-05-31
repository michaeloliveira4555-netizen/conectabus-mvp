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

  // 3. Construir o Deep Link (Awin / Quero Passagem)
  let redirectUrl = 'https://tidd.ly/42W1t0i'; // Link oficial Awin (Quero Passagem genérico)
  
  if (origin && dest && date) {
    // Mapeamento de Estados (Essencial para URL da Quero Passagem)
    const stateMap = {
      'sao-paulo': 'sp', 'rio-de-janeiro': 'rj', 'belo-horizonte': 'mg', 'brasilia': 'df',
      'curitiba': 'pr', 'florianopolis': 'sc', 'porto-alegre': 'rs', 'balneario-camboriu': 'sc',
      'foz-do-iguacu': 'pr', 'sao-borja': 'rs', 'goiania': 'go', 'salvador': 'ba',
      'recife': 'pe', 'fortaleza': 'ce', 'campinas': 'sp', 'ribeirao-preto': 'sp',
      'londrina': 'pr', 'maringa': 'pr', 'caxias-do-sul': 'rs', 'campo-grande': 'ms',
      'cuiaba': 'mt', 'vitoria': 'es', 'maceio': 'al', 'natal': 'rn', 'joao-pessoa': 'pb', 'aracaju': 'se'
    };

    // Função para limpar string e gerar slug
    const slugify = (str) => {
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-');
    };

    const originSlug = slugify(decodeURIComponent(origin));
    const destSlug = slugify(decodeURIComponent(dest));

    // Pegar estado ou usar sufixo vazio se não existir mapeamento
    const originState = stateMap[originSlug] ? `-${stateMap[originSlug]}` : '';
    const destState = stateMap[destSlug] ? `-${stateMap[destSlug]}` : '';

    const finalOrigin = `${originSlug}${originState}`;
    const finalDest = `${destSlug}${destState}`;

    // A data vem em YYYY-MM-DD do input type="date", converter para DD-MM-YYYY
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}-${month}-${year}`;
    
    // URL Perfeita da Quero Passagem
    const targetUrl = `https://queropassagem.com.br/onibus/${finalOrigin}-para-${finalDest}?ida=${formattedDate}`;
    
    // Awin Deep Link Envelope (Geralmente usando ued, url ou p dependendo da configuração da Awin)
    // Para Awin, o parâmetro padrão é `&ued=`
    redirectUrl = `https://tidd.ly/42W1t0i?ued=${encodeURIComponent(targetUrl)}`;
  }

  // 4. Redirecionar após a animação (3.5 segundos)
  setTimeout(() => {
    window.location.replace(redirectUrl);
  }, 3500);
});
