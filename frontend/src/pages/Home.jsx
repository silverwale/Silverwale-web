import React from 'react'
import Header from '../components/Header'
import ImageGallery from '../components/ImageGallery'
import CelebrationSection from '../components/CelebrationSection'
import MostLoved from '../components/MostLoved'
import BestSellers from '../components/BestSellers'
import Craftsmanship from '../components/Craftsmanship'
import GiftSection from '../components/GiftSection'
import KGNSelections from '../components/KGNSelections'
import KGNAssurance from '../components/KGNAssurance'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

import TheEdit from '../components/TheEdit'

function Home() {
  return (
    <>
      <Header />
      <div className="mb-4 overflow-hidden">
        <ImageGallery />
      </div>
      {/* <TheEdit /> */}
      <CelebrationSection />
      <MostLoved />
      <BestSellers />
      <Craftsmanship />
      <GiftSection />
      <KGNSelections />
      <KGNAssurance />
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

export default Home