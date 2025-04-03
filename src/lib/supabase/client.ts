/**
 * @file client.ts
 * @description Configura y exporta la instancia de Supabase para ser reutilizada
 *   en todo el proyecto.
 */

import { createClient } from "@supabase/supabase-js";

// Estas variables pueden venir de tu .env.local
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Instancia principal de Supabase, creada con la URL y la KEY.
 * @remarks
 *   - Se recomienda almacenar las credenciales en variables de entorno.
 *   - Evitar exponer llaves sensibles en el frontend (usar RLS y Policies).
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
