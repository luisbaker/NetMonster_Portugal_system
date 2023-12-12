async function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    let enbs = new Set();
    Papa.parse(filePath, {
      download: true,
      delimiter: ";",
      step: function (row) {
        try {
          // Ignore rows that don't start with "4G"
          if (!row.data[0].startsWith("4G")) {
            return;
          }

          console.log(`Processing row: ${row.data}`);

          let enb = row.data[5]; // Assuming eNB is always at index 5 for 4G

          if (enb) {
            console.log(`Found eNB: ${enb}`);
            enbs.add(enb);
          } else {
            console.warn("No eNB found in the row:", row.data);
          }
        } catch (error) {
          console.error("Error processing row:", error);
          reject(error);
        }
      },
      complete: () => {
        console.log("NetMonster processing complete. Unique eNBs count:", enbs.size);
        resolve(enbs.size);
      },
      error: (error) => {
        console.error("NetMonster processing error:", error);
        reject(error);
      },
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
          top: 5,
          left: 5,
          right: 5,
          bottom: 5
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
    try {
      const operadoraENBCount = await loadCSV(`/database/${operadora}_PT.ntm`);
      console.log(`${operadora} data:`, operadoraENBCount);

      createPieChart(`${operadora.toLowerCase()}Canvas`, operadora, operadoraENBCount, percentuais[operadora]);
      console.log(`Created chart for ${operadora}`);
    } catch (error) {
      console.error(`Error generating chart for ${operadora}:`, error);
    }
  }
}

generateCharts();
