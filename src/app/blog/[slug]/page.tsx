import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPostBySlug, getAdjacent } from "@/lib/blog";
import BlogProse from "@/components/blog/BlogProse";
import ArticleHeader from "@/components/blog/ArticleHeader";
import SeriesNav from "@/components/blog/SeriesNav";
import { mdxComponents } from "@/components/blog/mdxComponents";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.meta.title} | Softbrew Studio`, description: post.meta.summary };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const total = getAllPosts().length;
  const { prev, next } = getAdjacent(slug);

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
      },
    },
  });

  return (
    <article className="mx-auto max-w-3xl">
      <ArticleHeader meta={post.meta} total={total} />
      <BlogProse>{content}</BlogProse>
      <SeriesNav prev={prev} next={next} />
    </article>
  );
}
