// src/hooks/useTimeline.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export interface Timeline {
  id: string;
  title: string;
  structure: string[];
  usages: string[];
  created_at?: string;
}

export function useTimeline() {
  const [oldestTimeline, setOldestTimeline] = useState<Timeline | null>(null);
  const [latestTimelines, setLatestTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTimelines = async () => {
    setLoading(true);

    const { data: oldestData, error: oldestError } = await supabase
      .from("timelines")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1);

    if (!oldestError && oldestData?.length) {
      setOldestTimeline(oldestData[0]);
    }

    const { data: latestData, error: latestError } = await supabase
      .from("timelines")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);

    if (!latestError && latestData) {
      setLatestTimelines(latestData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTimelines();
  }, []);

  return {
    oldestTimeline,
    latestTimelines,
    loading,
    fetchTimelines,
  };
}
