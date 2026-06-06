import ArtworkDetailClient from "@/components/ArtworkDetailClient";

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArtworkDetailClient slug={slug} />;
}
