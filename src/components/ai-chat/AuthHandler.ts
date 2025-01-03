import { supabase } from "@/integrations/supabase/client";

export const checkAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Auth check error:", error);
      throw error;
    }
    
    if (!session) {
      console.log("No session found during auth check");
      return { isAuthenticated: false };
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User verification failed:", userError);
      throw userError || new Error("User not found");
    }
    
    return { isAuthenticated: true, user };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { isAuthenticated: false, error };
  }
};