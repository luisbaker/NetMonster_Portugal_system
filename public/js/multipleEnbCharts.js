async function loadCSV(filePath) {
	return new Promise((resolve, reject) => {
		const enbs = new Set();
		Papa.parse(filePath, {
			download: true,
			delimiter: ";",
			step: (row) => {
				try {
					if (!row.data[0].startsWith("4G")) {
						return;
					}
					console.log(`Processing row: ${row.data}`);
					const enb = row.data[5];
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
				console.log(
					"NetMonster processing complete. Unique eNBs count:",
					enbs.size,
				);
				resolve(enbs.size);
			},
			error: (error) => {
				console.error("NetMonster processing error:", error);
				reject(error);
			},
		});
	});
}

function createPieChart(canvasId, label, data, total) {
	const percentual = (data / total) * 100;
	const ctx = document.getElementById(canvasId).getContext("2d");
	new Chart(ctx, {
		type: "doughnut",
		data: {
			labels: [
				`Antenas identificadas (${data})`,
				`Por identificar (${total - data})`,
			],
			datasets: [
				{
					data: [percentual, 100 - percentual],
					backgroundColor: ["#36a2eb", "#d3d3d3"],
				},
			],
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
					bottom: 5,
				},
			},
		},
	});
}

async function generateCharts() {
	const percentuais = {
		26201: 4874, // NOS
		26202: 5074, // Vodafone
		26203: 2000, // Digi
		26204: 5048, // MEO
	};

	const operadoras = ["26201", "26202", "26203", "26204"];
	const operadoraNames = {
		26201: "NOS",
		26202: "Vodafone",
		26203: "Digi",
		26204: "MEO",
	};

	for (const operadora of operadoras) {
		try {
			const operadoraENBCount = await loadCSV(`/database/${operadora}_PT.ntm`);
			console.log(`${operadora} data:`, operadoraENBCount);

			createPieChart(
				`${operadora.toLowerCase()}Canvas`,
				operadoraNames[operadora],
				operadoraENBCount,
				percentuais[operadora],
			);
			console.log(`Created chart for ${operadoraNames[operadora]}`);
		} catch (error) {
			console.error(
				`Error generating chart for ${operadoraNames[operadora]}:`,
				error,
			);
		}
	}
}

generateCharts();
