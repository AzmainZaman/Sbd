const labels = {
  heading: "Customer reviews",
  empty: "No reviews yet",
  emptyNote: "Be the first to review this product after your order is delivered.",
};

export function ReviewList() {
  return (
    <div>
      <h3 className="text-[20px] font-semibold text-ink mb-5">{labels.heading}</h3>
      <div className="rounded-2xl border border-line bg-bg px-6 py-10 text-center">
        <p className="text-[15px] font-medium text-ink mb-1">{labels.empty}</p>
        <p className="text-[13px] text-muted">{labels.emptyNote}</p>
      </div>
    </div>
  );
}
