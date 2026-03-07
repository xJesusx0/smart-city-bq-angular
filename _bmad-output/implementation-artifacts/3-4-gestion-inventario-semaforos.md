# Story 3.4: Gestión del Inventario de Semáforos (Edición/Eliminación)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Administrador,
I want editar o eliminar semáforos existentes,
so that el inventario urbano se mantenga actualizado y veraz.

## Acceptance Criteria

1. **Given** que un administrador visualiza el listado o detalles de un semáforo
2. **When** presiona "Editar"
3. **Then** se muestra un formulario pre-rellenado con la información existente del semáforo
4. **And** tras efectuar cambios y "Guardar", los datos se actualizan y el sistema notifica el éxito.
5. **Given** que el administrador visualiza el listado o detalles de un semáforo
6. **When** presiona "Eliminar"
7. **Then** se solicita confirmación de eliminación
8. **And** si la eliminación se confirma, el semáforo desaparece de los listados activos y mapa, notificando el éxito.

## Tasks / Subtasks

- [ ] Task 1: Componente de Edición de Semáforo
  - [ ] Crear el componente/vista para editar el semáforo (usando Reactive Forms).
  - [ ] Obtener datos del semáforo por ID usando TanStack Query e hidratar el formulario.
  - [ ] Añadir métodos y UI para someter los cambios (mutación con openapi-fetch `putSemaphore`).
- [ ] Task 2: Implementación de la función Eliminar
  - [ ] Añadir UI para eliminación (Botón Destructive/Danger).
  - [ ] Implementar un diálogo de confirmación (Spartan Dialog/Alert Dialog).
  - [ ] Efectuar la llamada DELETE en el API y manejar caché/invalidación en TanStack Query.
- [ ] Task 3: Invalidación del Cache
  - [ ] Una vez insertado, editado o eliminado un semáforo, invalidar las query keys de la lista y del mapa mediante queryClient para que `FR23` las refresque.

## Dev Notes

- **Architecture:** Uso de TanStack Query para recuperar y mutar (optimistic UI opcional, invalidación mandatoria) el estado en servidor (`invalidateQueries`).
- **Components:** Crear página `src/app/pages/semaphores/edit/[id]`.
- **Styling:** Modales de eliminación con estética destructiva (rojo) predeterminada por Tailwind/Spartan y WCAG (aria-labels).
- **Access Control:** `FR12` indica validación de permisos. Ver si hay guards o simplemente la opción no se muestra a quien no tenga rol de administrador. (Aplicar `*if` o equivalente al rol si es parte de roles en Signals).

### Project Structure Notes

- Views en `src/app/pages/semaphores/` (`edit.component.ts` o `details.component.ts`).
- Servicios API centralizados.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3]
- NFR2: Seguridad robusta (RBAC / Auth Guards a nivel ruta o botón).

## Dev Agent Record

### Agent Model Used

Gemini

### Debug Log References

### Completion Notes List

### File List
