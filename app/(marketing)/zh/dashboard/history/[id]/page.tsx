import { HistoryDetail } from "@/components/pain-point-history/history-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "分析详情 - Lingtrue",
  description: "查看痛点分析详细结果",
};

export default function ZhHistoryDetailPage({ params }: { params: { id: string } }) {
  return <HistoryDetail id={params.id} />;
}
