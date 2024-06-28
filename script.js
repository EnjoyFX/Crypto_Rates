const BASE_URL = '{{RPI_URL_PLACEHOLDER}}';
let chart = null;

const colors = [
    '#1f77b4',  // Blue
    '#ff7f0e',  // Orange
    '#2ca02c',  // Green
    '#d62728',  // Red
    '#9467bd',  // Purple
    '#8c564b',  // Brown
    '#e377c2',  // Pink
    '#7f7f7f',  // Gray
    '#bcbd22',  // Yellow
    '#17becf'   // Cyan
];

// new colors generation based on main colors
function generateColors(index) {
    const color = colors[index % colors.length];
    const shadeFactor = Math.floor(index / colors.length);
    return shadeColor(color, shadeFactor * 0.2);
}

// helper for shading main colors
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.round(R * (1 - percent));
    G = Math.round(G * (1 - percent));
    B = Math.round(B * (1 - percent));

    const RR = (R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16);
    const GG = (G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16);
    const BB = (B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16);

    return `#${RR}${GG}${BB}`;
}

function adjustChartHeight() {
    const chartContainer = document.getElementById('chartContainer');
    const windowHeight = window.innerHeight;

    if (window.innerWidth < 768) {
        chartContainer.style.height = `${windowHeight * 0.7}px`; // 70% of height for mobile
    } else {
        chartContainer.style.height = '600px';
    }
}

$(document).ready(function() {
    adjustChartHeight();

    $(window).resize(function() {
        adjustChartHeight();
    });

    $('#rateForm').submit(async function(event) {
        event.preventDefault();
        const symbols = $('#symbols').val().split(',');
        const periods = $('#periods').val();

        const datasets = [];
        let labels = [];
        const realPrices = {};

        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            const response = await fetch(`http://${BASE_URL}:8001/rates/${symbol.trim()}?periods=${periods}`);
            const data = await response.json();

            const symbolLabels = data.map(rate => new Date(rate.timestamp));
            const prices = data.map(rate => rate.price);

            realPrices[symbol.trim()] = prices;

            if (labels.length === 0) {
                labels = symbolLabels;
            }

            const initialPrice = prices[0];
            const percentChanges = prices.map(price => ((price - initialPrice) / initialPrice) * 100);

            datasets.push({
                label: `Price of ${symbol.trim()}`,
                data: percentChanges,
                borderColor: generateColors(i),
                backgroundColor: 'rgba(0, 0, 0, 0)',
                fill: false,
                tension: 0.1
            });
        }

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('rateChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const symbol = context.dataset.label.split(' ')[2];
                                const realPrice = realPrices[symbol][context.dataIndex];
                                const percentChange = context.raw;
                                return `${symbol}: ${realPrice} (${percentChange.toFixed(2)}%)`;
                            }
                        }
                    },
                    legend: {
                        display: true
                    }
                }
            }
        });
    });
});
