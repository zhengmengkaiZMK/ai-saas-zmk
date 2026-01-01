import { HistoryDetail } from "@/components/pain-point-history/history-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysis Detail - Lingtrue",
  description: "View detailed pain point analysis results",
};

export default async function HistoryDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <HistoryDetail id={id} />;
}
