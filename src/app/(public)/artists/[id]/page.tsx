import ArtistDetailClient from "./ArtistDetailClient";

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArtistDetailClient id={id} />;
}
