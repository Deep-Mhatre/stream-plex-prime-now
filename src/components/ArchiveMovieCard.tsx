
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface ArchiveMovieCardProps {
  id: string;
  title: string;
  year: string;
  thumbnailUrl: string | null;
}

const ArchiveMovieCard: React.FC<ArchiveMovieCardProps> = ({ id, title, year, thumbnailUrl }) => {
  const defaultThumbnail = 'https://via.placeholder.com/300x200?text=No+Preview';
  const imageUrl = thumbnailUrl || defaultThumbnail;

  return (
    <Link to={`/archive/${id}`} className="block">
      <Card className="h-full overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
        <div className="aspect-video bg-muted">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // If image fails to load, replace with default
              (e.target as HTMLImageElement).src = defaultThumbnail;
            }}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{year}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArchiveMovieCard;
