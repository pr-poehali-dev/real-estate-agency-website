export default function AboutSection() {
  return (
    <section className="px-4 md:px-6 py-12 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-20"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight">
          Агентство недвижимости в Ереване, основанное в 2023 году предпринимателями из России.
        </h2>
        
        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed">
          Наша миссия — помогать тем, кто уже живёт в Ереване или только собирается переехать, находить идеальное жильё для жизни и отдыха.
        </p>
      </div>
    </section>
  );
}
