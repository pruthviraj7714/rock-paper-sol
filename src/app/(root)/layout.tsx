import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
