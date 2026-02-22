import {
  House,
  ChartColumnIncreasing,
  ShieldUser,
  Settings,
  Cctv,
  Dot,
  LucideIconData,
} from 'lucide-angular';

// Mapa de iconos disponibles para módulos
export const MODULE_ICONS: Record<string, LucideIconData> = {
  House,
  ChartColumnIncreasing,
  ShieldUser,
  Settings,
  Cctv,
  Dot, // Icono por defecto
};

// Función para obtener el componente de icono según el nombre
export function getModuleIcon(iconName: string): LucideIconData {
  return MODULE_ICONS[iconName] || MODULE_ICONS['Dot'];
}

// Función para verificar si un icono existe
export function hasModuleIcon(iconName: string): boolean {
  return iconName in MODULE_ICONS;
}
