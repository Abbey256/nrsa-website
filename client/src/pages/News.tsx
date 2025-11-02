import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { News } from "@shared/schema";

export default function News() {
  const [, navigate] = useLocation();
  const { data: newsItems = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Latest News</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Stay updated with the latest news, achievements, and developments from the Nigeria Rope Skipping community.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading news...</p>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No news articles available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((item) => (
              <Card 
                key={item.id} 
                className="hover-elevate active-elevate-2 cursor-pointer transition-all border-t-4 border-t-primary h-full flex flex-col"
                data-testid={`card-news-${item.id}`}
                onClick={() => navigate(`/news/${item.id}`)}
              >
                {item.imageUrl && (
                  <div className="w-full h-48 bg-muted overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader className="flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    {item.isFeatured && (
                      <Badge className="bg-destructive text-destructive-foreground">Featured</Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(item.publishedAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{item.excerpt}</p>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
