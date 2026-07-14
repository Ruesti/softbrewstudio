export default function BlogProse({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-invert max-w-none
      prose-headings:tracking-tight
      prose-h2:mt-10 prose-h2:mb-4
      prose-p:leading-relaxed prose-p:text-white/85
      prose-a:text-softbrew-blue hover:prose-a:underline
      prose-strong:text-white
      prose-code:text-softbrew-blue prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10">
      {children}
    </div>
  );
}
