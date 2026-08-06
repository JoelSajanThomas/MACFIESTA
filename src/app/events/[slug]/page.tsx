import EventDetailClient from "./EventDetailClient";

export async function generateStaticParams() {
  return [
    { slug: "urumi-gaming" },
    { slug: "dusk-n-dawn" },
    { slug: "byte-and-code" },
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EventDetailClient slug={slug} />;
}


