import { PanelSkeleton } from "@/components/snap/SnapCommon";

export default function CustomerLoading() {
  return (
    <main className="snap-section">
      <PanelSkeleton rows={6} />
    </main>
  );
}
