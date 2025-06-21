import Link from "next/link";
import styles from "./nav.module.css";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.leftbar}>
        <Link href="/">Home</Link>
        <Link href="/blog">Posts</Link>
        <a href="https://tig-github.github.io/" target="_blank">
          Portfolio
        </a>
      </div>
      <Image
        src="/logo.png"
        width={50}
        height={50}
        alt="Yaz, the symbol of freedom"
      />
    </nav>
  );
}
