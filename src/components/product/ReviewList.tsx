import { StarRating } from "@/components/ui/Star";

type Review = {
  id: number;
  author: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
};

const mockReviews: Review[] = [
  {
    id: 1,
    author: "Nuzhat A.",
    location: "Dhaka",
    rating: 5,
    date: "15 May 2026",
    text: "Absolutely worth every taka. Arrived in sealed packaging, exactly as shown on the official website. SBD's shipment tracking kept me updated the whole time.",
    verified: true,
  },
  {
    id: 2,
    author: "Rafiq I.",
    location: "Chittagong",
    rating: 5,
    date: "10 May 2026",
    text: "Fast delivery and the product is 100% genuine. I compared serial numbers on the manufacturer's website. Very happy with the whole process.",
    verified: true,
  },
  {
    id: 3,
    author: "Sadia R.",
    location: "Sylhet",
    rating: 4,
    date: "8 May 2026",
    text: "Great product and good service. Shipping took exactly as long as predicted. Would be 5 stars if the packaging was slightly more cushioned.",
    verified: true,
  },
  {
    id: 4,
    author: "Tanvir H.",
    location: "Dhaka",
    rating: 5,
    date: "1 May 2026",
    text: "This is my third order from SBD. Every time the product is authentic and the pricing is transparent. The WhatsApp support team is very responsive.",
    verified: true,
  },
];

const labels = {
  heading: "Customer reviews",
  verified: "Verified purchase",
};

export function ReviewList() {
  return (
    <div>
      <h3 className="text-[20px] font-semibold text-ink mb-5">{labels.heading}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockReviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <p className="text-[13px] font-semibold text-ink">{r.author}</p>
                <p className="text-[12px] text-muted">{r.location}</p>
              </div>
              <StarRating rating={r.rating} size={13} />
            </div>
            <p className="text-[13px] text-ink leading-relaxed">{r.text}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-muted">{r.date}</span>
              {r.verified && (
                <span className="text-[11px] font-medium" style={{ color: "var(--ok)" }}>
                  {labels.verified}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
