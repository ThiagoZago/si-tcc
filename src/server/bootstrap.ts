import "server-only";
import { database } from "@/server/db/connection";
import { seedDemo } from "@/server/demo";
import { demoEnabled } from "@/server/config";

export function initialize() {
  database();
  if (demoEnabled()) seedDemo();
}
