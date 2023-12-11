// Função para carregar e processar os dados de um arquivo CSV
async function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    let enbs = new Set(); // Cria um conjunto para armazenar eNBs únicos
    Papa.parse(filePath, {
      download: true,
      step: function(row) {
        let enb = row.data[0].split(';')[5]; // Obtém o eNB da linha atual
        enbs.add(enb); // Adiciona o eNB ao conjunto
      },
      complete: () => resolve(enbs.size), // Retorna o número de eNBs únicos
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
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1, 
      layout: {
        padding: {
          top: 1,
          left: 2,
          right: 2,
          bottom: 2
        }
      }
    }
  });
}

async function generateCharts() {
  const percentuais = {
    'NOS': 4874,
    'Vodafone': 5074,
    'Digi': 2000,
    'MEO': 5048
  };

  const operadoras = ['NOS', 'Vodafone', 'Digi', 'MEO'];

  for (const operadora of operadoras) {
    const operadoraENBCount = await loadCSV(`/database/${operadora}_PT.ntm`);
    console.log(`${operadora} data:`, operadoraENBCount); 

    createPieChart(`${operadora.toLowerCase()}Canvas`, operadora, operadoraENBCount, percentuais[operadora]);
    console.log(`Created chart for ${operadora}`); 
  }
}

generateCharts();
