import { HistoryDetail } from "@/components/pain-point-history/history-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysis Detail - Lingtrue",
  description: "View detailed pain point analysis results",
};

export default function HistoryDetailPage({ params }: { params: { id: string } }) {
  return <HistoryDetail id={params.id} />;
}
