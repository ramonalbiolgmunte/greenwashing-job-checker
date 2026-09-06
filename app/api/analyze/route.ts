import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/prompt";

// Se ejecuta solo en el servidor: la API key nunca llega al navegador del usuario.
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { jobText } = await req.json();

    if (!jobText || typeof jobText !== "string" || jobText.trim().length < 30) {
      return NextResponse.json(
        { error: "Pega el texto completo de la oferta (mínimo unas líneas)." },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: jobText }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Respuesta inesperada del modelo.");
    }

    // El modelo devuelve JSON como texto; lo parseamos aquí para validarlo
    // antes de enviarlo al cliente.
    const parsed = JSON.parse(textBlock.text);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Error en /api/analyze:", err);
    return NextResponse.json(
      { error: "No se pudo completar el análisis. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
