import styles from '../styles/Home.module.css'
import {useRouter} from 'next/dist/client/router'

export default function Home() {

  const router = useRouter();
  let toVoting = () => router.push("/vote")
  let toStats = () => router.push("/view")

  return (
    <div className={styles.container}>
    <div className={styles.mainContainer}>
      <p className={styles.heading}>VOTING SYSTEM DAPP</p>
      <p className={styles.description}>Powered by QuickNode</p>
      <button onClick={toVoting} className={styles.button}>VOTE</button>
    </div>
    <div className={styles.biggestCircle}></div>
      <div className={styles.smallCircle1}></div>
      <div className={styles.smallCircle2}></div>
    </div>
  )
}
