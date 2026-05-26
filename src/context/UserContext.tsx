"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type UserContextValue = {
  user: User | null;
  role: string | null;
  loading: boolean;
};

const UserContext = createContext<UserContextValue>({ user: null, role: null, loading: true });

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchAndSetUser(id: string | null) {
      if (!id) {
        setRole(null);
        return;
      }
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", id)
        .single();
      setRole(profile?.role ?? null);
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      fetchAndSetUser(data.user?.id ?? null).then(() => setLoading(false));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const u = session?.user ?? null;
      setUser(u);
      fetchAndSetUser(u?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, role, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
