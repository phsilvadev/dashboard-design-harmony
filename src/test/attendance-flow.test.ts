import { describe, expect, it } from "vitest";
import { canSendHumanMessage, transitionAttendance } from "@/lib/attendance-flow";

describe("AI-first attendance", () => {
  it("hands the AI conversation to the attendant on assume", () => {
    expect(transitionAttendance("Com a IA", "assume")).toBe("Com atendente");
  });
  it("queues the AI conversation for the team on transfer", () => {
    expect(transitionAttendance("Com a IA", "transfer")).toBe("Aguardando equipe");
  });
  it("allows a queued conversation to be assumed", () => {
    expect(transitionAttendance("Aguardando equipe", "assume")).toBe("Com atendente");
  });
  it("requires ownership before sending human replies", () => {
    expect(canSendHumanMessage("Com a IA")).toBe(false);
    expect(canSendHumanMessage("Aguardando equipe")).toBe(false);
    expect(canSendHumanMessage("Com atendente")).toBe(true);
    expect(canSendHumanMessage("Resolvido")).toBe(false);
  });
  it("resolves and reopens with an attendant", () => {
    expect(transitionAttendance("Com atendente", "resolve")).toBe("Resolvido");
    expect(transitionAttendance("Resolvido", "reopen")).toBe("Com atendente");
  });
});