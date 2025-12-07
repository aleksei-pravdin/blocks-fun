<template>
  <div class="h-[140px]  relative">
    <canvas ref="chartCanvas" class="bg-transparent"></canvas>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';

interface Props {
  data?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  data: () => Array.from({ length: 60 }, () => Math.random() * 100),
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: any = null;
let ChartLib: any = null;

async function initChart() {
  if (!process.client || !chartCanvas.value) return;

  try {
    // Dynamic import only on client
    if (!ChartLib) {
      const chartJs = await import('chart.js/auto');
      ChartLib = chartJs.default || chartJs.Chart;
    }

    if (!ChartLib) return;

    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) return;

    // Создаем кастомные labels для оси X
    const dataLength = props.data?.length || 60;
    const xLabels = Array.from({ length: dataLength }, (_, i) => {
      const positions = [0, Math.floor(dataLength * 0.2), Math.floor(dataLength * 0.4), Math.floor(dataLength * 0.6), Math.floor(dataLength * 0.8), dataLength - 1];
      const labelValues = ['2', '4', '6', '8', '10', '12'];
      if (positions.includes(i)) {
        return labelValues[positions.indexOf(i)];
      }
      return '';
    });

    chartInstance = new ChartLib(ctx, {
      type: 'bar',
      data: {
        labels: xLabels,
        datasets: [
          {
            label: 'Volume',
            data: props.data,
            backgroundColor: '#FF4B01',
            borderRadius: {
              topLeft: 2,
              topRight: 2,
              bottomLeft: 0,
              bottomRight: 0,
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          x: {
            display: true,
            position: 'bottom',
            grid: {
              display: false,
            },
            ticks: {
              display: true,
              color: '#44484F',
              font: {
                family: 'Rajdhani',
                size: 16,
                weight: 'bold',
              },
              maxTicksLimit: 30,
              maxRotation: 0,
              minRotation: 0,
            },
            border: {
              display: false,
            },
            categoryPercentage: 1.0,
            barPercentage: 1.0,
          },
          y: {
            display: false,
            beginAtZero: true,
            max: 100,
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
        backgroundColor: 'transparent',
        layout: {
          padding: {
            bottom: 20,
          },
        },
      },
    });
  } catch (error) {
    console.error('Chart initialization error:', error);
  }
}

onMounted(async () => {
  await nextTick();
  if (process.client) {
    await initChart();
  }
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});

watch(() => props.data, async () => {
  if (chartInstance && props.data) {
    chartInstance.data.datasets[0].data = props.data;
    chartInstance.update('none');
  } else if (process.client && chartCanvas.value) {
    await initChart();
  }
}, { deep: true });
</script>

