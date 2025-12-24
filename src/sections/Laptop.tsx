import LaptopScene from '../components/LaptopScene'

export default function LaptopSection() {
  return (
    <section
      id="laptop"
      className="py-16 px-8 bg-transparent relative z-0"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-8 items-center">
        {/* Left column - content */}
        <div className="md:col-span-3 text-white">
          <h2 className="text-3xl font-bold mb-4">3D Laptop</h2>
          <p className="text-muted-foreground">This section shows a small interactive 3D laptop. The rest of the page content sits beside it and is not covered.</p>
        </div>

        {/* Right column - constrained 3D card */}
        <div className="md:col-span-3 flex items-center justify-center">
  <div
    className="relative rounded-xl overflow-hidden bg-[#0f0f14] shadow-lg"
    style={{ width: 320, height: 320 }}   // HARD SIZE
  >
    <LaptopScene />
  </div>
</div>

      </div>
    </section>
  )
}