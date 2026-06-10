import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { supabase } from "@/integrations/supabase/client";
import "./styles.css";

// Global Auth Logger
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`[Global Auth] Event: ${event}, Session Exists: ${!!session}`);
  if (session) {
    console.log("[Global Auth] Session User:", session.user.email);
  }
});

const router = getRouter();

console.log(
  "[App] Initializing with Supabase URL:",
  import.meta.env.VITE_SUPABASE_URL ? "Defined" : "MISSING!",
);

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
