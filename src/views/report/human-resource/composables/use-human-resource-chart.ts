import { shallowRef, markRaw, watch } from 'vue'
import type { ShallowRef, Ref } from 'vue'
import { MONTHS } from '../constants'
import type { ChartConfig } from '../models/human-resource.model'

export interface ChartDataState {
  startInYear: number[]
  offInYear: number[]
  totalInYear: number[]
  percentInYear: number[]
}

export function useHumanResourceChart(
  chartData: Ref<ChartDataState>,
  year: Ref<string | null>,
) {
  const createChartConfig = (): ChartConfig => {
    return markRaw({
      type: 'mixed',
      title: {
        fontSize: 20,
        adjustLayout: true,
        flat: true,
      },
      gui: {
        contextMenu: {
          empty: true,
        },
      },
      globals: {
        fontFamily: 'SVN-Gilroy',
      },
      plot: {
        tooltip: {
          text: '%t: <b>%v</b> %data-percent',
          padding: '10%',
          borderRadius: '5px',
          sticky: true,
          timeout: 5000,
        },
        animation: {
          effect: 'ANIMATION_FADE_IN',
          method: 'ANIMATION_LINEAR',
          sequence: 'ANIMATION_BY_PLOT_AND_NODE',
          speed: 275,
        },
      },
      legend: {
        'toggle-action': 'hide',
        header: {
          text: 'Ghi chú',
        },
        item: {
          cursor: 'pointer',
        },
        draggable: true,
        x: '8%',
        y: 0,
      },
      scalableYaxis: {
        scalable: true,
        chartid: 'humanResourceChart',
      },
      scaleX: {
        zooming: false,
        label: {
          text: `Tháng ${new Date().getMonth() + 1}`,
          fontFamily: 'SVN-Gilroy',
          fontSize: 16,
        },
        maxItems: 12,
        labels: MONTHS,
      },
      scaleY: {
        zooming: false,
        maxItems: 10,
        format: '%v',
        'thousands-separator': '.',
        label: {
          text: 'Số nhân sự',
          fontFamily: 'SVN-Gilroy',
          fontSize: 16,
        },
        lineColor: '#e53935',
      },
      scaleY2: {
        label: {
          text: 'Tỷ lệ nghỉ việc',
          fontFamily: 'SVN-Gilroy',
          fontSize: 16,
        },
        maxItems: 10,
      },
      plotarea: {
        margin: 'dynamic',
      },
      series: [
        {
          type: 'bar',
          values: [...chartData.value.startInYear],
          'background-color': '#472f92',
          'thousands-separator': '.',
          text: 'Tuyển thêm',
          'data-percent': 'nhân sự',
        },
        {
          type: 'bar',
          values: [...chartData.value.offInYear],
          'background-color': '#9d9d9d',
          'thousands-separator': '.',
          text: 'Nghỉ việc',
          'data-percent': 'nhân sự',
        },
        {
          type: 'bar',
          values: [...chartData.value.totalInYear],
          'background-color': '#f39c12',
          'thousands-separator': '.',
          text: 'Tổng',
          'data-percent': 'nhân sự',
        },
        {
          type: 'line',
          values: [...chartData.value.percentInYear],
          lineColor: '#e53935',
          marker: {
            backgroundColor: '#e53935',
          },
          scales: 'scale-x, scale-y-2',
          text: 'Tỷ lệ nghỉ việc',
          'data-percent': '%',
        },
      ],
    } as ChartConfig)
  }

  const chartConfig: ShallowRef<ChartConfig> = shallowRef(createChartConfig())

  // Update chart config khi chartData thay đổi
  watch(chartData, () => {
    chartConfig.value = createChartConfig()
  }, { deep: true })

  return {
    chartConfig,
  }
}
