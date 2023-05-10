'use client'
import Header from "@/components/ui/header"
import DataImport from "../data.json"
import '../chart.css'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Ticks,
} from 'chart.js';
import { Scatter, getDatasetAtEvent, getElementsAtEvent } from 'react-chartjs-2';
import  React from 'react';
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);


type DataType = {
  points: number[][];
  displays: string[][];
  vector: number[][];
  years: number[];
};
const Data = DataImport as DataType;

// export const metadata = {
//   title: 'Museum Contextual Map',
//   description: 'A Contextual Map of displays from the Harvard Museum API',
// }


function randInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const perf = Data.points.map((point, i) => randInt(1, 10))

const data ={
  datasets: [{
    label: 'Harvard Art Musuem',
    borderColor: '#36A2EB',
    pointRadius: perf.map((p) => 2 + Math.log2(p)),
    pointHoverRadius: perf.map((p) => 2 + Math.log2(p)),
    backgroundColor: '#9BD0F5',
    data: Data.points.map((point, i) => {
      return {
        x: point[0],
        y: point[1],
        desc: Data.displays[i][1],
        title: Data.displays[i][0],
        url: Data.displays[i][2],
        image: Data.displays[i][3],
        perf: perf[i]
      }
    })
  }
    
  ]
} 


const chartRef = React.createRef();
const plugin = {
  id: 'bgcolor',
  beforeDatasetsDraw: (chart: any, args: any, options: any) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Scatter Plot',
    },
    tooltip: {
      callbacks: {
        label: (dpoint: any) => {
          const index = dpoint.dataIndex
          return dpoint.dataset.data[index].title
        },
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        color: 'white',
        font: {
          size: 20
        }
      }
    },

    zoom: {
      pan: {
        enabled: true,
        mode: 'xy',
        
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: 'xy',
      }
    }

  },


  scales: {
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.5)',
        tickLength: 0
      },
      ticks: {
        display: false,
      },

    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.5)',
        tickLength: 0
      },
      ticks: {
        display: false,
      },
    }
  },


}


const onClick = (event: any) => {
  if (!chartRef){
    return
  }
  if (getElementsAtEvent(chartRef.current, event).length == 0) {
    return
  }

  const ind = getElementsAtEvent(chartRef.current, event)[0].index
  const url = Data.displays[ind][2]
  window.open(url, '_blank');

}

export default function ContextMap() {
  React.useEffect(() => {
    if (typeof window !== "undefined")
      import("chartjs-plugin-zoom").then((plugin) => {
        ChartJS.register(plugin.default);
      });
    }, []);
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
          
          
          <div className="floating-card">
            <Scatter
              ref={chartRef}
              options={options}
              data={data}
              onClick={onClick}
              plugins={[plugin]}
              />
          </div>
                
        </main>
      
      </section>
    )
  }
