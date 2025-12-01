"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

type ApiType = "GET" | "PUT";

export function useApiAction(databaseUrl: string) {
  const [getData, setGetData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dataFetchedRef = useRef(false);

  const performApiAction = useCallback(
    async (type: ApiType, force: boolean = false) => {
      if (dataFetchedRef.current && !force && type === "GET") {
        return getData;
      }

      try {
        setIsLoading(true);
        let response;
        const headers = {
          "Content-Type": "application/json",
          "Database-Url": databaseUrl,
        };

        switch (type) {
          case "GET":
            response = await fetch("/api/data", { headers });
            break;
          case "PUT":
            response = await fetch("/api/data", {
              method: "PUT",
              headers,
              body: JSON.stringify({ isActive: !getData?.isActive }),
            });
            break;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        setGetData(data);
        setIsConnected(true);
        dataFetchedRef.current = true;

        return data;
      } catch (error) {
        console.error(`Error performing ${type} request:`, error);
        toast.error(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
        setIsConnected(false);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [databaseUrl, getData]
  );

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      if (databaseUrl && !dataFetchedRef.current) {
        try {
          await performApiAction("GET");
          if (isMounted) setIsConnected(true);
        } catch (error) {
          console.error("Connection error:", error);
          if (isMounted) setIsConnected(false);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else {
        if (isMounted) setIsLoading(false);
      }
    };

    checkConnection();

    return () => {
      isMounted = false;
    };
  }, [databaseUrl, performApiAction]);

  return { getData, performApiAction, isConnected, isLoading };
}
