import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface AboutSectionProps {
  t: any;
  isVisible: any;
}

export default function AboutSection({ t, isVisible }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 px-6" data-animate>
      <div className={`container mx-auto transition-all duration-1000 delay-300 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl font-bold font-montserrat text-center mb-16 text-black">
          {t.about.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="text-center space-y-4">
              <div className="text-primary text-4xl mb-4">
                <Icon name="Users" size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold font-montserrat">{t.about.card1.title}</h3>
              <p className="text-gray-600">
                {t.about.card1.description}
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="text-center space-y-4">
              <div className="text-primary text-4xl mb-4">
                <Icon name="Shield" size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold font-montserrat">{t.about.card2.title}</h3>
              <p className="text-gray-600">
                {t.about.card2.description}
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="text-center space-y-4">
              <div className="text-primary text-4xl mb-4">
                <Icon name="HandHeart" size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold font-montserrat">{t.about.card3.title}</h3>
              <p className="text-gray-600">
                {t.about.card3.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
