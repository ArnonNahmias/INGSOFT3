import { Post } from "@/services/postHttpService";
import PostItem from "./PostItem";

interface PostListProps {
  posts: Post[];
  onPostDeleted?: (postId: number) => void;
}

export default function PostList({ posts, onPostDeleted }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aún no hay publicaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" aria-live="polite">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onPostDeleted={onPostDeleted} />
      ))}
    </div>
  );
}
