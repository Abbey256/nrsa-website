import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Media } from "@shared/schema";

export default function Media() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data: mediaItems = [], isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  // Dynamically extract unique categories from media items
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(mediaItems.map(item => item.category)));
    return ["All", ...uniqueCategories];
  }, [mediaItems]);

  const filteredMedia =
    selectedCategory === "All"
      ? mediaItems
      : mediaItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Media Gallery</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Explore photos from training, achievements, events, and announcements.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
                data-testid={`button-category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading media...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No media items in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:elevate active:elevate-2 cursor-pointer transition-all"
                  data-testid={`card-media-${item.id}`}
                >
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-muted-foreground" />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}