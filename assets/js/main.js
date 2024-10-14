document.getElementById("convertir").addEventListener("click", convertirMoneda);

async function convertirMoneda() {
    const monto = document.getElementById("monto").value;
    const moneda = document.getElementById("moneda").value;
    
    try {
        const response = await fetch("https://mindicador.cl/api");
        if (!response.ok) {
            throw new Error("Error en la API");
        }
        const data = await response.json();
        procesarDatos(data, monto, moneda);
    } catch (error) {
        console.log("Usando datos offline:", error.message);
        const datosOffline = obtenerDatosOffline();
        procesarDatosOffline(datosOffline, monto, moneda);
    }
}

function procesarDatos(data, monto, moneda) {
    let valorMoneda = data[moneda].valor;
    const resultado = (monto / valorMoneda).toFixed(2);
    document.getElementById("resultado").innerText = `Resultado: $${resultado}`;
    
    mostrarGraficoDespuesDeConversion(moneda);
}

function procesarDatosOffline(data, monto, moneda) {
    let valorMoneda = data[moneda].valor;
    const resultado = (monto / valorMoneda).toFixed(2);
    document.getElementById("resultado").innerText = `Resultado: $${resultado}`;
    
    mostrarGraficoDespuesDeConversion(moneda);
}

function obtenerDatosOffline() {
    return {
        "uf": { "valor": 33455.92 },
        "ivp": { "valor": 34000.48 },
        "dolar": { "valor": 907.82 },
        "dolar_intercambio": { "valor": 758.87 },
        "euro": { "valor": 922.21 },
        "ipc": { "valor": 0.9 },
        "utm": { "valor": 58772 },
        "imacec": { "valor": 3.7 },
        "tpm": { "valor": 9.75 },
        "libra_cobre": { "valor": 3.54 },
        "tasa_desempleo": { "valor": 7.81 },
        "bitcoin": { "valor": 23298.94 }
    };
}

function mostrarGraficoDespuesDeConversion(moneda) {
    document.getElementById("contenedor-grafico").style.display = "block";

    const valores = obtenerHistorialMoneda(moneda);
    mostrarGrafico(moneda, valores);
}

function mostrarGrafico(moneda, valores) {
    const ctx = document.getElementById("grafico").getContext("2d");
    const etiquetas = ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7", "Día 8", "Día 9", "Día 10"];

    if (window.miGrafico) {
        window.miGrafico.destroy();
    }

    window.miGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: [{
                label: `Historial últimos 10 días (${moneda})`,
                data: valores,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function obtenerHistorialMoneda(moneda) {
    switch (moneda) {
        case "dolar":
            return [905, 910, 912, 915, 918, 920, 925, 930, 932, 935];
        case "euro":
            return [915, 920, 925, 928, 930, 933, 935, 938, 940, 942];
        case "uf":
            return [33000, 33200, 33300, 33400, 33500, 33600, 33700, 33800, 33900, 34000];
        case "ivp":
            return [33500, 33600, 33700, 33800, 33900, 34000, 34100, 34200, 34300, 34400];
        case "dolar_intercambio":
            return [750, 752, 755, 758, 760, 763, 765, 767, 770, 772];
        case "ipc":
            return [0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99];
        case "utm":
            return [58000, 58200, 58400, 58600, 58800, 59000, 59200, 59400, 59600, 59800];
        case "imacec":
            return [3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4];
        case "tpm":
            return [9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2, 10.3, 10.4];
        case "libra_cobre":
            return [3.5, 3.52, 3.54, 3.56, 3.58, 3.60, 3.62, 3.64, 3.66, 3.68];
        case "tasa_desempleo":
            return [7.7, 7.71, 7.72, 7.73, 7.74, 7.75, 7.76, 7.77, 7.78, 7.79];
        case "bitcoin":
            return [23000, 23100, 23200, 23300, 23400, 23500, 23600, 23700, 23800, 23900];
        default:
            return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
}

