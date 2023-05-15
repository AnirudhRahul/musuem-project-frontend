export const metadata = {
  title: 'Museum Demo',
  description: 'Musuem Demo powered by AI',
}

import Hero from '@/components/hero'
import Features from '@/components/features'
import FeaturesBlocks from '@/components/features-blocks'


export default function Home() {
  return (
    <>
     <meta name="viewport" content="width=1024"/>
      <Hero />
      <Features />
      <FeaturesBlocks />
    </>
  )
}
