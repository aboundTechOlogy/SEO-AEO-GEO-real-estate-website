import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Market insights, neighborhood guides, and expert analysis of Miami's luxury real estate market.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.filter((p) => p.featured);
  const recent = posts.filter((p) => !p.featured);

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-playfair text-4xl md:text-5xl mb-3">Insights</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Market analysis, neighborhood guides, and the insider perspective on
          South Florida luxury real estate.
        </p>

        {/* Featured Posts */}
        {featured.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {featured.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block border border-gray-200 bg-white hover:border-gray-300 transition-colors rounded-sm overflow-hidden shadow-sm"
              >
                {/* Cover image placeholder */}
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-neutral-600 text-xs uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                    <span>{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="font-playfair text-xl text-[#1a1a1a] group-hover:text-black transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 text-xs text-neutral-500">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* All Posts */}
        {recent.length > 0 && (
          <>
            <h2 className="font-playfair text-2xl mb-6">All Posts</h2>
            <div className="space-y-0 divide-y divide-gray-200">
              {recent.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block py-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
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
                  <h3 className="font-playfair text-lg text-[#1a1a1a] group-hover:text-black transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            <p className="font-playfair text-2xl mb-2">Coming Soon</p>
            <p className="text-sm">
              Market insights and neighborhood guides are on the way.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
