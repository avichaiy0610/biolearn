"use client";

import { useEffect, useState } from "react";

export function useAdmin(): boolean {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => setAdmin(d.isAdmin === true))
      .catch(() => {});
  }, []);

  return admin;
}
