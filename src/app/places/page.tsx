import type { Metadata } from "next";
import Globe from "../../components/Globe";
import { getAllPosts } from "../../utils/post";
import styles from "./places.module.css";

export const metadata: Metadata = {
  title: "Places",
  description: "Travel stories from places I've visited.",
};

export default async function PlacesPage() {
  const posts = await getAllPosts();
  const countries = Array.from(
    new Set(posts.flatMap((post) => post.countries)),
  ).sort();
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Places</h1>
      <p className={styles.intro}>Select a country to see posts</p>
      <Globe
        countries={countries}
        posts={posts.map(({ id, title, date, countries }) => ({
          id,
          title,
          date,
          countries,
        }))}
      />
    </main>
  );
}
