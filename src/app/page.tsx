import HomeClient from "./HomeClient";
import { getAllPosts } from "@/lib/blog";

export default function Page() {
  const posts = getAllPosts().slice(0, 4);
  return <HomeClient posts={posts} />;
}
