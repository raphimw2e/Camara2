const ubidots_token = "BBUS-qySPy2MwouB68dJm08bcFQWnw3RWW9";
const device_label = "Monitor-Ambiental-ESP32";

const pegarDados = async (variavel) => {
    const url = `https://industrial.api.ubidots.com/api/v1.6/devices/${device_label}/${variavel}/values/?page_size=1`

    try {
        const resposta = await fetch(url, {
            headers: { "X-Auth-token": ubidots_token }
        });

        const data = await resposta.json()
        const valor = await data.results[0].value;
        console.log(valor);
        return valor;
    }catch(e){
        console.log("nao deu pra mandar chefe");
    }
}

const formatarFront = async () => {
    const temperatura = await pegarDados("Temperatura");
    const umidadeAr = await pegarDados("Umidade-Ar");
    const luminosidade = await pegarDados("Luminosidade");
    const umidadeSolo = await pegarDados("Umidade-Solo");
    const mq135 = await pegarDados("Qualidade-Ar-MQ135");

    document.getElementById('temp').textContent = temperatura;
    document.getElementById('umid').textContent = umidadeAr;
    document.getElementById('luz').textContent = luminosidade;
    document.getElementById('ar').textContent = mq135;

}

formatarFront();