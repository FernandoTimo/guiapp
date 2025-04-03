/**
 * @file timelineTypes.ts
 * @description Define tipos e interfaces relacionadas al timeline.
 */

export interface Timeline {
  id: string;
  title: string;
  structure: string[]; // Arreglo de secciones
  usages: string[]; // Arreglo de tags o usos
  // Agrega más campos si tu tabla 'timelines' en Supabase los requiere
}
