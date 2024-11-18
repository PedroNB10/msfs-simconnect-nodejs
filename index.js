import { MSFS_API } from 'msfs-simconnect-api-wrapper';

async function getAircraftData() {
    const api = new MSFS_API();

    // Função para buscar dados continuamente
    const updateData = async () => {
        try {
            // Obtenha os dados da aeronave
            const data = await api.get(
                'PLANE ALTITUDE',
                'PLANE LATITUDE',
                'PLANE LONGITUDE',
                'AIRSPEED TRUE',
                'PLANE HEADING DEGREES MAGNETIC',
                'VERTICAL SPEED'
            );

            // Extrai os valores
            const altitude = data['PLANE_ALTITUDE'];
            const latitude = data['PLANE_LATITUDE'];
            const longitude = data['PLANE_LONGITUDE'];
            const speed = data['AIRSPEED_TRUE'];
            const heading = data['PLANE_HEADING_DEGREES_MAGNETIC'];
            const vspeed = data['VERTICAL_SPEED'];

            // Exibe os valores no console
            console.log(`Altitude: ${altitude} pés`);
            console.log(`Latitude: ${latitude * (180 / Math.PI)} graus`); // converte de radianos para graus
            console.log(`Longitude: ${longitude * (180 / Math.PI)} graus`); // converte de radianos para graus
            console.log(`Velocidade: ${speed} nós`);
            console.log(`Rumo: ${heading * (180 / Math.PI)} graus`); // converte de radianos para graus
            console.log(`Velocidade Vertical: ${vspeed * 60} pés/min\n\n`); // converte de pés/seg para pés/min

            // Chama a função novamente após 1 segundo
            setTimeout(updateData, 1000);
        } catch (error) {
            console.error('Erro ao obter dados:', error);
            console.log('Tentando reconectar em 5 segundos...');
            setTimeout(connectAndUpdate, 5000);
        }
    };

    // Função para conectar e iniciar a atualização contínua
    const connectAndUpdate = () => {
        api.connect({
            retries: Infinity,
            retryInterval: 5,
            onConnect: async () => {
                console.log('Conectado ao Microsoft Flight Simulator!');
                updateData();
            },
            onRetry: (retriesLeft, interval) => {
                console.log(`Tentativa de conexão falhou. Tentando novamente em ${interval} segundos.`);
            },
            onException: (exception) => {
                console.error('Exceção:', exception);
                console.log('Tentando reconectar em 5 segundos...');
                setTimeout(connectAndUpdate, 5000);
            },
            onabort: () => {
                console.log('Conexão encerrada.');
            }
        });
    };

    // Executa a função de conexão e atualização
    connectAndUpdate();
}

// Executa a função principal
getAircraftData();
