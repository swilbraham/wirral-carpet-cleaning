const locations = [
  {
    slug: 'wirral',
    name: 'Wirral',
    county: 'Merseyside',
    description:
      'As a Wirral-based business, we are proud to serve households and businesses right across the Wirral peninsula. From Birkenhead to West Kirby, Heswall to New Brighton, our team knows the area inside out and can be with you quickly for any cleaning job.',
    nearby: ['Birkenhead', 'Wallasey', 'Heswall', 'West Kirby', 'Bebington'],
  },
  {
    slug: 'liverpool',
    name: 'Liverpool',
    county: 'Merseyside',
    description:
      'We provide professional carpet and upholstery cleaning services throughout Liverpool, from the city centre to the surrounding suburbs. Whether you need a domestic deep clean or commercial contract cleaning, our experienced team covers all Liverpool postcodes.',
    nearby: ['Bootle', 'Crosby', 'Birkenhead', 'Wallasey', 'St Helens'],
  },
  {
    slug: 'birkenhead',
    name: 'Birkenhead',
    county: 'Merseyside',
    description:
      'Our carpet cleaning team regularly serves homes and businesses in Birkenhead and the surrounding area. Located just across the Mersey from Liverpool, Birkenhead is one of our core service areas with fast response times and local knowledge.',
    nearby: ['Wallasey', 'Prenton', 'Bebington', 'Liverpool', 'Wirral'],
  },
  {
    slug: 'wallasey',
    name: 'Wallasey',
    county: 'Merseyside',
    description:
      'From Wallasey Village to New Brighton, we provide professional carpet cleaning services across the whole of Wallasey. Our local team delivers fast, reliable service with the quality results you would expect from an established Wirral cleaning company.',
    nearby: ['New Brighton', 'Birkenhead', 'Hoylake', 'Liverpool', 'Wirral'],
  },
  {
    slug: 'heswall',
    name: 'Heswall',
    county: 'Merseyside',
    description:
      'We regularly clean carpets and upholstery in homes across Heswall and the Dee estuary area. Our professional service is trusted by Heswall residents who want their carpets restored to like-new condition using safe, eco-friendly products.',
    nearby: ['Neston', 'West Kirby', 'Bebington', 'Bromborough', 'Wirral'],
  },
  {
    slug: 'west-kirby',
    name: 'West Kirby',
    county: 'Merseyside',
    description:
      'Our carpet cleaning service covers West Kirby and the surrounding coastal areas. We bring professional-grade equipment and eco-friendly cleaning solutions to homes and businesses across this popular seaside town.',
    nearby: ['Hoylake', 'Heswall', 'Neston', 'Wirral', 'Wallasey'],
  },
  {
    slug: 'bebington',
    name: 'Bebington',
    county: 'Merseyside',
    description:
      'Bebington residents trust our team for professional carpet and upholstery cleaning. We cover Higher Bebington, Lower Bebington and the surrounding areas with reliable, high-quality cleaning services at competitive prices.',
    nearby: ['Bromborough', 'Birkenhead', 'Prenton', 'Heswall', 'Wirral'],
  },
  {
    slug: 'bromborough',
    name: 'Bromborough',
    county: 'Merseyside',
    description:
      'We serve both domestic and commercial customers in Bromborough and Bromborough Pool. Our team provides thorough carpet cleaning using hot-water extraction to remove deep-set dirt and stains from carpets in homes and business premises.',
    nearby: ['Bebington', 'Ellesmere Port', 'Neston', 'Birkenhead', 'Wirral'],
  },
  {
    slug: 'ellesmere-port',
    name: 'Ellesmere Port',
    county: 'Cheshire',
    description:
      'Our carpet cleaning service extends to Ellesmere Port and the surrounding Cheshire areas. We work with both homeowners and businesses to keep carpets and upholstery clean, fresh and free from allergens.',
    nearby: ['Chester', 'Bromborough', 'Neston', 'Wirral', 'Runcorn'],
  },
  {
    slug: 'chester',
    name: 'Chester',
    county: 'Cheshire',
    description:
      'We provide professional carpet and upholstery cleaning services throughout Chester, from the historic city centre to the suburbs. Our experienced team serves domestic and commercial customers across all Chester postcodes.',
    nearby: ['Ellesmere Port', 'Neston', 'Bromborough', 'Wirral', 'Warrington'],
  },
  {
    slug: 'neston',
    name: 'Neston',
    county: 'Cheshire',
    description:
      'Our carpet cleaning team covers Neston, Parkgate and the surrounding villages. We bring the same professional equipment and expertise to every home in Neston, delivering deep cleaning results that make a real difference.',
    nearby: ['Heswall', 'Bromborough', 'Ellesmere Port', 'Chester', 'Wirral'],
  },
  {
    slug: 'hoylake',
    name: 'Hoylake',
    county: 'Merseyside',
    description:
      'Hoylake residents benefit from our local carpet cleaning service. We provide professional deep cleaning for carpets, rugs and upholstery in homes across Hoylake and the neighbouring areas of Meols and West Kirby.',
    nearby: ['West Kirby', 'Wallasey', 'New Brighton', 'Wirral', 'Birkenhead'],
  },
  {
    slug: 'new-brighton',
    name: 'New Brighton',
    county: 'Merseyside',
    description:
      'We serve homes and businesses across New Brighton with professional carpet and upholstery cleaning. Our team is familiar with the area and provides fast, reliable cleaning services with excellent results.',
    nearby: ['Wallasey', 'Birkenhead', 'Hoylake', 'Liverpool', 'Wirral'],
  },
  {
    slug: 'bootle',
    name: 'Bootle',
    county: 'Merseyside',
    description:
      'Our carpet cleaning service covers Bootle and the north Liverpool area. We provide affordable, professional carpet cleaning for homes and businesses, using the same high-quality equipment and eco-friendly products across every job.',
    nearby: ['Liverpool', 'Crosby', 'Wallasey', 'Birkenhead', 'Southport'],
  },
  {
    slug: 'southport',
    name: 'Southport',
    county: 'Merseyside',
    description:
      'We extend our professional carpet cleaning service to Southport and the surrounding Sefton area. Whether you need a single room cleaned or a full commercial premises, our team delivers outstanding results in Southport.',
    nearby: ['Formby', 'Crosby', 'Bootle', 'Liverpool', 'St Helens'],
  },
  {
    slug: 'st-helens',
    name: 'St Helens',
    county: 'Merseyside',
    description:
      'Our carpet and upholstery cleaning service is available throughout St Helens. We serve both residential and commercial customers with professional deep cleaning that removes embedded dirt, stains and allergens.',
    nearby: ['Warrington', 'Liverpool', 'Widnes', 'Southport', 'Runcorn'],
  },
  {
    slug: 'warrington',
    name: 'Warrington',
    county: 'Cheshire',
    description:
      'We provide professional carpet cleaning services to homes and businesses in Warrington. Our team covers all Warrington postcodes, offering flexible scheduling and competitive pricing for domestic and commercial cleans.',
    nearby: ['Widnes', 'Runcorn', 'St Helens', 'Liverpool', 'Chester'],
  },
  {
    slug: 'runcorn',
    name: 'Runcorn',
    county: 'Cheshire',
    description:
      'Our carpet cleaning team serves Runcorn and the surrounding Halton area. We bring professional-grade equipment to every job, providing thorough deep cleaning for carpets and upholstery in homes and commercial premises.',
    nearby: ['Widnes', 'Warrington', 'Ellesmere Port', 'Chester', 'Liverpool'],
  },
  {
    slug: 'widnes',
    name: 'Widnes',
    county: 'Cheshire',
    description:
      'We cover Widnes with our full range of carpet and upholstery cleaning services. From domestic deep cleans to commercial contract cleaning, our experienced team delivers excellent results across the Widnes area.',
    nearby: ['Runcorn', 'Warrington', 'St Helens', 'Liverpool', 'Ellesmere Port'],
  },
  {
    slug: 'crosby',
    name: 'Crosby',
    county: 'Merseyside',
    description:
      'Our carpet cleaning service covers Crosby, Waterloo and the Sefton coastline. We provide reliable, professional cleaning for homes and businesses, with fast response times and consistently excellent results.',
    nearby: ['Bootle', 'Formby', 'Liverpool', 'Southport', 'Wallasey'],
  },
  {
    slug: 'formby',
    name: 'Formby',
    county: 'Merseyside',
    description:
      'Formby residents trust our team for professional carpet and upholstery cleaning. We serve Formby and the surrounding villages with the same high standards and attention to detail that our Wirral customers have come to expect.',
    nearby: ['Crosby', 'Southport', 'Bootle', 'Liverpool', 'St Helens'],
  },
  {
    slug: 'prenton',
    name: 'Prenton',
    county: 'Merseyside',
    description:
      'As one of our closest service areas, Prenton receives fast, reliable carpet cleaning services from our Wirral-based team. We provide professional deep cleaning for all types of carpets and upholstery in homes and businesses across Prenton.',
    nearby: ['Birkenhead', 'Bebington', 'Bromborough', 'Wallasey', 'Wirral'],
  },
];

export default locations;
