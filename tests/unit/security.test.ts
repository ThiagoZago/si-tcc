import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, randomToken, tokenHash } from "@/server/security/crypto";
test("usa salt independente e valida a senha", () => {
  const a = hashPassword("SenhaSegura2026");
  const b = hashPassword("SenhaSegura2026");
  assert.notEqual(a, b);
  assert.equal(verifyPassword("SenhaSegura2026", a), true);
  assert.equal(verifyPassword("errada", a), false);
});
test("tokens são imprevisíveis e persistidos pelo hash", () => {
  const a = randomToken();
  const b = randomToken();
  assert.equal(a.length, 43);
  assert.notEqual(a, b);
  assert.notEqual(tokenHash(a), a);
  assert.equal(tokenHash(a).length, 64);
});
