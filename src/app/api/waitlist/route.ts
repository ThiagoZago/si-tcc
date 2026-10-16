import { publicRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { joinWaitlist } from "@/server/modules/waitlist";
import { rateLimit } from "@/server/security/rate-limit";
import { tokenHash } from "@/server/security/crypto";
import { waitlistSchema } from "@/shared/validation";

export const POST = publicRoute(async (request) => {
  const data = waitlistSchema.parse(await readJson(request));
  rateLimit(`wait:${tokenHash(data.customerPhone)}`, 10, 3600);
  joinWaitlist(data);
  return json(
    {
      message:
        "Você entrou na lista de espera. A barbearia poderá entrar em contato se surgir uma vaga.",
    },
    201,
  );
});
