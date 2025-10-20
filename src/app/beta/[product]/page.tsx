type Props = { params: { product: string } };

export default function BetaPage({ params }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <h1 className="text-3xl font-semibold capitalize">{params.product} Beta</h1>
      <p className="text-white/70">
        Hier kommen später Downloads, Changelogs oder Test-Infos für {params.product}.
      </p>
    </section>
  );
}
