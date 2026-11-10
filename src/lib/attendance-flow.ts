export type AttendanceStatus = "Com a IA" | "Aguardando equipe" | "Com atendente" | "Resolvido";
export type AttendanceAction = "assume" | "transfer" | "resolve" | "reopen";

export function transitionAttendance(status: AttendanceStatus, action: AttendanceAction): AttendanceStatus {
  if (action === "assume" && (status === "Com a IA" || status === "Aguardando equipe")) return "Com atendente";
  if (action === "transfer" && status === "Com a IA") return "Aguardando equipe";
  if (action === "resolve" && status === "Com atendente") return "Resolvido";
  if (action === "reopen" && status === "Resolvido") return "Com atendente";
  return status;
}

export function canSendHumanMessage(status: AttendanceStatus) {
  return status === "Com atendente";
}