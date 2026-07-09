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
  {
    slug: 'moreton',
    name: 'Moreton',
    county: 'Merseyside',
    description:
      'Moreton is right on our doorstep, and homes across Moreton and Moreton Shore benefit from some of our fastest response times on the Wirral. From family homes near the cross to properties out towards Leasowe, we deep clean carpets, rugs and upholstery to a professional standard.',
    nearby: ['Leasowe', 'Saughall Massie', 'Upton', 'Hoylake', 'Wallasey'],
  },
  {
    slug: 'upton',
    name: 'Upton',
    county: 'Merseyside',
    description:
      'We regularly clean carpets in homes across Upton, from the village centre to the estates around Arrowe Park. Our local team provides thorough hot-water extraction cleaning that lifts out embedded dirt, allergens and stains, leaving carpets fresh and fast-drying.',
    nearby: ['Moreton', 'Greasby', 'Woodchurch', 'Bidston', 'Birkenhead'],
  },
  {
    slug: 'greasby',
    name: 'Greasby',
    county: 'Merseyside',
    description:
      'Greasby households trust our team for reliable, professional carpet and upholstery cleaning. Whether it is a single living room or a whole house before moving in, we bring professional-grade equipment and eco-friendly products to every job in Greasby and Frankby.',
    nearby: ['Upton', 'Irby', 'West Kirby', 'Moreton', 'Saughall Massie'],
  },
  {
    slug: 'irby',
    name: 'Irby',
    county: 'Merseyside',
    description:
      'Our carpet cleaning service covers Irby village and the surrounding lanes towards Thurstaston. Irby homes often feature quality carpets worth looking after, and our deep-clean process restores pile, lifts stains and extends the life of your flooring.',
    nearby: ['Greasby', 'Pensby', 'Thingwall', 'Thurstaston', 'Heswall'],
  },
  {
    slug: 'pensby',
    name: 'Pensby',
    county: 'Merseyside',
    description:
      'We provide professional carpet, rug and sofa cleaning throughout Pensby. Our fully insured technicians serve the whole area from Pensby Road to the Fishers Lane estates, with free quotes and no payment until the job is complete.',
    nearby: ['Irby', 'Thingwall', 'Heswall', 'Barnston', 'Greasby'],
  },
  {
    slug: 'thingwall',
    name: 'Thingwall',
    county: 'Merseyside',
    description:
      'Thingwall residents can count on our local team for high-quality carpet and upholstery cleaning. We use powerful hot-water extraction machines that remove deep-set dirt and leave carpets clean, sanitised and dry within hours.',
    nearby: ['Pensby', 'Irby', 'Barnston', 'Woodchurch', 'Heswall'],
  },
  {
    slug: 'barnston',
    name: 'Barnston',
    county: 'Merseyside',
    description:
      'We clean carpets and upholstery in homes across Barnston and the surrounding countryside between Heswall and Storeton. Our team treats every home with care, using safe, eco-friendly products suitable for children, pets and allergy sufferers.',
    nearby: ['Heswall', 'Pensby', 'Thingwall', 'Gayton', 'Irby'],
  },
  {
    slug: 'gayton',
    name: 'Gayton',
    county: 'Merseyside',
    description:
      'Our professional carpet cleaning service covers Gayton and the lower Heswall area near the Dee estuary. From large family homes to apartments, we deliver deep cleaning results that make carpets look and feel like new.',
    nearby: ['Heswall', 'Barnston', 'Neston', 'Pensby', 'Thurstaston'],
  },
  {
    slug: 'thurstaston',
    name: 'Thurstaston',
    county: 'Merseyside',
    description:
      'We serve Thurstaston and the surrounding villages along the Dee coast with professional carpet and upholstery cleaning. Sandy paths and country walks are hard on carpets — our deep-clean process lifts out trodden-in dirt and restores the pile.',
    nearby: ['Irby', 'Caldy', 'West Kirby', 'Heswall', 'Greasby'],
  },
  {
    slug: 'caldy',
    name: 'Caldy',
    county: 'Merseyside',
    description:
      'Caldy homeowners choose our team for careful, high-quality carpet and upholstery cleaning. We are experienced with wool and other premium carpets, using the correct cleaning method for each fibre so your flooring is protected as well as cleaned.',
    nearby: ['West Kirby', 'Thurstaston', 'Hoylake', 'Irby', 'Heswall'],
  },
  {
    slug: 'meols',
    name: 'Meols',
    county: 'Merseyside',
    description:
      'Our carpet cleaning team regularly works in Meols, from homes near the promenade to the streets around the station. Coastal living means sand and salt get walked into carpets — our hot-water extraction clean removes it all and leaves carpets fresh.',
    nearby: ['Hoylake', 'West Kirby', 'Moreton', 'Saughall Massie', 'Greasby'],
  },
  {
    slug: 'saughall-massie',
    name: 'Saughall Massie',
    county: 'Merseyside',
    description:
      'We provide professional carpet and upholstery cleaning across Saughall Massie village and the surrounding area. Our local team offers fast response times, free quotes and thorough deep cleaning with fast drying times.',
    nearby: ['Moreton', 'Upton', 'Meols', 'Greasby', 'Leasowe'],
  },
  {
    slug: 'leasowe',
    name: 'Leasowe',
    county: 'Merseyside',
    description:
      'Leasowe residents benefit from our fast, affordable carpet cleaning service. We cover the whole area from Leasowe Road to the coast, cleaning carpets, stairs, rugs and sofas in homes of every size at competitive prices.',
    nearby: ['Moreton', 'Wallasey', 'Bidston', 'New Brighton', 'Upton'],
  },
  {
    slug: 'bidston',
    name: 'Bidston',
    county: 'Merseyside',
    description:
      'Our team serves Bidston, Bidston Village and the surrounding estates with professional carpet and upholstery cleaning. We bring the same commercial-grade equipment and attention to detail to every home, with free no-obligation quotes.',
    nearby: ['Birkenhead', 'Upton', 'Leasowe', 'Claughton', 'Prenton'],
  },
  {
    slug: 'claughton',
    name: 'Claughton',
    county: 'Merseyside',
    description:
      'We clean carpets and upholstery in homes throughout Claughton. Many Claughton properties are older houses with original features and quality carpets — our careful deep-clean process refreshes them without harsh chemicals.',
    nearby: ['Birkenhead', 'Oxton', 'Bidston', 'Prenton', 'Wallasey'],
  },
  {
    slug: 'oxton',
    name: 'Oxton',
    county: 'Merseyside',
    description:
      'Oxton village and the surrounding conservation area are regular stops for our carpet cleaning team. From Victorian terraces to modern apartments, we tailor our cleaning approach to each property and always leave carpets fresh, clean and fast-drying.',
    nearby: ['Claughton', 'Prenton', 'Birkenhead', 'Woodchurch', 'Tranmere'],
  },
  {
    slug: 'tranmere',
    name: 'Tranmere',
    county: 'Merseyside',
    description:
      'We provide affordable, professional carpet cleaning across Tranmere. Whether you need one room refreshed or a full end-of-tenancy clean, our fully insured team delivers excellent results with no hidden fees.',
    nearby: ['Birkenhead', 'Rock Ferry', 'Prenton', 'Oxton', 'Bebington'],
  },
  {
    slug: 'rock-ferry',
    name: 'Rock Ferry',
    county: 'Merseyside',
    description:
      'Rock Ferry homes and rental properties are well served by our carpet cleaning team. We work with homeowners, tenants and landlords across the area, providing deep cleans that remove stains, odours and allergens.',
    nearby: ['Tranmere', 'New Ferry', 'Birkenhead', 'Bebington', 'Prenton'],
  },
  {
    slug: 'new-ferry',
    name: 'New Ferry',
    county: 'Merseyside',
    description:
      'Our carpet and upholstery cleaning service covers New Ferry and the surrounding streets along the Mersey. We offer competitive prices, free quotes and a thorough hot-water extraction clean that leaves carpets sanitised and fresh.',
    nearby: ['Rock Ferry', 'Bebington', 'Port Sunlight', 'Bromborough', 'Tranmere'],
  },
  {
    slug: 'port-sunlight',
    name: 'Port Sunlight',
    county: 'Merseyside',
    description:
      'We are proud to clean carpets in the beautiful garden village of Port Sunlight. Our team takes extra care in these historic homes, using gentle, eco-friendly products and the right method for each carpet type.',
    nearby: ['Bebington', 'New Ferry', 'Bromborough', 'Rock Ferry', 'Eastham'],
  },
  {
    slug: 'eastham',
    name: 'Eastham',
    county: 'Merseyside',
    description:
      'Eastham and Eastham Ferry are firmly within our core service area. We clean carpets, stairs, rugs and upholstery in homes across the village, with flexible appointment times and no payment taken until the job is done.',
    nearby: ['Bromborough', 'Port Sunlight', 'Willaston', 'Ellesmere Port', 'Bebington'],
  },
  {
    slug: 'willaston',
    name: 'Willaston',
    county: 'Cheshire',
    description:
      'Our carpet cleaning team covers Willaston and the surrounding south Wirral villages. We bring professional equipment and years of experience to every home, delivering a deep clean that removes embedded dirt and refreshes tired carpets.',
    nearby: ['Neston', 'Eastham', 'Bromborough', 'Ellesmere Port', 'Heswall'],
  },
  {
    slug: 'woodchurch',
    name: 'Woodchurch',
    county: 'Merseyside',
    description:
      'We provide reliable, affordable carpet cleaning across Woodchurch. From family homes on the estate to properties near Arrowe Park, our team delivers professional deep cleaning with free quotes and fast drying times.',
    nearby: ['Upton', 'Prenton', 'Thingwall', 'Greasby', 'Oxton'],
  },
  {
    slug: 'liscard',
    name: 'Liscard',
    county: 'Merseyside',
    description:
      'Liscard is one of our busiest service areas, and our team is in and around Liscard village most weeks. We clean carpets, sofas and stairs in homes and flats across the area, with competitive prices and consistently excellent results.',
    nearby: ['Wallasey', 'New Brighton', 'Seacombe', 'Leasowe', 'Birkenhead'],
  },
  {
    slug: 'seacombe',
    name: 'Seacombe',
    county: 'Merseyside',
    description:
      'Our carpet cleaning service covers Seacombe and the streets along the Mersey ferry front. We work with homeowners, tenants and landlords, providing thorough deep cleans that remove stains, odours and allergens at affordable prices.',
    nearby: ['Liscard', 'Wallasey', 'New Brighton', 'Birkenhead', 'Leasowe'],
  },
];

export default locations;
