import Link from "next/link";
import styles from "./nav.module.css";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.leftbar}>
        <Link href="/" aria-label="Home page">
          Home
        </Link>
        <Link href="/blog" aria-label="Posts page to view all blog posts">
          Posts
        </Link>
        <a
          href="https://tig-github.github.io/"
          target="_blank"
          aria-label="Link to personal portfolio"
          className={styles.portfolio}
        >
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
