# 🎬 GUÍA: DESCARGAR E INTEGRAR ARQUERO PROFESIONAL

## 🔗 MODELO

**Nombre**: Goalkeeper Stylized - Rig and Animation
**Autor**: P-Vi.Art
**Licencia**: CC Attribution (GRATIS)
**URL**: https://sketchfab.com/3d-models/goalkeeper-stylized-rig-and-animation-7de86f9c36f84152a777f27a73646ada

---

## 📥 PASO 1: DESCARGAR DESDE SKETCHFAB

### Opción A: Descargar directo (Recomendado)

1. **Ir a la página del modelo**: 
   https://sketchfab.com/3d-models/goalkeeper-stylized-rig-and-animation-7de86f9c36f84152a777f27a73646ada

2. **Buscar botón "Download"** (esquina inferior derecha)

3. **Seleccionar formato**: 
   - Preferencia 1: **glTF (.glb)** ← Mejor para React Three Fiber
   - Preferencia 2: FBX (convertir después)
   - Preferencia 3: OBJ

4. **Descargar el archivo**

### Opción B: Sin cuenta (Descarga rápida)

Si te pide crear cuenta, también puedes:
1. Click derecho en "Download"
2. "Guardar enlace como..."

---

## 📂 PASO 2: COPIAR A TU PROYECTO

```bash
# Una vez descargado, copiar a:
cp goalkeeper_stylized.glb public/models/

# Estructura esperada:
# public/
# ├── models/
# │   ├── goalkeeper_stylized.glb  ← AQUÍ
# │   └── (otros modelos)
```

---

## 🔄 PASO 3: CONVERTIR SI ES NECESARIO

Si descargaste en FBX (no GLB):

```bash
# Opción A: Usar Blender (gratis)
# 1. Abre Blender
# 2. File → Import → Import FBX
# 3. Selecciona el archivo
# 4. File → Export → glTF 2.0 (.glb/.gltf)
# 5. Selecciona "glTF Binary (.glb)"

# Opción B: Usar online converter
# https://products.aspose.app/3d/conversion/fbx-to-glb
# (Sube el FBX, descarga GLB)
```

---

## ⚛️ PASO 4: COMPONENTE REACT

Crear archivo: `components/GoalkeeperProfessional.tsx`

```typescript
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface GoalkeeperProfessionalProps {
  position?: [number, number, number];
  scale?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  ballPosition?: [number, number, number];
  onSave?: () => void;
  onGoal?: () => void;
}

export const GoalkeeperProfessional: React.FC<GoalkeeperProfessionalProps> = ({
  position = [0, 0, 5],
  scale = 1,
  difficulty = 'medium',
  ballPosition,
  onSave,
  onGoal,
}) => {
  const group = useRef<THREE.Group>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Cargar modelo CON animaciones incluidas
  const { scene, animations } = useGLTF('/models/goalkeeper_stylized.glb');
  const clonedScene = scene.clone();

  // Usar el sistema de animaciones del modelo
  const { actions } = useAnimations(animations, clonedScene);

  // Detectar animaciones disponibles
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      console.log('✅ Animaciones disponibles:', Object.keys(actions));
    }
  }, [actions]);

  // Reaccionar a balón
  useEffect(() => {
    if (!ballPosition || isAnimating || !actions) return;

    const ballX = Array.isArray(ballPosition) ? ballPosition[0] : ballPosition.x;
    
    // Decidir si ataja o no
    const shouldSave = Math.random() < (
      difficulty === 'easy' ? 0.7 :
      difficulty === 'hard' ? 0.3 :
      0.5
    );

    if (shouldSave) {
      // Reproducir animación de salto
      const diveAnimation = ballX < 0 ? 'dive_left' : 'dive_right';
      
      // Buscar en las animaciones disponibles
      if (actions[diveAnimation]) {
        setIsAnimating(true);
        actions[diveAnimation].reset();
        actions[diveAnimation].play();
        
        setTimeout(() => {
          // Reproducir celebración
          if (actions['celebrate']) {
            actions['celebrate'].reset();
            actions['celebrate'].play();
          }
          onSave?.();
          setIsAnimating(false);
        }, 800);
      }
    } else {
      // Reproducir reacción a gol
      if (actions['goal']) {
        setIsAnimating(true);
        actions['goal'].reset();
        actions['goal'].play();
        
        setTimeout(() => {
          setIsAnimating(false);
          onGoal?.();
        }, 1200);
      }
    }
  }, [ballPosition, difficulty, actions, isAnimating, onSave, onGoal]);

  // Animación de respiración en idle
  useFrame((state) => {
    if (group.current && !isAnimating && actions) {
      const time = state.clock.getElapsedTime();
      group.current.position.y = position[1] + Math.sin(time * 1.5) * 0.03;
    }
  });

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
    >
      <primitive object={clonedScene} />
    </group>
  );
};

export default GoalkeeperProfessional;
```

---

## 🎮 PASO 5: USAR EN TU CANVAS

```jsx
import { Canvas } from '@react-three/fiber';
import GoalkeeperProfessional from '@/components/GoalkeeperProfessional';

export default function Arena() {
  const [ballPos, setBallPos] = useState<[number, number, number]>([0, 1, -5]);

  return (
    <Canvas camera={{ position: [0, 2, 8] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1} castShadow />
      
      {/* El arquero */}
      <GoalkeeperProfessional 
        position={[0, 0, -14]}
        difficulty="medium"
        ballPosition={ballPos}
        onSave={() => console.log('✅ ¡ATAJADA!')}
        onGoal={() => console.log('⚽ ¡GOL!')}
      />
    </Canvas>
  );
}
```

---

## 🔧 PASO 6: VERIFICAR ANIMACIONES

Una vez cargado, abre la consola (F12) y deberías ver:

```
✅ Animaciones disponibles: [
  'idle',
  'run',
  'jump',
  'dive',
  'celebrate',
  'goal',
  'walk',
  ... (según el modelo)
]
```

Toma nota de los nombres exactos de las animaciones para ajustar el código.

---

## 🎯 PERSONALIZACIÓN

### Cambiar animación de salto

En el componente, busca:
```typescript
const diveAnimation = ballX < 0 ? 'dive_left' : 'dive_right';
```

Y reemplaza con los nombres reales de tus animaciones:
```typescript
const diveAnimation = ballX < 0 ? 'jump_left' : 'jump_right';
// O lo que sea que el modelo tenga
```

### Cambiar duración de transición

```typescript
setTimeout(() => {
  // 800ms es el tiempo de espera
  // Ajusta según la duración real de la animación
}, 800);
```

---

## ✅ CHECKLIST

- [ ] Descargué el modelo desde Sketchfab
- [ ] Guardé el archivo como `goalkeeper_stylized.glb`
- [ ] Copié a `public/models/`
- [ ] Creé el componente `GoalkeeperProfessional.tsx`
- [ ] Importé en mi Canvas
- [ ] Verifiqué que aparece el arquero
- [ ] Verifiqué las animaciones en consola
- [ ] Ajusté los nombres de animaciones
- [ ] ¡Probé que funciona!

---

## 🆘 TROUBLESHOOTING

### El modelo no aparece
```
✅ Verifica: public/models/goalkeeper_stylized.glb existe
✅ Verifica: Ruta correcta en useGLTF
✅ Revisa consola para errores
```

### No hay animaciones
```
✅ Verifica: El modelo descargado incluye animaciones
✅ Revisa consola: Object.keys(actions)
✅ Algunos modelos guardan animaciones de forma diferente
```

### Las animaciones no se reproducen
```
✅ Verifica: Nombres exactos de animaciones en consola
✅ Ajusta: 'dive_left' por el nombre real del modelo
✅ Comprueba: actions[nombreAnimacion] no es undefined
```

---

## 🎬 RESULTADO FINAL

Cuando todo esté correcto, verás:
- ✅ Arquero renderizado en pantalla
- ✅ Parece un humano realista
- ✅ Se mueve suavemente
- ✅ Salta cuando detecta balón
- ✅ Celebra si atajas
- ✅ Reacciona si es gol
- ✅ Todo automático y profesional

---

## 📞 AYUDA

Si tienes problemas:
1. Verifica que el GLB está en `public/models/`
2. Comprueba los nombres de animaciones en consola
3. Ajusta el código con los nombres reales
4. Si aún no funciona, comparte el error de consola

---

**¡Eso es todo! En 30 minutos tendrás un arquero profesional y animado en tu proyecto.** 🚀

Sigue este checklist paso a paso y estarás listo.

¿Necesitas ayuda en algún paso?
