# Story 3.2: Validación de Intersección y Snap Geográfico (Paso 2)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Operador,
I want que el sistema valide si mi selección está cerca de una intersección,
so that se asegure la integridad técnica del registro.

## Acceptance Criteria

1. **Given** que el sistema ha recibido la respuesta del API de intersecciones
2. **When** la intersección más cercana está a una distancia <= 20 metros
3. **Then** el marcador en el mapa se "ajusta" (snap) automáticamente a las coordenadas de la intersección
4. **And** el stepper muestra una tarjeta con el Barrio, Ciudad y Distancia detectada
5. **And** se habilita el botón "Confirmar ubicación" para avanzar al siguiente paso.

## Tasks / Subtasks

- [x] Task 1: Componente Paso 2 del Stepper
  - [x] Añadir UI para mostrar Barrio, Ciudad y Distancia detectada (Spartan UI Card).
  - [x] Mostrar botón "Confirmar ubicación" (deshabilitado por defecto hasta validación).
- [x] Task 2: Lógica de Snap y validación de proximidad
  - [x] Calcular/verificar la distancia (<= 20m) con la respuesta del endpoint consultado en 3.1.
  - [x] Actualizar la Signal de coordenadas de la UI con la ubicación de la intersección ("snap").
  - [x] Reflejar el movimiento del marcador en el mapa (`leaflet`).
- [x] Task 3: Manejo de caso de error
  - [x] Mostrar mensaje o Toast si la distancia es > 20m.
  - [x] Requerir nueva selección en caso de error.
  - [x] Habilitar el botón "Confirmar ubicación" si la validación es exitosa.

## Dev Notes

- **Architecture:** Signals para comunicación entre pasos del stepper (e.g., `selectedIntersection`, `isValidated`).
- **Map Interaction:** El "snap" requiere una actualización reactiva. Al mutar (con `.set()`) la coordenada en el componente principal, el mapa debe reflejar el cambio.
- **Styling:** Spartan UI para la información de tarjeta de barrio/ciudad (Card). Tailwind para layout.
- **Handling Data:** El barrio y ciudad vendrán del endpoint de intersecciones o de una reverse geocoding API, asegúrate de utilizar lo proporcionado.

### Project Structure Notes

- Extensión del stepper en `src/app/pages/semaphores/create/` y componentes de mapa en `src/lib/components/map/`.
- Interfaces de tipo estricto en la respuesta del API.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3]
- NFR1: Operaciones y validaciones geográficas con baja latencia.

## Dev Agent Record

### Agent Model Used

Gemini Antigravity

### Debug Log References
- N/A

### Completion Notes List
- Desarrollada interfaz del `SemaphoreStep2Component` usando layouts responsivos (Tailwind) y tarjetas para los detalles (Spartan UI).
- Programada lógica de validación de distancia `distance_meters <= 20`.
- Se usa `GeoJSON` de la intersección (o fallback a original) para realizar el "snap" de Leaflet. 
- Pruebas unitarias de Step 2 completamente operativas garantizando el control del estado y su avance al siguiente step.
- Las dependencias faltantes para la interfaz (importaciones de ui module de spartan) fueron resueltas localmente con estilos nativos y módulos directos de @spartan-ng.

### File List
- src/app/pages/semaphores/create/step-2.component.ts (NEW)
- src/app/pages/semaphores/create/step-2.component.spec.ts (NEW)
- src/app/pages/semaphores/create/create-semaphore.component.ts (MODIFIED)
