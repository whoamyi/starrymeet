interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  meeting_type?: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
}

export const ReviewsSection = ({ reviews, averageRating }: ReviewsSectionProps) => {
  if (!reviews || reviews.length === 0) {
    return (
      <section className="reviews-section-new">
        <div className="reviews-container-new">
          <div className="section-header-row">
            <h2 className="section-title">What Others Are Saying</h2>
            <div className="reviews-summary">
              <span className="summary-rating">⭐ {averageRating.toFixed(1)}</span>
              <span className="summary-count">(0 reviews)</span>
            </div>
          </div>
          <div className="reviews-grid-new">
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '40px' }}>
              No reviews yet. Be the first to leave a review!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="reviews-section-new">
      <div className="reviews-container-new">
        <div className="section-header-row">
          <h2 className="section-title">What Others Are Saying</h2>
          <div className="reviews-summary">
            <span className="summary-rating">⭐ {averageRating.toFixed(1)}</span>
            <span className="summary-count">({reviews.length} reviews)</span>
          </div>
        </div>

        <div className="reviews-grid-new">
          {reviews.map((review) => (
            <div key={review.id} className="review-card-new">
              <div className="review-header-new">
                <div className="reviewer-info-new">
                  <div className="reviewer-avatar-new">
                    {review.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="reviewer-name-new">{review.user_name}</h4>
                    <p className="review-date-new">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="review-rating-new">
                  {'⭐'.repeat(review.rating)}
                </div>
              </div>
              <p className="review-comment-new">{review.comment}</p>
              {review.meeting_type && (
                <span className="review-badge-new">{review.meeting_type}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
