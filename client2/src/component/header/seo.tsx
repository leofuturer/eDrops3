import React from 'react';
import { Helmet } from 'react-helmet';

const defaultMetadata = {
  title: 'Digital microfluidic chip & control system provider | eDrops',
  description: 'A portal for electrowetting-on-dielectric (EWOD) digital microfluidics. Design chips; access fabrication services; obtain tools for device operation; share experiences.',
  metadata: [
    {
      name: 'og:title',
      content: 'Digital microfluidic chip & control system provider | eDrops',
    },
    {
      name: 'og:description',
      content: 'A portal for electrowetting-on-dielectric (EWOD) digital microfluidics. Design chips; access fabrication services; obtain tools for device operation; share experiences.',
    },
    {
      name: 'og:image',
      content: 'https://edrops.org/resource/edrop_logo.png',
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'og:url',
      content: 'https://www.edrops.org',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
  ],
};

const SEO = ({ title, description, metadata = [] }) => {
  title = title || defaultMetadata.title;
  description = description || defaultMetadata.description;
  metadata = metadata || defaultMetadata.metadata;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {metadata.map(({ name, content }) => (
        <meta name={name} content={content} key={name} />
      ))}
    </Helmet>
  );
};
export default SEO;

/** META TAGS
  og (Open Graph)
  -----------------
  og:title (title of page)
  og:description (description of page, optional)
  og:image (url to image)
  og:url (canonical URL)
  og:type (website, article, etc.)

  twitter (Twitter)
  -----------------
  Tags that are equivalent to og tags, don't need to be used if you use twitter:card
  -----------------
  twitter:title (title of page)
  twitter:description (description of page)
  twitter:image (url to image)

  Twitter card tags
  -----------------
  twitter:card (summary, summary_large_image, app, gallery, player)
  - Typically we use summary or summary large
 */
