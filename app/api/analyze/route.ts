import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

// keep under ~6000 chars to stay within free tier token limits
function trimText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars) + '\n...[truncated]'
}

export async function POST(req: NextRequest) {
  try {
    const { riderText, inventoryText } = await req.json()

    if (!riderText || !inventoryText) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const trimmedInventory = trimText(inventoryText, 5000)
    const trimmedRider = trimText(riderText, 3000)

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: 'You are a sound equipment manager. Analyze rider requests vs inventory. Always respond with valid JSON only, no other text.',
        },
        {
          role: 'user',
          content: `Compare this band rider against Pro Sound inventory. Return a JSON array only.

INVENTORY:
${trimmedInventory}

RIDER REQUIREMENTS:
${trimmedRider}

Return JSON array:
[{"item":"equipment name","status":"have|nothave|alt","note":"short note in Georgian"}]

Rules:
- "have" = we have it (note: what exactly)
- "nothave" = we don't have it at all
- "alt" = we have an alternative (note: which one)

JSON only, no markdown, no explanation.`,
        },
      ],
    })

    const text = completion.choices[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const results = JSON.parse(clean)

    return NextResponse.json({ results })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
