import Image from 'next/image'
import { Inter } from 'next/font/google'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import {faker} from '@faker-js/faker';

import Data from "./data.json"

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const inter = Inter({ subsets: ['latin'] })
export const data ={
  datasets: [{
    label: 'Harvard Art Musuem',
    data: Data['points'].map((point, i) => {
      return {
        x: point[0],
        y: point[1],
        size: 1,
        desc: Data['displays'][i][1],
        title: Data['displays'][i][0],
        url: Data['displays'][i][2],
        image: Data['displays'][i][3],
      }
    })
  }
    
  ]
} 

console.log(data)
// export const data = {
//   datasets: [
//     {
//       label: 'A dataset',
//       data: Array.from({ length: 100 }, () => ({
//         x: faker.datatype.number({ min: -100, max: 100 }),
//         y: faker.datatype.number({ min: -100, max: 100 }),
//       })),
//       backgroundColor: 'rgba(255, 99, 132, 1)',
//     },
//   ],
// };

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
    <h2>Contextual Display Cluster</h2>
    <Scatter
    data={data}
    />
        
    </main>
  )
}
