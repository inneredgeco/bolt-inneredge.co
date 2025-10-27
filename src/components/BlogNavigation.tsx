import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface AdjacentPost {
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
}

interface BlogNavigationProps {
  previousPost: AdjacentPost | null;
  nextPost: AdjacentPost | null;
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return (
      <div className="mt-16 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 font-semibold transition-colors"
        >
          View All Posts
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center text-stone-900 mb-2">
        Continue Reading
      </h2>
      <div className="w-16 h-1 bg-accent mx-auto mb-12"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {previousPost ? (
          <Link
            to={`/blog/${previousPost.slug}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-accent"
          >
            <div className="flex gap-4 p-6">
              <div className="flex-shrink-0 w-24 h-24 bg-stone-200 rounded-lg overflow-hidden">
                {previousPost.image_url ? (
                  <img
                    src={previousPost.image_url}
                    alt={previousPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-900">
                    <BookOpen className="w-8 h-8 text-amber-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-stone-500 text-sm font-medium mb-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>PREVIOUS</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-brand-500 transition-colors line-clamp-2">
                  {previousPost.title}
                </h3>
                <p className="text-sm text-stone-600 line-clamp-2">
                  {previousPost.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-stone-100 rounded-lg p-6 flex items-center justify-center text-stone-400">
            <span className="text-sm font-medium">No previous post</span>
          </div>
        )}

        {nextPost ? (
          <Link
            to={`/blog/${nextPost.slug}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-accent"
          >
            <div className="flex gap-4 p-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-end gap-2 text-stone-500 text-sm font-medium mb-2">
                  <span>NEXT</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-brand-500 transition-colors line-clamp-2 text-right">
                  {nextPost.title}
                </h3>
                <p className="text-sm text-stone-600 line-clamp-2 text-right">
                  {nextPost.excerpt}
                </p>
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-stone-200 rounded-lg overflow-hidden">
                {nextPost.image_url ? (
                  <img
                    src={nextPost.image_url}
                    alt={nextPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-900">
                    <BookOpen className="w-8 h-8 text-amber-500" />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-stone-100 rounded-lg p-6 flex items-center justify-center text-stone-400">
            <span className="text-sm font-medium">No next post</span>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 font-semibold transition-colors"
        >
          View All Posts
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
