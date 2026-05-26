import { StarRating } from "@/components/ui/Star";

const testimonials = [
  {
    id: 1,
    name: "Nuzhat Ahmed",
    location: "Dhaka",
    rating: 5,
    text: "My Dyson Airwrap arrived in perfect condition. The whole process was transparent — I could track the shipment all the way. Highly recommend SBD.",
    product: "Dyson Airwrap",
  },
  {
    id: 2,
    name: "Rafiq Islam",
    location: "Chittagong",
    rating: 5,
    text: "Ordered AirPods Pro through a custom quote. Got them in 3 weeks at a price much better than local shops. Authentic Apple product, sealed box.",
    product: "Apple AirPods Pro",
  },
  {
    id: 3,
    name: "Sadia Rahman",
    location: "Sylhet",
    rating: 5,
    text: "Pre-ordered the SK-II essence — it arrived exactly on the ETA shown. The duty breakdown was clear, no hidden fees at the door. Will order again.",
    product: "SK-II Essence",
  },
  {
    id: 4,
    name: "Tanvir Hossain",
    location: "Dhaka",
    rating: 4,
    text: "Great service. The WhatsApp support team responded quickly when I had a question about my order. Packaging was solid, product was exactly as described.",
    product: "Nike Air Max",
  },
];

const labels = {
  heading: "What customers say",
  sub: "Thousands of Bangladeshis shop global brands through SBD every month.",
};

export function Testimonials() {
  return (
    <section className="bg-bg border-t border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-[28px] lg:text-[36px] font-semibold text-ink">{labels.heading}</h2>
          <p className="mt-3 text-[15px] text-muted">{labels.sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-paper rounded-2xl border border-line p-5 flex flex-col gap-3"
            >
              <StarRating rating={t.rating} size={14} />
              <p className="text-[14px] text-ink leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="border-t border-line pt-3">
                <p className="text-[13px] font-medium text-ink">{t.name}</p>
                <p className="text-[12px] text-muted">{t.location} · {t.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
