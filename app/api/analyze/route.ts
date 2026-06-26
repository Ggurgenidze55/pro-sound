import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { riderText, inventoryText } = await req.json()

    if (!riderText || !inventoryText) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `შენ ხარ Pro Sound-ის ტექნიკური მენეჯერი. გაანალიზე ბენდის რაიდერი და შეადარე Pro Sound-ის ინვენტარს.

Pro Sound-ის ინვენტარი:
${inventoryText}

ბენდის მოთხოვნილი რაიდერი:
${riderText}

გაანალიზე თითოეული მოთხოვნა და დააბრუნე JSON მასივი ასე:
[
  {"item": "მოწყობილობის სახელი", "status": "have|nothave|alt", "note": "მოკლე შენიშვნა ქართულად"},
  ...
]

status-ის წესები:
- "have" = ზუსტად ან ძალიან ახლოს გვაქვს ინვენტარში (note-ში მიუთითე რა გვაქვს)
- "nothave" = საერთოდ არ გვაქვს და ალტერნატივაც არ გამოდგება
- "alt" = ზუსტი მოდელი/რაოდენობა არ გვაქვს, მაგრამ ალტერნატივა გვაქვს (note-ში მიუთითე რომელი)

მხოლოდ JSON დააბრუნე, სხვა ტექსტი არ. JSON-ი უნდა იყოს ვალიდური.`,
        },
      ],
    })

    const text = message.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')

    const clean = text.replace(/```json|```/g, '').trim()
    const results = JSON.parse(clean)

    return NextResponse.json({ results })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
