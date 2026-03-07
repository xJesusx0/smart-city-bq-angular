# Story 3.1: Selección de Ubicación en Mapa (Paso 1 del Stepper)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Operador,
I want seleccionar la ubicación del semáforo haciendo clic en el mapa,
so that la geolocalización sea precisa y visual.

## Acceptance Criteria

1. **Given** que el usuario inicia el Stepper de creación de semáforo
2. **When** hace clic en un punto del mapa Leaflet
3. **Then** aparece un marcador temporal en la posición del clic
4. **And** el sistema dispara automáticamente la consulta al endpoint de intersecciones cercanas
5. **And** se muestra un estado de carga (skeleton) en el panel lateral del stepper.

## Tasks / Subtasks

- [x] Task 1: Crear el componente Standalone básico para el Stepper (Paso 1)
  - [x] Implementar la UI del panel lateral usando Tailwind y Spartan UI.
  - [x] Configurar el componente padre que manejará el estado del Stepper (Signals).
- [x] Task 2: Integrar Leaflet para la selección de ubicación
  - [x] Crear/reutilizar el componente mapa.
  - [x] Escuchar eventos de clic en el mapa.
  - [x] Añadir un marcador temporal (`L.marker`) en las coordenadas del clic.
- [x] Task 3: Integrar consulta de intersecciones cercanas
  - [x] Crear el servicio API (con `openapi-fetch` y TanStack Query) para `getNearbyIntersections`.
  - [x] Mostrar estado de carga (skeleton) en el panel lateral mientras se resuelve la consulta.
  - [x] Almacenar la respuesta provisional en el estado (Signal) para el siguiente paso.

## Dev Notes

- **Architecture:** Uso de Standalone Components. Utilizar Angular Signals para el estado del stepper y las coordenadas (`signal<{lat: number, lng: number} | null>(null)`).
- **Libraries:** Leaflet integrado directamente (sin `@asymmetrik/ngx-leaflet` si no es necesario, o usándolo según el PRD). El PRD especifica `@asymmetrik/ngx-leaflet`, asegúrate de usarlo si ya está en el package.json.
- **State:** Utilizar `@tanstack/angular-query-experimental` para la llamada al backend de intersecciones.
- **Styling:** Spartan UI para los Skeletons y layout del stepper. TailwindCSS v4.
- **Performance:** NFR1 exige latencia < 1-2s. Asegurar que el click en el mapa renderiza el marcador inmediatamente y muestra el cargador sin bloquear el UI thread.

### Project Structure Notes

- `src/app/pages/semaphores/create/`: Ruta sugerida para el feature de creación.
- `src/lib/components/map/`: Componente de mapa compartido.
- `src/lib/api/semaphores.service.ts`: Para endpoints de semáforos/intersecciones.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3]

## Dev Agent Record

### Agent Model Used

Gemini Antigravity

### Debug Log References
- N/A

### Completion Notes List
- Componente `CreateSemaphoreComponent` creado y configurado con un store interactivo inicial (Signal).
- Componente `SemaphoreStep1Component` de standalone desarrollado con panel lateral e integración de OpenStreetMap usando Leaflet.
- Servicio `SemaphoresService` creado con TanStack Angular Query y `openapi-fetch` (`getNearbyIntersections`).
- Pruebas unitarias escritas utilizando Vitest.

### File List
- src/app/pages/semaphores/create/create-semaphore.component.ts (NEW)
- src/app/pages/semaphores/create/step-1.component.ts (NEW)
- src/lib/components/map/location-picker-map.component.ts (NEW)
- src/lib/api/semaphores.service.ts (NEW)
- src/app/app.routes.ts (MODIFIED)
- src/app/pages/semaphores/create/step-1.component.spec.ts (NEW)
- src/app/pages/semaphores/create/create-semaphore.component.spec.ts (NEW)
