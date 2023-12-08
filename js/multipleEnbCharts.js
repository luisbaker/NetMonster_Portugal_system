// Função para carregar e processar os dados de um arquivo CSV
async function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => resolve(result.data),
      error: (error) => reject(error),
    });
  });
}

// Função para criar um gráfico circular
function createPieChart(canvasId, label, data, total) {
  const percentual = (data / total) * 100;
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [`${label} (${data})`, `Outros (${total - data})`],
      datasets: [{
        data: [percentual, 100 - percentual],
        backgroundColor: ['#36a2eb', '#d3d3d3'],
      }],
    },
  });
}

// Função principal para processar os dados e criar gráficos
async function generateCharts() {
  // Definir os percentuais diretamente no JavaScript
  const percentuais = {
    'NOS': 4874,
    'Vodafone': 5074,
    'Digi': 2000,
    'MEO': 5048
  };

  // Iterar sobre cada operadora
  const operadoras = ['NOS', 'Vodafone', 'Digi', 'MEO'];

  for (const operadora of operadoras) {
    // Carregar os dados de cada arquivo CSV
    const operadoraData = await loadCSV(`database/${operadora}_PT.ntm`);
    console.log(`${operadora} data:`, operadoraData); // Log para depuração
    const operadoraENBCount = operadoraData.length;

    // Criar gráfico circular para cada operadora com base nos percentuais
    createPieChart(`${operadora.toLowerCase()}Canvas`, operadora, operadoraENBCount, percentuais[operadora]);
    console.log(`Created chart for ${operadora}`); // Log para depuração
  }
}

// Chamar a função principal para gerar os gráficos
generateCharts();
