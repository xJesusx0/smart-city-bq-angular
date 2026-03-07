---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/project-context.md', '_bmad-output/planning-artifacts/ux-design-specification.md']
---

# smart-city-bq-angular - Epic Breakdown

## Overview

Este documento proporciona el desglose completo de épicas e historias para smart-city-bq-angular, descomponiendo los requisitos del PRD, la especificación de diseño de UX (específicamente la nueva vista de semáforos) y los requisitos tecnológicos establecidos.

## Requirements Inventory

### Functional Requirements

- FR1: El Administrador puede crear nuevos usuarios del sistema.
- FR2: El Administrador puede editar información de usuarios existentes.
- FR3: El Administrador puede desactivar usuarios sin eliminarlos permanentemente.
- FR4: El Administrador puede eliminar usuarios del sistema.
- FR5: El Sistema puede autenticar usuarios mediante Azure AD (@azure/msal-angular).
- FR6: El Administrador puede crear roles con permisos específicos.
- FR7: El Administrador puede editar roles existentes.
- FR8: El Administrador puede eliminar roles del sistema.
- FR9: El Sistema puede definir niveles de acceso (Operador, Supervisor, Técnico).
- FR10: El Administrador puede asignar un rol a un usuario.
- FR11: El Administrador puede cambiar el rol de un usuario.
- FR12: El Sistema valida los permisos antes de permitir acciones.
- FR13: El Administrador puede registrar nuevas cámaras.
- FR14: El Administrador puede editar cámaras existentes.
- FR15: El Administrador puede eliminar cámaras.
- FR16: El Administrador puede asociar cámaras a zonas geográficas.
- FR17: Registro de semáforos mediante flujo guiado (Stepper) de 3 pasos (Ubicación, Validación, Detalles).
- FR18: Validación de intersección cercana (< 20m) tras selección en el mapa.
- FR19: Auto-relleno de datos de ubicación (Barrio, Ciudad) basado en coordenadas.
- FR20: El Administrador puede editar información de semáforos existentes.
- FR21: El Administrador puede eliminar semáforos del sistema.
- FR22: El Administrador puede crear, editar y eliminar zonas geográficas.
- FR23: Visualización de dispositivos en listado y mapa (Leaflet).
- FR24: Consulta de detalles técnicos de dispositivos específicos.

### NonFunctional Requirements

- NFR1: Latencia de respuesta < 1-2 segundos para operaciones y validaciones geográficas.
- NFR2: Seguridad robusta mediante Azure AD y RBAC.
- NFR3: Interfaz responsiva (Sidebar Hub para Desktop, Adaptive para Mobile).
- NFR4: Accesibilidad WCAG AA (Focus management, ARIA labels, contrastes).
- NFR5: Diseño modular basado en Standalone Components y Angular Signals.
- NFR6: Tipado estricto con TypeScript 5.9.

### Additional Requirements

- **Tecnología:** Angular 21, Tailwind CSS v4, Spartan UI (Hlm/Brain).
- **Mapas:** Leaflet (@asymmetrik/ngx-leaflet) con "Geographic Snapping".
- **Gestión de Estado:** TanStack Query para servidor y Signals para UI local.
- **Formularios:** Uso obligatorio de Reactive Forms.
- **Testing:** Unit tests con Vitest.

### FR Coverage Map

FR1: Epic 1 - Registro de nuevos usuarios
FR2: Epic 2 - Edición de usuarios
FR3: Epic 2 - Desactivación de usuarios
FR4: Epic 2 - Eliminación de usuarios
FR5: Epic 1 - Autenticación Azure AD
FR6: Epic 2 - Creación de roles
FR7: Epic 2 - Edición de roles
FR8: Epic 2 - Eliminación de roles
FR9: Epic 1 - Definición de niveles de acceso
FR10: Epic 2 - Asignación de rol a usuario
FR11: Epic 2 - Cambio de rol de usuario
FR12: Epic 1 - Validación de permisos
FR13: Epic 4 - Registro de cámaras
FR14: Epic 4 - Edición de cámaras
FR15: Epic 4 - Eliminación de cámaras
FR16: Epic 4 - Asociación cámara-zona
FR17: Epic 3 - Registro semáforo asistido (Stepper)
FR18: Epic 3 - Validación de intersección cercana
FR19: Epic 3 - Auto-relleno datos ubicación
FR20: Epic 3 - Edición de semáforos
FR21: Epic 3 - Eliminación de semáforos
FR22: Epic 5 - Gestión de zonas geográficas
FR23: Epic 5 - Visualización en listado y mapa
FR24: Epic 5 - Consulta de detalles técnicos

## Epic List

### Epic 1: Acceso Seguro y Control de Identidad
El sistema garantiza que solo el personal autorizado pueda entrar y que cada acción sea trazable.
**FRs covered:** FR1, FR5, FR9, FR12, FR24

### Epic 2: Gestión de Usuarios y Gobernanza de Roles
Los administradores pueden organizar el equipo de trabajo y definir quién hace qué.
**FRs covered:** FR2, FR3, FR4, FR6, FR7, FR8, FR10, FR11

### Epic 3: Registro Inteligente de Infraestructura (Semáforos)
Registro de semáforos asistido por mapa y validación técnica basándose en la experiencia diseñada.
**FRs covered:** FR17, FR18, FR19, FR20, FR21

### Epic 4: Administración de Dispositivos de Monitoreo (Cámaras)
Gestión completa del inventario de cámaras y su relación con el entorno urbano.
**FRs covered:** FR13, FR14, FR15, FR16

## Epic 1: Acceso Seguro y Control de Identidad

El sistema garantiza que solo el personal autorizado pueda entrar y que cada acción sea trazable.

### Story 1.1: Configuración de Autenticación con Azure AD

As a Administrador,
I want que el sistema use Azure AD para la autenticación,
So that el acceso sea seguro y cumpla con las políticas corporativas.

**Acceptance Criteria:**

**Given** que el usuario accede a la URL de la aplicación
**When** intenta entrar
**Then** el sistema le redirige al login de Azure AD mediante @azure/msal-angular
**And** tras un login exitoso, el sistema recibe el token de acceso y redirige al dashboard.

### Story 1.2: Definición de Niveles de Acceso (RBAC)

As a Administrador,
I want que el sistema identifique el rol del usuario desde el token,
So that se puedan limitar las funciones según el perfil (Operador, Supervisor o Técnico).

**Acceptance Criteria:**

**Given** que un usuario ha iniciado sesión
**When** el sistema analiza el token recibido de Azure AD
**Then** se asigna el nivel de acceso correspondiente basándose en los claims del token
**And** las funcionalidades de la UI se habilitan o deshabilitan dinámicamente según el rol.

### Story 1.3: Validación de Permisos en Rutas

As a Operador,
I want que el sistema me impida acceder a rutas administrativas,
So that se eviten cambios accidentales por personal no autorizado.

## Epic 2: Gestión de Usuarios y Gobernanza de Roles

Los administradores pueden organizar el equipo de trabajo y definir quién hace qué.

### Story 2.1: Gestión de Roles Personalizados

As a Administrador,
I want crear y editar roles con permisos específicos,
So that el sistema se adapte a la estructura jerárquica de la organización.

**Acceptance Criteria:**

**Given** que el administrador accede a la sección de Gestión de Roles
**When** completa el formulario con el nombre del rol y selecciona los permisos (ej. "Solo Lectura", "Edición Semáforos")
**Then** el sistema guarda el nuevo rol en la base de datos
**And** el nuevo rol aparece disponible en el listado de asignación de usuarios.

### Story 2.2: Administración de Cuentas de Usuario

As a Administrador,
I want invitar a nuevos usuarios y asignarles un rol,
So that puedan empezar a operar el sistema con los permisos correctos.

**Acceptance Criteria:**

**Given** que el administrador está en la vista de Usuarios
**When** introduce el correo corporativo del nuevo usuario y selecciona un rol existente
**Then** el sistema registra al usuario y le permite el acceso basándose en su identidad de Azure AD
**And** el usuario solo visualiza los módulos permitidos por su rol.

### Story 2.3: Control de Estado de Usuario (Desactivación)

As a Administrador,
I want poder desactivar usuarios sin eliminarlos permanentemente,
So that se mantenga el historial de acciones pero se impida el acceso actual.

## Epic 3: Registro Inteligente de Infraestructura (Semáforos)

Registro de semáforos asistido por mapa y validación técnica basándose en la experiencia diseñada.

### Story 3.1: Selección de Ubicación en Mapa (Paso 1 del Stepper)

As a Operador,
I want seleccionar la ubicación del semáforo haciendo clic en el mapa,
So that la geolocalización sea precisa y visual.

**Acceptance Criteria:**

**Given** que el usuario inicia el Stepper de creación de semáforo
**When** hace clic en un punto del mapa Leaflet
**Then** aparece un marcador temporal en la posición del clic
**And** el sistema dispara automáticamente la consulta al endpoint de intersecciones cercanas
**And** se muestra un estado de carga (skeleton) en el panel lateral del stepper.

### Story 3.2: Validación de Intersección y Snap Geográfico (Paso 2)

As a Operador,
I want que el sistema valide si mi selección está cerca de una intersección,
So that se asegure la integridad técnica del registro.

**Acceptance Criteria:**

**Given** que el sistema ha recibido la respuesta del API de intersecciones
**When** la intersección más cercana está a una distancia <= 20 metros
**Then** el marcador en el mapa se "ajusta" (snap) automáticamente a las coordenadas de la intersección
**And** el stepper muestra una tarjeta con el Barrio, Ciudad y Distancia detectada
**And** se habilita el botón "Confirmar ubicación" para avanzar al siguiente paso.

### Story 3.3: Formulario de Detalles Técnicos del Semáforo (Paso 3)

As a Operador,
I want completar los datos técnicos con la ubicación ya pre-rellenada,
So that finalice el registro de forma rápida y sin errores manuales.

**Acceptance Criteria:**

**Given** que la ubicación ha sido validada y confirmada en el paso anterior
**When** el usuario accede al paso final del stepper
**Then** los campos de Barrio y Ciudad aparecen bloqueados (readonly) con la información obtenida automáticamente
**And** tras completar los campos obligatorios (Nombre, Modelo, Estado), el botón "Crear Semáforo" guarda el activo
**And** el sistema muestra una notificación de éxito y permite crear otro o volver al listado.

### Story 3.4: Gestión del Inventario de Semáforos (Edición/Eliminación)

As a Administrador,
I want editar o eliminar semáforos existentes,
So that el inventario urbano se mantenga actualizado y veraz.

## Epic 4: Administración de Dispositivos de Monitoreo (Cámaras)

Gestión completa del inventario de cámaras y su relación con el entorno urbano.

### Story 4.1: Registro de Nuevas Cámaras

As a Administrador,
I want registrar nuevas cámaras en el sistema,
So that se integren en la red de monitoreo de la ciudad.

**Acceptance Criteria:**

**Given** que el administrador accede a la sección de Gestión de Cámaras
**When** completa el formulario con los datos requeridos (Nombre, IP, Modelo, Coordenadas)
**Then** el sistema valida los campos y guarda el nuevo dispositivo
**And** la cámara aparece inmediatamente en el listado general de dispositivos.

### Story 4.2: Asociación de Cámara a Zona Geográfica

As a Administrador,
I want asociar cada cámara a una zona específica,
So that el monitoreo esté organizado por barrios o distritos.

**Acceptance Criteria:**

**Given** una cámara registrada en el sistema
**When** el administrador edita su información y selecciona una zona geográfica del listado
**Then** el sistema guarda la relación dispositivo-zona
**And** al filtrar por esa zona, la cámara aparece correctamente en los resultados.

### Story 4.3: Mantenimiento del Inventario de Cámaras (Edición/Eliminación)

As a Administrador,
I want poder actualizar la información de las cámaras o darlas de baja,
So that el inventario refleje fielmente la infraestructura física.

## Epic 5: Centro de Control y Visualización Urbana

Unificación de toda la infraestructura en una vista operativa (Lista y Mapa).

### Story 5.1: Dashboard Operativo (Mapa Unificado)

As a Operador,
I want ver todos los dispositivos (semáforos y cámaras) en un solo mapa,
So that tenga una visión global del estado de la ciudad en tiempo real.

**Acceptance Criteria:**

**Given** que el operador accede al Dashboard principal
**When** se inicializa el componente de mapa Leaflet
**Then** el sistema carga y posiciona iconos diferenciados para semáforos y cámaras
**And** al hacer hover sobre un dispositivo, se muestra su nombre y estado básico.

### Story 5.2: Gestión de Zonas Geográficas

As a Administrador,
I want crear y delimitar zonas geográficas urbanas,
So that pueda agrupar los dispositivos por barrios o sectores operativos.

**Acceptance Criteria:**

**Given** el módulo de Configuración de Zonas
**When** el administrador define una nueva zona (Nombre y descripción)
**Then** el sistema guarda la zona en la base de datos
**And** la nueva zona aparece disponible en los formularios de registro de cámaras y semáforos.

### Story 5.3: Consulta de Detalles de Infraestructura

As a Operador,
I want clicar en un dispositivo del mapa para ver sus detalles técnicos,
So that consulte información específica sin perder el contexto geográfico.

**Acceptance Criteria:**

**Given** que el operador está interactuando con el mapa unificado
**When** hace clic en un marcador de cualquier dispositivo (cámara o semáforo)
**Then** se despliega un panel lateral (Sidebar Hub) con la ficha técnica completa
**And** el panel permite navegar a la edición si el usuario tiene los permisos adecuados.
