import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scroll pagination
 * @param {Function} loadMore - Function to load more data
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {boolean} loading - Whether currently loading
 * @param {number} threshold - Distance from bottom to trigger load (default: 100px)
 */
export const useInfiniteScroll = (loadMore, hasMore, loading, threshold = 100) => {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(loadMore);

  // Update ref when loadMore changes
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreRef.current();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  return lastElementRef;
};
