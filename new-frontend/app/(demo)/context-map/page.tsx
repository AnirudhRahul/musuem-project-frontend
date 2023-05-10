'use client'
import Header from "@/components/ui/header"
import DataImport from "../data.json"
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter, getDatasetAtEvent, getElementsAtEvent } from 'react-chartjs-2';
import  React from 'react';
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type DataType = {
  points: number[][];
  displays: string;
  vectors: number;
  years: number[];
};
const Data = DataImport as DataType;

// export const metadata = {
//   title: 'Museum Contextual Map',
//   description: 'A Contextual Map of displays from the Harvard Museum API',
// }

export const data ={
  datasets: [{
    label: 'Harvard Art Musuem',
    borderColor: '#36A2EB',
    backgroundColor: '#9BD0F5',
    data: Data.points.map((point, i) => {
      return {
        x: point[0],
        y: point[1],
        desc: Data['displays'][i][1],
        title: Data['displays'][i][0],
        url: Data['displays'][i][2],
        image: Data['displays'][i][3],
      }
    })
  }
    
  ]
} 


const chartRef = React.createRef();
const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: any, args: any, options: any) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

const options = {
  plugins: {
    customCanvasBackgroundColor: {
      color: 'white',
    },
    tooltip: {
      callbacks: {
        label: (dpoint: any) => {
          const index = dpoint.dataIndex
          return dpoint.dataset.data[index].title
        },
      }
    }
  },
  backgroundColor: 'rgba(52, 52, 52, 0.8)',

  pointRadius: 5,
  pointHoverRadius: 4
}
const onClick = (event: any) => {
  if (getElementsAtEvent(chartRef.current, event).length == 0) {
    return
  }

  const ind = getElementsAtEvent(chartRef.current, event)[0].index
  const url = Data['displays'][ind][2]
  window.open(url, '_blank');

}

export default function ContextMap() {
  return (
    <section className="bg-gradient-to-b from-gray-100 to-white">
      <Header/>

      <main
        className={`flex min-h-screen flex-col items-center  p-24`}
      >     

          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mb-4">Contextual Museum Map</h1>
            <p className="text-xl text-gray-600">
            Leveraging contextual embeddings, our visualization provides a practical birds-eye view of display performance at Harvard Art Museum, enabling swift assessment of different categories using size and color cues.

            </p>
          </div>

          <Scatter
          ref={chartRef}
          options={options}
          plugins={[plugin]}
          data={data}
          onClick={onClick}
          />
              
      </main>
    
    </section>
  )
}
