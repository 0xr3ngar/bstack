import { z } from "zod";

export const contentSchema = z.union([z.string(), z.array(z.unknown())]);
export const textBlockSchema = z.object({
  type: z.enum(["text", "input_text", "output_text"]),
  text: z.string(),
});
const timestampSchema = z.string().optional();
const messageSchema = z.object({ content: contentSchema.optional() });
export const claudeSchema = z.object({
  type: z.string(),
  timestamp: timestampSchema,
  message: messageSchema.optional(),
  content: contentSchema.optional(),
});
export const cursorSchema = z.object({
  role: z.string(),
  timestamp: timestampSchema,
  message: messageSchema.optional(),
  content: contentSchema.optional(),
});
export const piSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("session"), cwd: z.string() }),
  z.object({
    type: z.literal("message"),
    timestamp: timestampSchema,
    message: z.object({
      role: z.enum(["user", "assistant", "toolResult"]),
      content: contentSchema,
    }),
  }),
]);
export const codexSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("session_meta"), payload: z.object({ cwd: z.string() }) }),
  z.object({
    type: z.literal("response_item"),
    timestamp: timestampSchema,
    payload: z.discriminatedUnion("type", [
      z.object({ type: z.literal("message"), role: z.enum(["user", "assistant"]), content: contentSchema }),
      z.object({ type: z.literal("function_call"), arguments: z.string() }),
      z.object({ type: z.literal("custom_tool_call"), input: z.string() }),
      z.object({ type: z.literal("function_call_output") }),
      z.object({ type: z.literal("custom_tool_call_output") }),
    ]),
  }),
]);

