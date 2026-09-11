import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, hex_color")
        .order("name", { ascending: true });

      if (!active) return;

      if (error) {
        setError(error);
        setCategories([]);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { categories, setCategories, loading, error };
}
