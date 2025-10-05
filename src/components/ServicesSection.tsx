import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface ServicesSectionProps {
  t: any;
  isVisible: any;
}

export default function ServicesSection({ t, isVisible }: ServicesSectionProps) {
  return (
    <section id="services" className="py-20 bg-gray-50 px-6" data-animate>
      <div className={`container mx-auto transition-all duration-1000 delay-400 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl font-bold font-montserrat text-center mb-16 text-black">
          {t.services.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="text-primary text-5xl mb-4">
                <Icon name="Key" size={48} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold font-montserrat">{t.services.rental.title}</h3>
              <p className="text-gray-600">
                {t.services.rental.description}
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="text-primary text-5xl mb-4">
                <Icon name="Home" size={48} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold font-montserrat">{t.services.purchase.title}</h3>
              <p className="text-gray-600">
                {t.services.purchase.description}
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="text-primary text-5xl mb-4">
                <Icon name="FileText" size={48} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold font-montserrat">{t.services.consultation.title}</h3>
              <p className="text-gray-600">
                {t.services.consultation.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
