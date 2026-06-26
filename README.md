# Pro Sound — კონტრ-რაიდერი

AI-powered კონტრ-რაიდერის გენერაცია Pro Sound-ის ინვენტარის მიხედვით.

## დაყენება

```bash
npm install
```

## Vercel-ზე Deploy

1. GitHub-ზე ატვირთე პროჯექტი
2. [vercel.com](https://vercel.com)-ზე "Import Project"
3. Environment Variables-ში დაამატე:
   - `ANTHROPIC_API_KEY` — შენი Anthropic API key

## ლოკალური გაშვება

```bash
cp .env.example .env.local
# .env.local-ში შეიყვანე ANTHROPIC_API_KEY

npm run dev
```

გახსენი [http://localhost:3000](http://localhost:3000)

## ფუნქციონალი

- **კონტრ-რაიდერი** — ბენდის რაიდერის ანალიზი + Pro Sound ინვენტართან შედარება
- **ინვენტარი** — აღჭურვილობის მართვა (Google Sheets ინტეგრაცია მოსალოდნელია)
