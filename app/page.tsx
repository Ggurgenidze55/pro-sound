'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import RiderTab from '@/components/RiderTab'
import InventoryTab from '@/components/InventoryTab'
import styles from './page.module.css'

export type InventoryItem = { name: string; qty: number }
export type Inventory = Record<string, InventoryItem[]>

const defaultInventory: Inventory = {
  'მიკროფონები': [
    { name: 'Shure SM58', qty: 4 },
    { name: 'Shure SM57', qty: 4 },
    { name: 'AKG C414', qty: 2 },
    { name: 'Shure Beta 91A (kick)', qty: 2 },
    { name: 'Sennheiser e604 (tom)', qty: 4 },
  ],
  'მიქსერი': [
    { name: 'Allen & Heath SQ-6', qty: 1 },
    { name: 'Behringer X32', qty: 1 },
    { name: 'Yamaha MG16XU (მონიტორი)', qty: 1 },
  ],
  'სპიკერები': [
    { name: 'RCF ART 945-A (main)', qty: 4 },
    { name: 'RCF SUB 8003-AS (sub)', qty: 2 },
    { name: 'RCF NX 985-A (monitor)', qty: 6 },
  ],
  'DI Boxes': [
    { name: 'Radial J48 Active DI', qty: 4 },
    { name: 'Behringer DI400P', qty: 4 },
  ],
  'კაბელები / კომუტაცია': [
    { name: 'XLR კაბელი 10m', qty: 20 },
    { name: 'XLR კაბელი 5m', qty: 10 },
    { name: 'Multicore snake 32ch 30m', qty: 1 },
    { name: 'Jack-Jack 6m', qty: 8 },
  ],
  'სტენდები': [
    { name: 'მიკროფონის სტენდი', qty: 12 },
    { name: 'Boom arm სტენდი', qty: 6 },
  ],
  'დამუშავება': [
    { name: 'DBX DriveRack PA2', qty: 1 },
    { name: 'Behringer FBQ3102 EQ', qty: 2 },
  ],
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'rider' | 'inventory'>('rider')
  const [inventory, setInventory] = useState<Inventory>(defaultInventory)

  return (
    <div className={styles.app}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className={styles.main}>
        {activeTab === 'rider' ? (
          <RiderTab inventory={inventory} />
        ) : (
          <InventoryTab inventory={inventory} setInventory={setInventory} />
        )}
      </main>
    </div>
  )
}
