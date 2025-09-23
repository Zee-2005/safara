import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Send, 
  ArrowLeft,
  MessageSquare,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  CheckCircle
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  location: string;
  rating: number;
  category: string;
  comment: string;
  timestamp: Date;
  status: 'submitted' | 'reviewed';
}

interface FeedbackSystemProps {
  onBack: () => void;
}

export default function FeedbackSystem({ onBack }: FeedbackSystemProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Mock previous feedback
  const [previousFeedback] = useState<FeedbackItem[]>([
    {
      id: '1',
      location: 'Baga Beach, Goa',
      rating: 5,
      category: 'Safety',
      comment: 'Well-lit area with good security. Felt safe throughout the visit.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'reviewed'
    },
    {
      id: '2', 
      location: 'Old Goa Churches',
      rating: 4,
      category: 'Culture',
      comment: 'Beautiful heritage site. Could use better crowd management.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: 'submitted'
    }
  ]);

  const categories = [
    { id: 'safety', name: 'Safety & Security', icon: '🛡️' },
    { id: 'culture', name: 'Cultural Experience', icon: '🏛️' },
    { id: 'service', name: 'Service Quality', icon: '👥' },
    { id: 'accessibility', name: 'Accessibility', icon: '♿' },
    { id: 'cleanliness', name: 'Cleanliness', icon: '🧹' },
    { id: 'transport', name: 'Transportation', icon: '🚗' }
  ];

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    console.log('Rating selected:', selectedRating);
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
    console.log('Category selected:', categoryId);
  };

  const handleSubmit = async () => {
    if (!rating || !category || !comment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      console.log('Feedback submitted:', {
        rating,
        category,
        comment,
        location: 'Current Location', // Would be actual location
        timestamp: new Date()
      });
      
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Reset form after success
      setTimeout(() => {
        setRating(0);
        setComment('');
        setCategory('');
        setShowSuccess(false);
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="p-6 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-safety-green rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-4">
            Your feedback helps make SaFara better for everyone. You've earned 10 safety points!
          </p>
          <Badge className="bg-safety-green text-white">
            +10 Safety Points
          </Badge>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Share Feedback</h1>
            <p className="text-sm text-muted-foreground">Help improve safety for other travelers</p>
          </div>
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Location */}
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Providing feedback for: <strong>Current Location</strong></span>
          </div>
        </Card>

        {/* Rating Section */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Overall Experience</h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                className="transition-colors"
                data-testid={`star-${star}`}
              >
                <Star 
                  className={`w-8 h-8 ${
                    star <= rating 
                      ? 'fill-current text-yellow-500' 
                      : 'text-muted-foreground hover:text-yellow-400'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {rating === 0 && 'Tap stars to rate your experience'}
            {rating === 1 && 'Poor - Major safety concerns'}
            {rating === 2 && 'Below Average - Some safety issues'}
            {rating === 3 && 'Average - Acceptable safety'}
            {rating === 4 && 'Good - Generally safe and well-maintained'}
            {rating === 5 && 'Excellent - Outstanding safety and experience'}
          </div>
        </Card>

        {/* Category Selection */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Category</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={category === cat.id ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-center text-center"
                onClick={() => handleCategorySelect(cat.id)}
                data-testid={`category-${cat.id}`}
              >
                <span className="text-lg mb-1">{cat.icon}</span>
                <span className="text-xs">{cat.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Comment Section */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Additional Comments</h3>
          <Textarea
            placeholder="Share specific details about your experience, safety observations, or suggestions for improvement..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-24"
            data-testid="textarea-comment"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {comment.length}/500 characters
            </span>
            <Badge variant="outline" className="text-xs">Optional</Badge>
          </div>
        </Card>

        {/* Submit Button */}
        <Button 
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={!rating || !category || !comment.trim() || isSubmitting}
          data-testid="button-submit"
        >
          {isSubmitting ? (
            <>
              <Send className="w-5 h-5 mr-2 animate-pulse" />
              Submitting Feedback...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>

        {/* Previous Feedback */}
        {previousFeedback.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Your Recent Feedback</h3>
            {previousFeedback.map((feedback) => (
              <Card key={feedback.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-sm">{feedback.location}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < feedback.rating 
                                ? 'fill-current text-yellow-500' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feedback.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge 
                    variant={feedback.status === 'reviewed' ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {feedback.status === 'reviewed' ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Reviewed
                      </>
                    ) : (
                      'Pending'
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {feedback.comment}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  {feedback.timestamp.toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <ThumbsUp className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Your Voice Matters</h4>
              <p className="text-xs text-muted-foreground">
                Every feedback helps create a safer travel experience for the community. 
                Constructive feedback earns you safety points and helps improve local services.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}