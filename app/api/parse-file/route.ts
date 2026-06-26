import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export const runtime = 'nodejs'
export const maxDuration = 30

async function parsePdf(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse')
  const data = await pdfParse(buffer)
  return data.text
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

function parseExcel(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const lines: string[] = []
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const csv = XLSX.utils.sheet_to_csv(sheet)
    if (csv.trim()) lines.push(`[${sheetName}]\n${csv}`)
  }
  return lines.join('\n\n')
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const name = file.name.toLowerCase()

    let text = ''

    if (name.endsWith('.pdf')) {
      text = await parsePdf(buffer)
    } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
      text = await parseDocx(buffer)
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.ods')) {
      text = parseExcel(buffer)
    } else if (name.endsWith('.csv')) {
      text = buffer.toString('utf-8')
    } else {
      // plain text fallback
      text = buffer.toString('utf-8')
    }

    return NextResponse.json({ text: text.trim() })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || 'Parse error' }, { status: 500 })
  }
}
