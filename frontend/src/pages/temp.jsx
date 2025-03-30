import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Sprout, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

const socket = io("http://localhost:5000");

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/news", { withCredentials: true })
      .then((res) => {
        setNews(res.data.articles || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load news. Please try again later.");
        setLoading(false);
      });

    socket.on("newsUpdate", (updatedNews) => {
      setNews(updatedNews);
    });

    return () => {
      socket.off("newsUpdate");
    };
  }, []);

  const toggleReadMore = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Sprout className="text-kisan-green h-7 w-7" />
        <h1 className="text-3xl font-bold text-kisan-green">Latest Agriculture News</h1>
      </div>

      {loading && <div className="flex justify-center items-center min-h-[200px]"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-kisan-green"></div></div>}
      {error && <Card className="border-red-300 bg-red-50 max-w-lg mx-auto"><CardContent className="pt-6"><p className="text-red-600 text-center">{error}</p></CardContent></Card>}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.length > 0 ? news.map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-t-2 border-t-kisan-green-light">
              <div className="relative h-48 overflow-hidden">
                <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                {article.source && typeof article.source === "object" && (
                  <span className="absolute top-0 right-0 bg-kisan-green text-white text-xs px-2 py-1 rounded-bl-md">{article.source.name}</span>
                )}
                {article.source && typeof article.source === "string" && (
                  <span className="absolute top-0 right-0 bg-kisan-green text-white text-xs px-2 py-1 rounded-bl-md">{article.source}</span>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2">{article.title}</CardTitle>
                {article.publishedAt && <p className="text-xs text-gray-500">{formatDate(article.publishedAt)}</p>}
              </CardHeader>
              <CardContent className="pb-2">
              <p className="text-gray-600">
  {expanded[index] 
    ? article.description 
    : (article.description && article.description.length > 100 
        ? `${article.description.slice(0, 100)}...` 
        : article.description)}
</p>

              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-0">
                <Button variant="outline" onClick={() => toggleReadMore(index)} className="w-full border-kisan-green text-kisan-green hover:bg-kisan-green hover:text-white transition-colors" disabled={!article.description || article.description.length <= 100}>
                  {expanded[index] ? <>Read Less <ChevronUp className="ml-1 h-4 w-4" /></> : <>Read More <ChevronDown className="ml-1 h-4 w-4" /></>}
                </Button>
                <Button variant="default" className="w-full bg-kisan-earth hover:bg-kisan-earth-light" asChild>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">Visit Source <ExternalLink className="ml-1 h-4 w-4" /></a>
                </Button>
              </CardFooter>
            </Card>
          )) : (
            <div className="col-span-3 flex flex-col items-center justify-center p-12 text-center">
              <Sprout className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-lg">No news articles available at this time.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for agricultural updates.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default News;