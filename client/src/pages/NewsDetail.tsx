import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, ArrowLeft, Calendar } from "lucide-react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  isFeatured: boolean;
  publishedAt: string;
}

export default function NewsDetail() {
  const [match, params] = useRoute("/news/:id");
  const [, navigate] = useLocation();
  const newsId = params?.id || null;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!newsId) {
      setIsLoading(false);
      setError("Invalid news ID provided in the URL.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const fetchArticle = async () => {
      try {
        const apiUrl = `/api/news/${newsId}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data) {
          setArticle(data);
        } else {
          setError(`News article with ID ${newsId} not found.`);
        }
      } catch (e) {
        console.error("Error fetching news article:", e);
        setError("Could not load news article. Please check the API connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [newsId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen -mt-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="ml-4 text-xl text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center p-20 bg-gray-50">
        <h1 className="text-4xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-xl text-gray-600">{error || "News article not found."}</p>
        <Button onClick={() => navigate("/news")} className="mt-8 bg-primary hover:bg-primary/90">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} - NRSA News</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>
      
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <Button 
            variant="ghost" 
            onClick={() => navigate("/news")} 
            className="mb-8 text-primary hover:bg-primary/10 transition-all duration-300 font-semibold"
            data-testid="button-back-to-news"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
          </Button>

          <Card className="p-8 md:p-12 shadow-2xl rounded-xl">
            {article.imageUrl && (
              <div className="w-full h-96 mb-8 rounded-lg overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                  data-testid="img-news-hero"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              {article.isFeatured && (
                <Badge className="bg-destructive text-destructive-foreground text-sm px-3 py-1">
                  Featured
                </Badge>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {format(new Date(article.publishedAt), "MMMM dd, yyyy")}
                </span>
              </div>
            </div>

            <h1 
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6"
              data-testid="text-news-title"
            >
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 italic border-l-4 border-primary pl-6">
              {article.excerpt}
            </p>

            <div className="prose prose-lg max-w-none text-gray-700">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Button 
                onClick={() => navigate("/news")} 
                className="bg-primary hover:bg-primary/90"
                data-testid="button-back-bottom"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to All News
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
