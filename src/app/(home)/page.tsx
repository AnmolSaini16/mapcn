import { Hero } from "./_components/hero";
import { ExamplesGrid } from "./_components/examples-grid";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

export default function Page() {
  return (
    <div className="flex flex-col">
      <Header />

      <main className="flex-1 pb-32">
        <section className="relative w-full py-24">
          <Hero />
        </section>

        <section className="container">
          <ExamplesGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}
