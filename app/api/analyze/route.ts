import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { riderText, inventoryText } = await req.json()

    if (!riderText || !inventoryText) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
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

    const text = completion.choices[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const results = JSON.parse(clean)

    return NextResponse.json({ results })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
