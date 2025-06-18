import { useQuery } from "@tanstack/react-query";
import type { Fruit } from "../types";
import { API_BASE_URL, API_HEADERS } from "@/constants";

async function fetchFruits(): Promise<Fruit[]> {
  const response = await fetch(`${API_BASE_URL}/fruits`, {
    headers: API_HEADERS,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch fruits: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

export function useFruits() {
  return useQuery({
    queryKey: ["fruits"],
    queryFn: fetchFruits,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("4")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
