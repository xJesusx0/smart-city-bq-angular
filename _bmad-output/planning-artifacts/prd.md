---
stepsCompleted:
  [
    'step-01-init',
    'step-02-discovery',
    'step-02b-vision',
    'step-02c-executive-summary',
    'step-03-success',
    'step-04-journeys',
    'step-05_domain',
    'step-06-innovation-skipped',
    'step-07-project-type',
    'step-08-scoping',
    'step-09-functional',
    'step-10-nonfunctional',
    'step-11-polish',
  ]
inputDocuments: ['_bmad-output/project-context.md']
workflowType: 'prd'
classification:
  projectType: 'Web Application (Dashboard)'
  domain: 'Smart City / IoT / Urban Monitoring'
  complexity: 'Medium-High'
  projectContext: 'brownfield'
vision:
  summary: 'Dashboard de administración centralizada para infraestructura de ciudad inteligente'
  differentiator: 'Configuración rápida sin procesos técnicos complejos + control granular de permisos en un solo lugar'
  coreInsight: 'Antes de automatizar con IA, construir base sólida de administración, seguridad y control de acceso'
---

# Product Requirements Document - smart-city-bq-angular

**Author:** Jesus
**Date:** 2026-02-25

## Executive Summary

**smart-city-bq-angular** es un dashboard de administración centralizada para infraestructura de ciudad inteligente que permite a los administradores gestionar cámaras, semáforos, usuarios y roles en una única plataforma unificada.

**Usuarios objetivo:** Administradores y operadores urbanos que necesitan configurar y controlar la infraestructura inteligente de la ciudad sin conocimientos técnicos especializados.

**Problema central:** La falta de control organizado y seguro sobre la infraestructura urbana - quién accede, quién configura, quién administra - generando riesgos de seguridad y errores humanos.

### Lo que hace especial a este producto

- **Configuración sin fricción:** Administración de cámaras, semáforos, usuarios y roles en pocos pasos, sin procesos técnicos complejos
- **Control centralizado:** Gestión unificada que reemplaza configuraciones manuales dispersas en múltiples sistemas
- **Base para automatización:** Proporciona la foundation sólida de administración y seguridad necesaria antes de implementar IA o monitoreo en tiempo real

### Clasificación del Proyecto

- **Tipo:** Aplicación Web (Dashboard)
- **Dominio:** Smart City / IoT / Monitoreo Urbano
- **Complejidad:** Media-Alta
- **Contexto:** Brownfield (extensión de sistema existente)

## Success Criteria

### User Success

**Sensación clave:** Control y claridad

**Momento "aha!":** El administrador crea usuario → asigna rol → asocia a zona/dispositivo y todo funciona en menos de 5 minutos

**Métricas:**

- Max 3-4 pasos para crear usuario y asignar rol
- Max 4-5 campos esenciales para registrar cámara/semáforo

### Business Success

**Métricas clave:**

- % usuarios activos vs usuarios creados
- Tiempo promedio para configurar un dispositivo
- Reducción de errores de permisos
- Dispositivos correctamente registrados
- Incidentes por mala configuración (debe bajar)

**Timeline:**

- 3 meses: Sistema estable, gestión básica activa
- 6 meses: Fuente oficial de configuración
- 12 meses: Eliminación de procesos manuales, base para módulos inteligentes

### Technical Success

- Seguridad fuerte (roles definidos, control de acceso robusto)
- Auditoría de cambios (quién hizo qué y cuándo)
- Disponibilidad mínima 99%
- Validaciones para evitar errores humanos
- Diseño para cumplimiento: protección de datos, trazabilidad, normas de gobierno digital

## Product Scope

### MVP - Minimum Viable Product

- CRUD de usuarios
- CRUD de roles
- Asignación usuario–rol
- CRUD de cámaras y semáforos
- Relación dispositivo–zona
- Autenticación segura

**Objetivo:** Demostrar control centralizado.

### Growth Features (Post-MVP)

- Auditoría de cambios
- Filtros y búsqueda avanzada
- Gestión por zonas geográficas
- UI clara con validaciones inteligentes
- Logs exportables

### Vision (Future)

- Monitoreo en tiempo real
- Integración con sensores IoT
- Alertas automáticas
- Dashboard estratégico
- Analítica predictiva
- Gestión multi-ciudad

## User Journeys

### 1. Usuario Primario: Administrador de Ciudad

**Contexto:** Sistema nuevo - creando orden desde cero

**Journey:**

1. Inicia sesión como administrador
2. Crea roles claros (Operador, Supervisor, Técnico)
3. Crea usuarios y asigna roles en pocos pasos
4. Registra cámaras y semáforos con validaciones claras
5. Visualiza lista organizada y filtrable

**Resultado:** Siente control, orden y seguridad

**Sensación clave:** "Estoy construyendo el control desde cero"

### 2. Administrador - Edge Case (Recuperación)

**Cuando algo sale mal:**

- Usuario con permisos incorrectos
- Cámara mal asociada a zona
- Eliminación accidental

**Journey de recuperación:**

1. Identifica el problema
2. Puede editar información en cualquier momento
3. Puede desactivar usuarios sin eliminarlos
4. Ve historial básico de cambios
5. Confirmaciones claras antes de acciones críticas

**Sensación:** "Aunque me equivoque, puedo corregirlo rápido"

### 3. Usuario Secundario: Operador

**Quién es:** No configura, solo consulta información

**Journey:**

1. Inicia sesión
2. Visualiza listado/mapa de infraestructura
3. Consulta detalles
4. No puede modificar nada si no tiene permisos

**Necesidades:**

- Interfaz simple
- Información clara
- No ver configuraciones administrativas
- Acceso según su rol

### 4. Usuario API / Integración (Futuro)

**Contexto actual:** No hay consumidores externos

**Visión futura:**

- APIs para apps móviles ciudadanas
- Integración con sistemas de movilidad
- Integración con sensores IoT

**Necesidades:**

- Endpoints claros
- Seguridad con tokens
- Documentación API

### Journey Requirements Summary

| Tipo de Usuario | Necesidad Clave     | Capacidades Requeridas             |
| --------------- | ------------------- | ---------------------------------- |
| Administrador   | Control y seguridad | CRUD usuarios, roles, dispositivos |
| Admin (edge)    | Recuperación rápida | Editar, desactivar, historial      |
| Operador        | Visualización clara | Dashboard de solo lectura          |
| API             | Integración segura  | Endpoints documentados             |

## Domain-Specific Requirements

### Compliance & Regulatorio

**Protección de datos:**

- No se recolectan datos personales
- No se identifican placas ni rostros
- Solo se procesan conteos agregados de vehículos
- Riesgo legal bajo en V1

**Gobierno digital:**

- No aplica cumplimiento formal en esta fase (prototipo académico)
- Documentar arquitectura y decisiones técnicas

**Trazabilidad:**

- Logs básicos de peticiones a la API
- Errores del sistema
- Métricas generadas

**Certificaciones:**

- No se requieren certificaciones en V1

### Restricciones Técnicas

**Seguridad:**

- API protegida con autenticación básica o token
- HTTPS obligatorio
- Logs de errores

**Privacidad:**

- No almacenar video
- Procesar en memoria y guardar solo métricas agregadas

**Rendimiento:**

- Latencia baja (< 1-2 segundos)
- Procesamiento casi en Tiempo Real
- No batch

**Disponibilidad:**

- No requiere alta disponibilidad aún
- Puede tolerar reinicios manuales
- No requiere disaster recovery formal

### Integración

- Solo con backend principal de la aplicación
- Ninguna en V1

### Riesgos y Mitigaciones

| Riesgo               | Mitigación                                   |
| -------------------- | -------------------------------------------- |
| Fallo del servicio   | Logs claros, endpoint de health check        |
| Escalabilidad futura | Diseñar arquitectura modular desde el inicio |

**Resumen estratégico:** Este dominio en V1 es de bajo riesgo regulatorio, baja complejidad de integración, enfocado en validación técnica, centrado en precisión y tiempo real.

## Web Application Specific Requirements

### Project-Type Overview

- **Type:** Single Page Application (SPA)
- **Framework:** Angular 21 with standalone components
- **Target:** Dashboard de administración para infraestructura urbana

### Technical Architecture Considerations

**SPA Architecture:**

- Angular SPA con lazy loading para rutas
- Routing cliente-side para experiencia fluida
- State management con Signals (local) y TanStack Query (server)

**Navegadores:**

- Chrome, Firefox, Safari, Edge (versiones modernas)

**SEO:**

- No crítico para V1 (dashboard autenticado)

**Tiempo Real:**

- No en V1, considerar para Growth

### Accessibility

- WCAG AA mínimo
- Focus management adecuado
- ARIA attributes donde sea necesario

### Implementation Considerations

- Standalone components (no NgModules)
- Control flow nativo de Angular (@if, @for)
- Strict TypeScript mode
- Tailwind CSS para estilos

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP - demostrar control centralizado

**Philosophy:** El mínimo viable debe permitir al administrador crear usuarios, asignar roles y registrar dispositivos funcionando correctamente en pocos pasos.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**

- Administrador crea usuario y asigna rol
- Administrador registra cámara con validación
- Administrador registra semáforo con validación
- Administrador asocia dispositivo a zona
- Operador visualiza infraestructura

**Must-Have Capabilities:**

| Funcionalidad             | Prioridad |
| ------------------------- | --------- |
| Autenticación Azure AD    | Must-have |
| CRUD Usuarios             | Must-have |
| CRUD Roles                | Must-have |
| CRUD Cámaras              | Must-have |
| CRUD Semáforos            | Must-have |
| Asignación Usuario-Rol    | Must-have |
| Relación Dispositivo-Zona | Must-have |

### Post-MVP Features

**Phase 2 (Growth):**

- Auditoría de cambios
- Filtros y búsqueda avanzada
- Gestión por zonas geográficas
- UI con validaciones inteligentes
- Logs exportables

**Phase 3 (Vision):**

- Monitoreo en tiempo real
- Integración con sensores IoT
- Alertas automáticas
- Dashboard estratégico
- Analítica predictiva
- Gestión multi-ciudad

### Risk Mitigation Strategy

**Technical Risks:**

- Complejidad de autenticación Azure AD → Usar librería @azure/msal-angular establecida
- Integración de mapas → Usar Leaflet que ya está configurado

**Market Risks:**

- Validar con usuarios reales temprano
- Iterar basado en feedback

**Resource Risks:**

- Equipo mínimo: 1-2 desarrolladores
- Scope flexible para ajustar si hay menos recursos

## Functional Requirements

### 1. Gestión de Usuarios

- FR1: El Administrador puede crear nuevos usuarios del sistema
- FR2: El Administrador puede editar información de usuarios existentes
- FR3: El Administrador puede desactivar usuarios sin eliminarlos permanentemente
- FR4: El Administrador puede eliminar usuarios del sistema
- FR5: El Sistema puede autenticar usuarios mediante Azure AD

### 2. Gestión de Roles

- FR6: El Administrador puede crear roles con permisos específicos
- FR7: El Administrador puede editar roles existentes
- FR8: El Administrador puede eliminar roles del sistema
- FR9: El Sistema puede definir diferentes niveles de acceso (Operador, Supervisor, Técnico)

### 3. Asignación de Permisos

- FR10: El Administrador puede asignar un rol a un usuario
- FR11: El Administrador puede cambiar el rol de un usuario
- FR12: El Sistema puede validar que un usuario tenga los permisos correctos antes de permitir acciones

### 4. Gestión de Cámaras

- FR13: El Administrador puede registrar nuevas cámaras en el sistema
- FR14: El Administrador puede editar información de cámaras existentes
- FR15: El Administrador puede eliminar cámaras del sistema
- FR16: El Administrador puede asociar cámaras a zonas geográficas

### 5. Gestión de Semáforos

- FR17: El Administrador puede registrar nuevos semáforos en el sistema
- FR18: El Administrador puede editar información de semáforos existentes
- FR19: El Administrador puede eliminar semáforos del sistema
- FR20: El Administrador puede asociar semáforos a zonas geográficas

### 6. Gestión de Zonas

- FR21: El Administrador puede crear zonas geográficas
- FR22: El Administrador puede editar zonas existentes
- FR23: El Administrador puede eliminar zonas del sistema
- FR24: El Sistema puede mostrar dispositivos por zona

### 7. Visualización de Infraestructura

- FR25: El Operador puede visualizar listado de todas las cámaras
- FR26: El Operador puede visualizar listado de todos los semáforos
- FR27: El Operador puede visualizar dispositivos en un mapa
- FR28: El Operador puede consultar detalles de dispositivos específicos

### 8. Autenticación y Seguridad

- FR29: El Sistema puede limitar el acceso según el rol del usuario
- FR30: El Sistema puede mostrar solo las opciones permitidas para cada rol

## Non-Functional Requirements

### Performance

- Latencia de respuesta < 1-2 segundos para operaciones típicas
- Interfaz responsiva durante carga de datos

### Security

- API protegida con autenticación Azure AD
- HTTPS obligatorio
- Control de acceso basado en roles (RBAC)
- No almacenar datos personales ni video

### Scalability

- Diseño modular para permitir crecimiento
- Soporte para múltiples zonas geográficas (futuro)
- No requiere alta disponibilidad en V1

### Accessibility

- WCAG AA mínimo
- Focus management adecuado
- ARIA attributes donde sea necesario

### Integration

- Backend API con openapi-fetch
- Tipos generados desde OpenAPI
- Ninguna integración externa en V1
