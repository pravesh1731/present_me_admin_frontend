// Small helpers for showing teachers, students and admins consistently

export const fullName = (p) => `${p?.firstName || ""} ${p?.lastName || ""}`.trim() || p?.name || "";

export const initials = (p) => `${p?.firstName?.[0] || ""}${p?.lastName?.[0] || ""}`.toUpperCase() || p?.emailId?.[0]?.toUpperCase() || "?";
