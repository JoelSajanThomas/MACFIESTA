import EventDetailClient from "./EventDetailClient";

export async function generateStaticParams() {
  return [
    { slug: "urumi-gaming" },
    { slug: "dusk-n-dawn" },
    { slug: "byte-and-code" }
  ];
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <EventDetailClient params={params} />;
}
