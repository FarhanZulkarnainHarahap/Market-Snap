import { TrackingDetailPage } from "@/components/snap/TrackingPages";

export default async function CustomerTrackingDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <TrackingDetailPage orderId={orderId} />;
}
