class ResultScreen extends Phaser.Scene {
    constructor() {
        super('ResultScreen');
    }

    preload() {
        // Cargar fondos para victoria y empate dependiendo del gato
        this.load.image('fondo_victoria_gatoA', 'assets/victoria_derrota_empate/victoria_derrota_1.png');
        this.load.image('fondo_victoria_gatoB', 'assets/victoria_derrota_empate/victoria_derrota_2.png');

        // Fondo de empate
        this.load.image('fondo_empate', 'assets/victoria_derrota_empate/empate.png');

        // Botones
        this.load.image('Boton_continuar_normal', 'assets/Interfaces montadas/continuar/normal.png');
        this.load.image('Boton_continuar_encima', 'assets/Interfaces montadas/continuar/seleccionado.png');
        this.load.image('Boton_continuar_pulsado', 'assets/Interfaces montadas/continuar/pulsado.png');

        this.load.audio("sonidoVictoria", "assets/musica/Victoria.mp3");
    }

    create() {
        // Variables globales de puntuación
        const puntuacionA = this.registry.get('puntuacionA') || 0;
        const puntuacionB = this.registry.get('puntuacionB') || 0;
        const jugadorA = gatoA.username; 
        const jugadorB = gatoB.username;    

        let ganador='';
        let perdedor='';

        const music = this.sound.add("sonidoVictoria", { loop: false, volume: 0.3 });
        music.play();
        

        let fondoKey = '';
        let mensaje = '';

        // Determinar el resultado y el fondo correspondiente
        if (puntosA > puntosB) {
            fondoKey = 'fondo_victoria_gatoA';  // Gato A gana
            mensaje = '¡Gato A gana!';
            ganador=jugadorA;
            perdedor=jugadorB;
        } else if (puntosA < puntosB) {
            fondoKey = 'fondo_victoria_gatoB';  // Gato B gana
            mensaje = '¡Gato B gana!';
            ganador=jugadorB;
            perdedor=jugadorA;
        } else {
            fondoKey = 'fondo_empate';  // Empate
            mensaje = '¡Es un empate!';
            ganador='empate';
            perdedor='empate';
        }

        if(ganador!=='empate'){
            actualizarEstadoJugador(ganador, 'ganador');
            actualizarEstadoJugador(perdedor, 'perdedor');
        } else {
            console.log('Es un empate, no se actualizan los estados de ganador/perdedor.');
        }
        

    
/*
        async function obtenerPuntuacion(usuario) {     //Se obtiene la puntuacion que el servidor tiene guardada del usuario
            const response = await fetch(`http://127.0.0.1:8080/${usuario}`);
            if(!response.ok){
                throw new Error('No se ha podido obtener el usuario');
            }
            const user = await response.json();
            return user.score;  //Se devuelve la puntuacion
        }
*/
        async function actualizarPuntuacion(username, nuevaPuntuacion) {
            const response = await fetch(`http://127.0.0.1:8080/api/usuarios/${username}`, {
                method: 'PUT', // Se quiere actualizar la puntuacion del usuario
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: nuevaPuntuacion }) 
            });
            if (!response.ok) {
                throw new Error('No se ha podido actualizar la puntuación');
            }
            const actualizacion = await response.json();
            console.log('Puntuación actualizada:', actualizacion);
        }


        async function actualizarEstadoJugador(username, estado) {
            const url = `http://127.0.0.1:8080/api/usuarios/${username}`;

            const data = { resultado: estado }; // Clave "resultado" con valor "ganador" o "perdedor"

            try {
                const response = await fetch(url, {
                    method: 'POST', // Utilizamos PUT para actualizar al jugador
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error(`No se pudo actualizar el estado del jugador ${username}`);
                }

                const resultado = await response.json();
                console.log(`Estado actualizado para ${username}:`, resultado);
            } catch (error) {
                console.error(`Error al actualizar estado para ${username}:`, error);
            }
        }

        async function actualizarPartida() {
            const response = await fetch(`http://127.0.0.1:8080/api/game`, {
                method: 'PUT', // Se quiere actualizar la puntuacion del usuario
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({  }) 
            });
            if (!response.ok) {
                throw new Error('No se ha podido actualizar la partida');
            }
            const actualizacion = await response.json();
            console.log('Partida actualizada:', actualizacion);

        }



        

        
        // Asignar fondo correspondiente
        this.add.image(370, 200, fondoKey).setOrigin(0.29).setScale(0.75);

        // Mostrar mensaje
        this.add.text(650, 50, mensaje, {
            font: '45px Arial',
            color: '#000000',
        }).setOrigin(0.5);

        // Mostrar puntuaciones
        this.add.text(200, 100, `Gato A: ${puntosA}\nGato B: ${puntosB}`, {
            font: '45px Arial',
            color: '#000000',
            align: 'center',
        }).setOrigin(0.5);

        // Botón para volver al inicio del juego
        // Botón de continuar
        const nextButton = this.add.image(1200, 700, 'Boton_continuar_normal').setOrigin(1, 1).setInteractive().setScale(0.7)

        nextButton.on('pointerover', () => {
            nextButton.setTexture('Boton_continuar_encima');
        });

        nextButton.on('pointerout', () => {
            nextButton.setTexture('Boton_continuar_normal');
        });

        nextButton.on('pointerdown', () => {
            nextButton.setTexture('Boton_continuar_pulsado');
        });

        nextButton.on('pointerup', () => {
            nextButton.setTexture('Boton_continuar_normal');
            this.scene.start('MenuPrincipal'); // Vuelve al menú principal
        });
    }
}