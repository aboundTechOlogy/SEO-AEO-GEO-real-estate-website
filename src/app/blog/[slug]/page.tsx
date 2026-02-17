import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Andrew Whalen`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/blog"
          className="text-sm text-neutral-500 hover:text-white transition-colors mb-8 inline-block"
        >
          ← Back to Insights
        </Link>

        {/* Post header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4">
            <span>{post.category}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600" />
            <span>{post.readTime}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600" />
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl mb-4">
            {post.title}
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-4 pt-4 border-t border-white/5 text-sm text-neutral-500">
            By {post.author}
          </div>
        </div>

        {/* Post content placeholder */}
        <div className="prose prose-invert prose-neutral max-w-none">
          <div className="text-neutral-300 leading-relaxed space-y-6">
            <p>
              Full article content coming soon. This post is part of our ongoing
              series covering South Florida&apos;s luxury real estate market.
            </p>
            <p>
              Check back shortly for the complete analysis, or{" "}
              <a
                href="mailto:andrew@iamandrewwhalen.com"
                className="text-white underline underline-offset-4 hover:text-neutral-300 transition-colors"
              >
                contact Andrew directly
              </a>{" "}
              for immediate insights on the Miami market.
            </p>
          </div>
        </div>

        {/* Author card */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-light tracking-wider">
              AW
            </div>
            <div>
              <p className="text-white font-medium">Andrew Whalen</p>
              <p className="text-sm text-neutral-500 mb-2">
                Realtor® · LoKation Real Estate
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed">
                South Florida luxury real estate specialist. Helping buyers,
                sellers, and investors navigate Miami&apos;s most prestigious
                neighborhoods.
              </p>
            </div>
          </div>
        </div>

        {/* Article JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: {
                "@type": "RealEstateAgent",
                name: post.author,
                worksFor: {
                  "@type": "Organization",
                  name: "LoKation Real Estate",
                },
              },
              publisher: {
                "@type": "Organization",
                name: "Andrew Whalen | LoKation Real Estate",
                url: "https://iamandrewwhalen.com",
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
