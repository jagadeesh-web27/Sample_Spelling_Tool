import React, { useState, useEffect } from "react";
import "../Styles/readnews.css";

interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

const NewsApp: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]); // Typed state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [focusedTitle, setFocusedTitle] = useState<string>(""); // For screen reader focus
  const fallbackImage = "/images/default-news.png"; // if stored locally in public/images/


  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=5756c8f1d58b4b34ae67d53a68a35516"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();

        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          setArticles([]);
        }
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-container" role="main" aria-labelledby="news-heading">
      <h1 id="news-heading">Latest News</h1>
      {loading && <p>Loading news...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="news-grid">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div
                key={index}
                className="news-card"
                onFocus={() => setFocusedTitle(article.title)}
              >
                <img
  src={article.urlToImage || fallbackImage}
  alt={article.title}
  className="news-image"
  onError={(e) => {
    (e.target as HTMLImageElement).src = fallbackImage;
  }}
/>

                <h3
                  className="news-title"
                  aria-live="assertive"
                  aria-label={focusedTitle}
                >
                  {article.title}
                </h3>
                <p className="news-description">
                  {article.description || "No description available."}
                </p>
                <p className="news-author">By {article.author || "Unknown"}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                  aria-label={`Read more about ${article.title}`}
                >
                  Read More
                </a>
              </div>
            ))
          ) : (
            <p>No news articles available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsApp;