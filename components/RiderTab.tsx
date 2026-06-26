'use client'

import { useState } from 'react'
import type { Inventory } from '@/app/page'
import styles from './RiderTab.module.css'

type RiderResult = {
  item: string
  status: 'have' | 'nothave' | 'alt'
  note: string
}

export default function RiderTab({ inventory }: { inventory: Inventory }) {
  const [riderText, setRiderText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<RiderResult[] | null>(null)
  const [error, setError] = useState('')

  const inventoryText = Object.entries(inventory)
    .map(([cat, items]) => `${cat}: ${items.map(i => `${i.name} (×${i.qty})`).join(', ')}`)
    .join('\n')

  async function analyze() {
    if (!riderText.trim()) return
    setLoading(true)
    setResults(null)
    setError('')

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riderText, inventoryText }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.results)
    } catch (e: any) {
      setError(e.message || 'შეცდომა მოხდა')
    } finally {
      setLoading(false)
    }
  }

  const counts = results
    ? {
        have: results.filter(r => r.status === 'have').length,
        nothave: results.filter(r => r.status === 'nothave').length,
        alt: results.filter(r => r.status === 'alt').length,
      }
    : null

  return (
    <div>
      <p className={styles.sectionLabel}>ბენდის ტექნიკური რაიდერი</p>

      <textarea
        className={styles.textarea}
        value={riderText}
        onChange={e => setRiderText(e.target.value)}
        placeholder={`მაგ:\n- 2x Shure SM58 vocal microphones\n- 4x DI boxes\n- 1x Yamaha QL5 mixing console\n- 6x Monitor wedges\n- Wireless IEM system\n...`}
        rows={8}
      />

      <div className={styles.actions}>
        <button
          className={styles.btnPrimary}
          onClick={analyze}
          disabled={loading || !riderText.trim()}
        >
          {loading ? 'ანალიზი...' : '⚡ კონტრ-რაიდერის გენერაცია'}
        </button>
        {(riderText || results) && (
          <button
            className={styles.btnSecondary}
            onClick={() => { setRiderText(''); setResults(null) }}
          >
            გასუფთავება
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.dots}>
            <span /><span /><span />
          </div>
          <p>AI აანალიზებს რაიდერს...</p>
        </div>
      )}

      {results && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>კონტრ-რაიდერი — Pro Sound</h2>
            <div className={styles.summary}>
              <span className={styles.countHave}>✓ {counts!.have} გვაქვს</span>
              <span className={styles.countAlt}>↔ {counts!.alt} ალტერნატივა</span>
              <span className={styles.countNo}>✗ {counts!.nothave} არ გვაქვს</span>
            </div>
          </div>

          <div className={styles.legend}>
            <span><span className={`${styles.dot} ${styles.dotHave}`} /> გვაქვს</span>
            <span><span className={`${styles.dot} ${styles.dotAlt}`} /> ალტერნატივა</span>
            <span><span className={`${styles.dot} ${styles.dotNo}`} /> არ გვაქვს</span>
          </div>

          <div className={styles.list}>
            {results.map((r, i) => (
              <div key={i} className={styles.item}>
                <span className={`${styles.dot} ${r.status === 'have' ? styles.dotHave : r.status === 'alt' ? styles.dotAlt : styles.dotNo}`} />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{r.item}</span>
                  {r.note && <span className={styles.itemNote}>{r.note}</span>}
                </div>
                <span className={`${styles.badge} ${r.status === 'have' ? styles.badgeHave : r.status === 'alt' ? styles.badgeAlt : styles.badgeNo}`}>
                  {r.status === 'have' ? '✓ გვაქვს' : r.status === 'alt' ? '↔ ალტერნატივა' : '✗ არ გვაქვს'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
