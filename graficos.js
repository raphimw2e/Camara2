const token = "BBUS-qySPy2MwouB68dJm08bcFQWnw3RWW9";
const device = "Monitor-Ambiental-ESP32";

async function pegarDadosDia(variavel) {
    const agora = new Date();
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const url = `https://industrial.api.ubidots.com/api/v1.6/devices/${device}/${variavel}/values/?page_size=5000&start=${inicioDia.getTime()}&end=${agora.getTime()}`;

    const resp = await fetch(url, {
        headers: { "X-Auth-Token": token }
    });

    const json = await resp.json();
    return json.results;
}

function mediaPorHora(lista) {
    const grupos = {};

    lista.forEach(leitura => {
        const hora = new Date(leitura.timestamp).getHours();

        if (!grupos[hora]) grupos[hora] = [];
        grupos[hora].push(leitura.value);
    });

    const horas = [];
    const medias = [];

    for (let h = 0; h < 24; h++) {
        if (grupos[h]) {
            const soma = grupos[h].reduce((a, b) => a + b, 0);
            const media = soma / grupos[h].length;
            horas.push(`${h}:00`);
            medias.push(media.toFixed(2));
        }
    }

    return { horas, medias };
}

function criarGrafico(idCanvas, titulo, labels, dados) {
    new Chart(document.getElementById(idCanvas), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: titulo,
                data: dados,
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

async function gerarGraficos() {
    // temperatura
    const temp = await pegarDadosDia("Temperatura");
    let r1 = mediaPorHora(temp);
    criarGrafico("graficoTemp", "Temperatura (°C)", r1.horas, r1.medias);

    // umidade
    const umid = await pegarDadosDia("Umidade-Ar");
    let r2 = mediaPorHora(umid);
    criarGrafico("graficoUmid", "Umidade (%)", r2.horas, r2.medias);

    // luz
    const luz = await pegarDadosDia("Luminosidade");
    let r3 = mediaPorHora(luz);
    criarGrafico("graficoLuz", "Luminosidade (lx)", r3.horas, r3.medias);

    // MQ135
    const ar = await pegarDadosDia("Qualidade-Ar-MQ135");
    let r4 = mediaPorHora(ar);
    criarGrafico("graficoAr", "Qualidade do Ar", r4.horas, r4.medias);
}

gerarGraficos();
