# Story 3.3: Formulario de Detalles Técnicos del Semáforo (Paso 3)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Operador,
I want completar los datos técnicos con la ubicación ya pre-rellenada,
so that finalice el registro de forma rápida y sin errores manuales.

## Acceptance Criteria

1. **Given** que la ubicación ha sido validada y confirmada en el paso anterior
2. **When** el usuario accede al paso final del stepper
3. **Then** los campos de Barrio y Ciudad aparecen bloqueados (readonly) con la información obtenida automáticamente
4. **And** tras completar los campos obligatorios (Nombre, Modelo, Estado), el botón "Crear Semáforo" guarda el activo
5. **And** el sistema muestra una notificación de éxito y permite crear otro o volver al listado.

## Tasks / Subtasks

- [ ] Task 1: Componente Paso 3 del Stepper (Formulario)
  - [ ] Proveer Reactive Forms para Nombre, Modelo (Select), y Estado (Select).
  - [ ] Rellenar automáticamente Barrio y Ciudad partiendo de las Signals globales del Stepper y marcarlos como deshabilitados/readonly.
- [ ] Task 2: Integración de Guardado en el API
  - [ ] Extender el API service en `src/lib/api/semaphores.service.ts` para creación (`postSemaphore`).
  - [ ] Usar la mutación de TanStack Query para guardar el semáforo y manejar el loading state del botón submit.
- [ ] Task 3: Flujo post-guardado
  - [ ] Mostrar un Toast o alerta de éxito (Spartan UI).
  - [ ] Presentar opciones al usuario: "Crear otro" (limpiar stepper y regresar a paso 1) o "Volver al listado" (Redirigir a listado usando el Router).

## Dev Notes

- **Architecture:** Uso exclusivo de Reactive Forms. Mantener un Stepper Signal Store o componente pare que consolide los datos antes de enviar al backend.
- **API Definition:** Asegurarse de mapear los datos al esquema DTO (Data Transfer Object) proveniente de `openapi-fetch`.
- **Validation:** Tipado estricto para estados y modelos, evitando tipos mágicos en la UI.
- **Styling:** Formularios modernos usando componentes estilo radix / Spartan UI (Labels, Inputs, Selects). Errores de validación de UI con estilo apropiado y accesible.

### Project Structure Notes

- `src/app/pages/semaphores/create/` (Paso 3 del stepper). Utiliza componentes de diseño (input, select, button, toast) alojados en `src/lib/components/ui/` (Spartan).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3]

## Dev Agent Record

### Agent Model Used

Gemini

### Debug Log References

### Completion Notes List

### File List
