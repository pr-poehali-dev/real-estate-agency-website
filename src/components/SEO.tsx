import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

export default function SEO({
  title = 'WSE.AM - Недвижимость в Ереване | Аренда и продажа квартир',
  description = 'Поиск недвижимости в Ереване: долгосрочная аренда, посуточная аренда и продажа квартир. Удобный поиск по районам, цене и параметрам. Интерактивная карта объектов.',
  keywords = 'недвижимость Ереван, аренда квартир Ереван, продажа квартир Ереван, посуточная аренда Ереван, снять квартиру Ереван, купить квартиру Ереван',
  ogImage = 'https://cdn.poehali.dev/projects/73745f0c-4271-4bf6-a60b-4537cc7c5835/files/b583506d-b90c-4a00-9b99-500627769850.jpg',
  ogUrl = 'https://wse.am',
  ogType = 'website'
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="WSE.AM" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  );
}
