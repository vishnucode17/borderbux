import Image from 'next/image'
import Navbar from '@/components/navbar'
import HeroSection from '@/components/hero-section'
import RatingsBanner from '@/components/RatingsBanner'
import FAQ from '@/components/faq'
import Footer from '@/components/footer'
export default function Home() {
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <RatingsBanner/>
      <FAQ/>
      <Footer/>
    </>
  )
}
