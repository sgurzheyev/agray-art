export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24">
      <div className="h-3 w-24 bg-gold/20" />
      <div className="mt-6 h-10 w-64 bg-ivory/10" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="aspect-[4/5] bg-ivory/5" />
        <div className="aspect-[4/5] bg-ivory/5" />
        <div className="aspect-[4/5] bg-ivory/5" />
      </div>
    </div>
  );
}
