import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import TruckLocationClient from "./TruckLocationClient";

export const metadata: Metadata = {
  title: "Find Our Truck | Crown Majestic Kitchen",
  description: "Track down Crown Majestic Kitchen food truck's current location. Get directions and see our weekly schedule for gourmet street food near you.",
  openGraph: {
    title: "Find Our Truck | Crown Majestic Kitchen",
    description: "Track down Crown Majestic Kitchen food truck's current location. Get directions and see our weekly schedule.",
    type: "website",
  },
};

export default function Truck() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  return (
    <div className="min-h-screen truck-page-bg">
      <Navigation />
      <TruckLocationClient apiKey={apiKey} />
      <Footer />
    </div>
  );
}
