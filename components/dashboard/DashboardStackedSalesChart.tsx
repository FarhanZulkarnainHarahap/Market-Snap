"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { rupiah } from "../../lib/format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type ChartPoint = {
  label: string;
  values: number[];
};

type DashboardStackedSalesChartProps = {
  branches: string[];
  points: ChartPoint[];
};

const colors = ["#0d642f", "#43a047", "#8bc34a", "#f7b731", "#2f80ed", "#ef6c00"];

export function DashboardStackedSalesChart({ branches, points }: DashboardStackedSalesChartProps) {
  const labels = points.map((point) => point.label);
  const data = {
    labels,
    datasets: branches.map((branch, index) => ({
      backgroundColor: colors[index % colors.length],
      borderRadius: 6,
      data: points.map((point) => point.values[index] ?? 0),
      label: branch
    }))
  };

  return (
    <Bar
      data={data}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { boxWidth: 12, color: "#173321", font: { weight: 700 } }, position: "bottom" },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: ${rupiah(Number(item.raw ?? 0))}`
            }
          }
        },
        responsive: true,
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: "#66766b" } },
          y: {
            beginAtZero: true,
            stacked: true,
            ticks: { callback: (value) => rupiah(Number(value)), color: "#66766b" }
          }
        }
      }}
    />
  );
}
