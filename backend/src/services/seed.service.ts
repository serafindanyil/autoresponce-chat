import { seedChats } from "@/services/chat.service";

const SAMPLE_CHATS = [
  { firstName: "Ada", lastName: "Lovelace" },
  { firstName: "Alan", lastName: "Turing" },
  { firstName: "Grace", lastName: "Hopper" },
];

export async function seedDatabase(): Promise<void> {
  await seedChats(SAMPLE_CHATS);
}
