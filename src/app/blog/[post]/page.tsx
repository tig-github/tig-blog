import { getPost, getAllPosts, formatDate } from "../../../utils/post";
import styles from "../blog.module.css";

interface PageProps {
  params: Promise<{ post: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    post: post.id,
  }));
}

export default async function Page({ params }: PageProps) {
  // Next 14/15: params is async
  const { post } = await params;

  if (!post) {
    throw new Error("Post param is missing");
  }

  const postData = await getPost(post);

  return (
    <div className={styles.blog}>
      <h1 className={styles.title}>{postData.title}</h1>
      <div className={styles.date}>{formatDate(postData.date)}</div>
      <article
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </div>
  );
}
