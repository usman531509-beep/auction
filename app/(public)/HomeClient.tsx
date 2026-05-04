"use client";
import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import FeaturedCars from "@/components/home/FeaturedCars";

type CarItem = {
  _id: string;
  title: string;
  brand: string;
  year: number;
  images: string[];
  price: number;
  status: string;
};

export default function HomeClient({
  featured,
  latest,
}: {
  featured: CarItem[];
  latest: CarItem[];
}) {
  return (
    <div>
      <HeroSection />
      <BrandsSection />
      {featured.length > 0 && <FeaturedCars cars={featured} title="Featured" highlight="Cars" />}
      <FeaturedCars cars={latest} title="Latest" highlight="Arrivals" />
    </div>
  );
}
