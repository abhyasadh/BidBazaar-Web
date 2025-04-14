import { useEffect, useRef } from "react";

function useProductObserver(productId, socket) {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        socket.emit("join-room", productId);
      }
    });

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [productId, socket]);

  return ref;
}

export default useProductObserver;
