'use client'

import styles from './Header.module.css'

type Tab = 'rider' | 'inventory'

export default function Header({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <div className={styles.bars}>
            <span className={styles.coral} />
            <span className={styles.lime} />
            <span className={styles.blue} />
          </div>
          <span className={styles.logoText}>
            <span className={styles.pro}>PRO</span>{' '}
            <span className={styles.sound}>SOUND</span>
          </span>
        </div>

        <nav className={styles.nav}>
          <button
            className={activeTab === 'rider' ? styles.tabActive : styles.tab}
            onClick={() => onTabChange('rider')}
          >
            კონტრ-რაიდერი
          </button>
          <button
            className={activeTab === 'inventory' ? styles.tabActive : styles.tab}
            onClick={() => onTabChange('inventory')}
          >
            ინვენტარი
          </button>
        </nav>
      </div>
    </header>
  )
}
