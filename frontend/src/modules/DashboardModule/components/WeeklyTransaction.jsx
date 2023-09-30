import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { STACKED_BAR_CHART } from '@/utils/dummy.data';

export default function WeeklyTransaction({ factoriesFilter, productsFilter, subProductsFilter }) {
  const chartRef = useRef();

  useEffect(() => {
    initChart();
  }, [factoriesFilter, subProductsFilter]);

  function initChart() {
    const ctx = document.getElementById('weekly-transaction-chart').getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    let dataSource = JSON.parse(JSON.stringify(STACKED_BAR_CHART));

    if (factoriesFilter && factoriesFilter.length) {
      const indexes = factoriesFilter.map((fl) => dataSource.labels.indexOf(fl));
      dataSource.labels = dataSource.labels.filter((label, index) => indexes.includes(index));
      dataSource.datasets = dataSource.datasets.map((ds) => {
        ds.data = ds.data.filter((label, index) => indexes.includes(index));
        return ds;
      });
    }
    if (subProductsFilter && subProductsFilter.length) {
      // if (productsFilter.length)
      //   dataSource = dataSource.filter((dt) => productsFilter.includes(dt.name.toUpperCase()));

      dataSource.datasets = dataSource.datasets.filter((dl) =>
        subProductsFilter.includes(dl.label)
      );
    }
    const chart = new Chart(ctx, {
      type: 'bar',
      data: dataSource,
      options: {
        plugins: {
          //   title: {
          //     display: true,
          //     text: 'Weekly Transaction',
          //   },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label} ${context.parsed.y} Lbs`;
              },
            },
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Factories',
              font: {
                size: 16,
                weight: 700,
              },
            },
            ticks: {
              font: {
                size: 16,
                weight: 700,
              },
            },
          },
          y: {
            stacked: true,
            labels: 'LBS',
            title: {
              display: true,
              text: 'LBS',
              font: {
                size: 16,
                weight: 700,
              },
            },
            ticks: {
              font: {
                size: 14,
              },
            },
          },
        },
      },
    });

    chartRef.current = chart;
  }

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <h4 style={{ marginBottom: '1rem' }}>Weekly Transaction 23-30 September 2023</h4>
      <canvas id="weekly-transaction-chart"></canvas>
    </div>
  );
}
