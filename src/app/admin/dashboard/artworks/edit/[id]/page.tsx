import EditArtworkClient from "./EditArtworkClient";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditArtworkClient id={id} />;
}
