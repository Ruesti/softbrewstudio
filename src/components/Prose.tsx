// src/components/Prose.tsx
export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-neutral max-w-none
      prose-h2:mt-8 prose-h2:mb-3
      prose-p:leading-relaxed
      prose-a:text-softbrew-blue hover:prose-a:underline">
      {children}
    </div>
  );
}
