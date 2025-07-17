// pages/index.js
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

export async function getStaticProps() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://perfect-desk-ea26f779f7.strapiapp.com';
  try {
    const res = await axios.get(`${apiUrl}/api/articles?populate=pdf`);
    return {
      props: {
        articles: res.data?.data || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    return {
      props: {
        articles: [],
      },
    };
  }
}

// Helper functions
function capitalizeWords(str) {
  if (!str) return '';
  return str.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

function capitalizeTitle(str) {
  if (!str) return '';
  const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
  return str.split(' ').map((word, index, array) => {
    if (index === 0 || index === array.length - 1) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    if (smallWords.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

export default function Home({ articles = [] }) {
  return (
    <>
      <Head>
        <title>Journal Archive</title>
        <meta name="description" content="Academic journal article archive" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav>
        <div className="nav-container">
          <Link href="/" className="nav-logo">Journal Archive</Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="main-container">
        <h1>Journal Archive</h1>
        <p className="subtitle">Published articles from the academic journal collection</p>

        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          articles.map((article) => {
            const {
              id,
              title,
              authors,
              publicationDate,
              doi,
              keywords,
              abstract,
              pdf,
            } = article;

            return (
              <article key={id} className="article">
                <span className="badge">Article</span>

                <h2 className="article-title">{capitalizeTitle(title) || 'Untitled'}</h2>
                <p className="article-author">{capitalizeWords(authors) || 'Unknown Author'}</p>

                <p className="article-detail"><strong>Published:</strong> {publicationDate || 'N/A'}</p>
                {doi && (
                  <p className="article-detail">
                    <a
                      href={doi.startsWith('http') ? doi : `https://doi.org/${doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doi}
                    </a>
                  </p>
                )}

                {abstract?.length > 0 && (
                  <div>
                    <h3 className="abstract-title">Abstract</h3>
                    <div className="abstract-content">
                      {abstract.map((block, i) =>
                        block.type === 'paragraph' ? (
                          <p key={i}>{block.children[0]?.text}</p>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {keywords && (
                  <div>
                    {keywords.split(',').map((keyword, i) => (
                      <span key={i} className="keyword-tag">{keyword.trim()}</span>
                    ))}
                  </div>
                )}

                <div>
                  {pdf?.url ? (
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdf-button"
                    >
                      Download PDF
                    </a>
                  ) : (
                    <em>PDF not available</em>
                  )}
                </div>
              </article>
            );
          })
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Journal Archive. All rights reserved.</p>
        <p>
          <Link href="/privacy">Privacy Policy</Link> | <Link href="/terms">Terms of Service</Link>
        </p>
      </footer>
    </>
  );
}
