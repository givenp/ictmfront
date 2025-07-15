// pages/index.js
import axios from 'axios';

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

export default function Home({ articles }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Journal Archive</h1>

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => {
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
              <div
                key={id}
                className="border p-4 rounded-xl shadow-md hover:shadow-lg transition bg-white"
              >
                <h2 className="text-xl font-semibold mb-1">{title || 'Untitled'}</h2>
                <p className="text-gray-700 mb-1"><strong>Authors:</strong> {authors || 'Unknown'}</p>
                <p className="text-gray-700 mb-1"><strong>Date:</strong> {publicationDate || 'N/A'}</p>
                <p className="text-gray-700 mb-1"><strong>DOI:</strong> {doi || 'N/A'}</p>
                <p className="text-gray-700 mb-2"><strong>Keywords:</strong> {keywords || 'N/A'}</p>

                {abstract?.length > 0 && (
                  <div className="mb-3">
                    <p className="font-semibold">Abstract:</p>
                    {abstract.map((block, i) =>
                      block.type === 'paragraph' ? (
                        <p key={i} className="text-sm text-gray-600">{block.children[0]?.text}</p>
                      ) : null
                    )}
                  </div>
                )}

                {pdf?.url ? (
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 hover:underline mt-2"
                  >
                    📄 Download PDF
                  </a>
                ) : (
                  <p className="text-red-500 mt-2">No PDF available</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




