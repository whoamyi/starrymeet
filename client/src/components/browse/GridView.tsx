import { Link } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

interface Celebrity {
  id: string;
  name: string;
  slug: string;
  category: string;
  profile_image: string | null;
  price_per_hour: number;
}

interface GridViewProps {
  celebrities: Celebrity[];
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  perPage: number;
  setPerPage: Dispatch<SetStateAction<number>>;
}

export const GridView = ({
  celebrities,
  currentPage,
  setCurrentPage,
  totalPages,
  perPage,
  setPerPage,
}: GridViewProps) => {
  return (
    <div className="grid-section">
      <div className="grid">
        {celebrities.map((celeb) => (
          <Link key={celeb.id} to={`/celebrity/${celeb.slug}`} className="grid-card">
            <img
              src={
                celeb.profile_image ||
                'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=500&fit=crop'
              }
              alt={celeb.name}
            />
            <div className="card-content">
              <h3>{celeb.name}</h3>
              <p className="category">{celeb.category}</p>
              <p className="price">From ${Math.round(celeb.price_per_hour).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="page-numbers">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <button
          className="page-btn"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="per-page">
        <span>Show:</span>
        <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
        <span>per page</span>
      </div>
    </div>
  );
};
