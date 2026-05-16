# Documentación Técnica: Penalty Transelo (Holograma Arena)

Este documento detalla la arquitectura, lógica y tecnologías utilizadas en el desarrollo del simulador de penales **Penalty Transelo**.

---

## 1. Arquitectura General
El juego está construido como una aplicación web de alto rendimiento utilizando:
- **Framework:** [Next.js](https://nextjs.org/) (React) para la estructura y el ruteo.
- **Motor 3D:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) (R3F), que permite integrar Three.js de forma declarativa.
- **Física:** [React Three Rapier](https://pmnd.rs/rapier), un motor de física de alto rendimiento para detectar colisiones y trayectorias del balón.
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand) para gestionar marcadores, jugadores y estados del juego sin refrescar la página.

---

## 2. Lógica del Juego (Game Engine)
El corazón del juego reside en `useGameEngine.ts` y `store.ts`.

### Modos de Juego
1.  **Modo Individual:**
    *   Un duelo directo entre el cobrador y el arquero.
    *   Formato: "Mejor de 3" tiros.
    *   El marcador registra los goles anotados vs las atajadas del arquero.
2.  **Modo Equipos (Torneo):**
    *   Permite registrar 3 jugadores diferentes.
    *   Cada jugador tiene **exactamente un intento**.
    *   El sistema rota los turnos automáticamente tras cada tiro.
    *   Al final, muestra un ranking basado en los aciertos de cada uno.

### Estados del Juego
- `START`: Pantalla inicial.
- `REGISTRATION`: Formulario para elegir modo, jugadores y arquero.
- `PLAYING`: La arena 3D está activa y esperando un tiro.
- `GOAL / SAVE`: Estados temporales para mostrar animaciones cinemáticas tras un tiro.
- `TOURNAMENT_RESULTS`: Pantalla final con el podio y ganadores.

---

## 3. Inteligencia Artificial y Rastreo
El juego utiliza la cámara del dispositivo para detectar el movimiento físico de un balón real.

- **Modelo:** [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) sobre **TensorFlow.js**.
- **Funcionamiento:** 
  1. Captura el video de la cámara web.
  2. Identifica objetos (clase `sports ball`).
  3. Calcula la trayectoria analizando el cambio de posición (X, Y) y el tamaño del objeto (Z) entre cuadros.
  4. Si detecta un movimiento rápido hacia adelante, dispara el evento `ball-shoot` con la potencia y dirección calculadas.

---

## 4. Componentes 3D
La escena 3D se divide en:
- **Ball (Balón):** Un cuerpo rígido dinámico que responde a impulsos físicos. Tiene materiales optimizados con brillo (emissive) para una estética gamer.
- **Goalkeeper (Arquero):** Un maniquí cinemático (o modelo animado) que decide una dirección de salto aleatoria cada vez que detecta un tiro.
- **Goal (Arco):** Contiene sensores de colisión invisibles para detectar si el balón entró (Gol) o si salió de la cancha.
- **Stadium (Estadio):** Provee el entorno visual, luces y una malla de neón en el suelo para reforzar la estética premium.

---

## 5. Interfaz y Experiencia de Usuario (UI/UX)
Para lograr un acabado "Premium AAA", se utilizan:
- **Glassmorphism:** Paneles traslúcidos con desenfoque de fondo y bordes de neón.
- **Framer Motion:** Controla todas las animaciones de la interfaz, desde la entrada de los resultados hasta los overlays de gol.
- **Post-procesado:** Aunque se mantiene optimizado para estabilidad, el sistema admite Bloom (brillo) y Vignette para mayor inmersión.

---

## 6. Gestión de Activos (Modelos .GLB)
El sistema está diseñado para ser flexible:
- **Carga Dinámica:** Utiliza `useGLTF` con `Suspense` para cargar modelos 3D externos.
- **Fallbacks:** Si los archivos `.glb` no están presentes o fallan, el juego genera automáticamente geometrías básicas (esferas, cápsulas) con materiales de alta calidad para que la experiencia nunca se detenga.

---

## 7. Flujo de Trabajo para Nuevos Activos
Para cambiar los modelos actuales:
1.  Colocar los archivos en `/public/models/`.
2.  Nombres requeridos: `stadium.glb`, `ball.glb`, `goalkeeper.glb`.
3.  El código los reconocerá automáticamente al ser reactivado.

---
*Documento generado por Antigravity AI para el proyecto Penalty Transelo.*
