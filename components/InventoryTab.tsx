'use client'

import { useState } from 'react'
import type { Inventory } from '@/app/page'
import styles from './InventoryTab.module.css'

export default function InventoryTab({
  inventory,
  setInventory,
}: {
  inventory: Inventory
  setInventory: (inv: Inventory) => void
}) {
  const [newCat, setNewCat] = useState('')
  const [newItem, setNewItem] = useState('')
  const [newQty, setNewQty] = useState('1')

  const totalItems = Object.values(inventory).reduce((s, items) => s + items.reduce((a, i) => a + i.qty, 0), 0)
  const totalTypes = Object.values(inventory).reduce((s, items) => s + items.length, 0)
  const totalCats = Object.keys(inventory).length

  function addItem() {
    const cat = newCat.trim()
    const name = newItem.trim()
    const qty = parseInt(newQty) || 1
    if (!cat || !name) return

    const updated = { ...inventory }
    if (!updated[cat]) updated[cat] = []
    updated[cat] = [...updated[cat], { name, qty }]
    setInventory(updated)
    setNewItem('')
    setNewQty('1')
  }

  function removeItem(cat: string, idx: number) {
    const updated = { ...inventory }
    updated[cat] = updated[cat].filter((_, i) => i !== idx)
    if (updated[cat].length === 0) delete updated[cat]
    setInventory(updated)
  }

  return (
    <div>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{totalItems}</div>
          <div className={styles.statLabel}>სულ ერთეული</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{totalTypes}</div>
          <div className={styles.statLabel}>სახეობა</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{totalCats}</div>
          <div className={styles.statLabel}>კატეგორია</div>
        </div>
      </div>

      <p className={styles.sectionLabel}>ინვენტარი</p>

      <div className={styles.grid}>
        {Object.entries(inventory).map(([cat, items]) => (
          <div key={cat} className={styles.card}>
            <div className={styles.catLabel}>{cat}</div>
            {items.map((item, idx) => (
              <div key={idx} className={styles.invItem}>
                <span className={styles.invName}>{item.name}</span>
                <div className={styles.invRight}>
                  <span className={styles.invQty}>×{item.qty}</span>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(cat, idx)}
                    title="წაშლა"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.addSection}>
        <p className={styles.sectionLabel}>ახალი აღჭურვილობა</p>
        <div className={styles.addRow}>
          <input
            className={styles.input}
            placeholder="კატეგორია"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            list="cats"
          />
          <datalist id="cats">
            {Object.keys(inventory).map(c => <option key={c} value={c} />)}
          </datalist>
          <input
            className={styles.input}
            placeholder="სახელი"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
          />
          <input
            className={styles.inputQty}
            type="number"
            min="1"
            placeholder="რაოდ."
            value={newQty}
            onChange={e => setNewQty(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
          />
          <button className={styles.addBtn} onClick={addItem}>დამატება</button>
        </div>
      </div>
    </div>
  )
}
