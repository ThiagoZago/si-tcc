import "server-only";
import { randomUUID } from "node:crypto";
import { one, run, transaction } from "@/server/db/connection";
import { demoEnabled } from "@/server/config";
import { hashPassword, randomToken, tokenHash } from "@/server/security/crypto";
import { defaultAvailability } from "@/shared/availability";
import { addDays, localDate } from "@/shared/format";

export const DEMO_EMAIL = "demo@barbapp.local";
export const DEMO_PASSWORD = "BarbApp2026!";
export function isDemoLocked(email: string | undefined) {
  return email === DEMO_EMAIL && !demoEnabled();
}
export function seedDemo() {
  if (one("SELECT id FROM users WHERE email = ?", DEMO_EMAIL)) return;
  transaction(() => {
    if (one("SELECT id FROM users WHERE email = ?", DEMO_EMAIL)) return;
    const user = randomUUID();
    const business = randomUUID();
    const hours = JSON.stringify(defaultAvailability());
    run(
      "INSERT INTO users(id,name,email,password_hash) VALUES(?,?,?,?)",
      user,
      "Lucas",
      DEMO_EMAIL,
      hashPassword(DEMO_PASSWORD),
    );
    run(
      "INSERT INTO businesses(id,owner_id,name,slug,description,phone,email,address,city,hours) VALUES(?,?,?,?,?,?,?,?,?,?)",
      business,
      user,
      "Studio Navalha",
      "studio-navalha",
      "Cortes com personalidade, barba bem cuidada e uma boa conversa. Um espaço para cuidar de você.",
      "11987654321",
      "contato@studio.example",
      "Rua dos Pinheiros, 870 · Pinheiros",
      "São Paulo, SP",
      hours,
    );
    const professionals = [
      {
        id: randomUUID(),
        name: "Rafael Mendes",
        role: "Barbeiro especialista",
        color: "#b92b32",
        bio: "Cortes clássicos e modernos, com atenção a cada detalhe.",
      },
      {
        id: randomUUID(),
        name: "André Costa",
        role: "Barbeiro & visagista",
        color: "#977444",
        bio: "Especialista em barba e em encontrar o estilo que combina com você.",
      },
      {
        id: randomUUID(),
        name: "Diego Santos",
        role: "Barbeiro",
        color: "#52786b",
        bio: "Degradês e acabamentos precisos para um visual renovado.",
      },
    ];
    for (const p of professionals)
      run(
        "INSERT INTO professionals(id,business_id,name,role,bio,color,availability) VALUES(?,?,?,?,?,?,?)",
        p.id,
        business,
        p.name,
        p.role,
        p.bio,
        p.color,
        hours,
      );
    const services = [
      {
        id: randomUUID(),
        name: "Corte de cabelo",
        description: "Seu estilo, com acabamento impecável.",
        price: 5500,
        duration: 30,
      },
      {
        id: randomUUID(),
        name: "Barba & acabamento",
        description: "Toalha quente, desenho e finalização.",
        price: 4000,
        duration: 30,
      },
      {
        id: randomUUID(),
        name: "Corte + barba",
        description: "O cuidado completo para renovar o visual.",
        price: 8500,
        duration: 60,
      },
      {
        id: randomUUID(),
        name: "Corte infantil",
        description: "Paciência e cuidado para os pequenos.",
        price: 4500,
        duration: 30,
      },
    ];
    for (const s of services) {
      run(
        "INSERT INTO services(id,business_id,name,description,price,duration) VALUES(?,?,?,?,?,?)",
        s.id,
        business,
        s.name,
        s.description,
        s.price,
        s.duration,
      );
      for (const p of professionals)
        run("INSERT INTO service_professionals VALUES(?,?)", s.id, p.id);
    }
    const names = [
      "Gabriel Oliveira",
      "Pedro Almeida",
      "Bruno Ferreira",
      "Matheus Silva",
      "Felipe Rocha",
      "João Martins",
      "Gustavo Lima",
      "Henrique Souza",
      "Thiago Ribeiro",
      "Vinícius Santos",
      "Daniel Araújo",
      "Caio Moreira",
    ];
    const customers = names.map((name, i) => {
      const id = randomUUID();
      run(
        "INSERT INTO customers(id,business_id,name,phone,email) VALUES(?,?,?,?,?)",
        id,
        business,
        name,
        `1199000${(1000 + i).toString()}`,
        "",
      );
      return id;
    });
    const today = localDate();
    for (let day = -21; day <= 5; day++) {
      const date = addDays(today, day);
      const week = new Date(`${date}T12:00:00Z`).getUTCDay();
      if (week === 0) continue;
      const times =
        week === 6 ? [540, 600, 660, 780, 840] : [540, 585, 630, 780, 840, 900, 960, 1020];
      times.forEach((start, i) => {
        const p = professionals[(i + Math.abs(day)) % 3];
        const s = services[(i + Math.abs(day)) % 4];
        const customer = customers[(i + Math.abs(day) * 3) % customers.length];
        run(
          "INSERT INTO appointments(id,business_id,customer_id,professional_id,service_id,date,start_minutes,duration,price,status,service_name,professional_name,manage_hash) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
          randomUUID(),
          business,
          customer,
          p.id,
          s.id,
          date,
          start,
          s.duration,
          s.price,
          day < 0 ? "completed" : i === 1 ? "pending" : "confirmed",
          s.name,
          p.name,
          tokenHash(randomToken()),
        );
      });
    }
  });
}
