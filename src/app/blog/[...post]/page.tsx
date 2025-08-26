import { getPost, formatDate } from "../../../utils/post";
import styles from "../blog.module.css";

interface PageProps {
  params: Promise<{ post: string }>;
}

export default async function Page({ params }: PageProps) {
  const awaited_params = await params;
  const post: any = await getPost(awaited_params.post);
  return (
    <div className={styles.blog}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.date}>{formatDate(post.date)}</div>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </div>
  );
}
