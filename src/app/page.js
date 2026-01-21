import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className={styles.intro}>
          <h1>Aviv Oshri</h1>

          Here your app should come....

          <br /><br />

          <Link href="/system/posts">Go to Posts</Link>
        </div>
      </main>
    </div>
  );
}
np