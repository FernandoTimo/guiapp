"use client";
import { useState, useEffect } from "react";

/**
 * useMediaQuery
 *
 * Hook para evaluar una consulta de medios (media query) y devolver si se cumple o no.
 *
 * @param query - La media query a evaluar (por ejemplo, "(max-width: 768px)").
 * @returns boolean - true si la query se cumple, false en caso contrario.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Verificamos que estamos en el entorno del navegador.
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQueryList = window.matchMedia(query);
      // Actualizamos el estado con el valor inicial.
      setMatches(mediaQueryList.matches);

      // Función que actualiza el estado.
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      mediaQueryList.addEventListener("change", listener);

      return () => mediaQueryList.removeEventListener("change", listener);
    }
  }, [query]);

  return matches;
}
