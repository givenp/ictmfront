// pages/articles/[doi].js
import axios from 'axios';

export async function getStaticPaths() {
  const res = await axios.get(
    'https://perfect-desk-ea26f779f7.strapiapp.com/api/articles'
  );

  const paths = res.data.data.map((article) => ({
    params: { doi: article.doi },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { doi } = params;

  const res = await axios.get(
    'https://perfect-desk-ea26f779f7.strapiapp.com/api/articles?populate=pdf'
  );

  const articles = res.data.data;
  const article = articles.find((a) => a.doi === doi);

  if (!article) return { notFound: true };

  return {
    props: { article },
    revalidate: 60,
  };
}

export default function ArticlePage({ article }) {
  const { title, authors, publicationDate, keywords, abstract, pdf, doi } = article;

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p><strong>Authors:</strong> {authors}</p>
      <p><strong>Publication Date:</strong> {publicationDate}</p>
      <p><strong>DOI:</strong> {doi}</p>
      <p><strong>Keywords:</strong> {keywords}</p>

      <div className="mt-4">
        <p className="font-semibold">Abstract:</p>
        {abstract?.map((block, i) => (
          block.type === 'paragraph' ? (
            <p key={i}>{block.children[0]?.text}</p>
          ) : null
        ))}
      </div>

      {pdf?.url && (
        <a
          href={pdf.url}
          className="mt-6 block text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          📄 Download PDF
        </a>
      )}
    </main>
  );
}
