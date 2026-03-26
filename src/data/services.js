import {
  HiSparkles,
  HiHome,
  HiOfficeBuilding,
  HiShieldCheck,
} from 'react-icons/hi';
import carpetImg from '../assets/carpet.jpg';
import upholsteryImg from '../assets/upholstery.jpg';
import commercialImg from '../assets/commercial-cleaning.jpg';
import biohazardImg from '../assets/bio.jpeg';

const services = [
  {
    slug: 'carpet-cleaning',
    title: 'Domestic Carpet Cleaning',
    icon: HiSparkles,
    image: carpetImg,
    price: 'From £60',
    accent: 'from-primary to-primary-light',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    shortDescription:
      'Deep hot-water extraction that removes embedded dirt, stains and allergens — restoring your carpets to like-new condition.',
    features: [
      'Deep stain removal',
      'Hot-water extraction',
      'Fast drying times',
      'Pet-safe products',
    ],
    metaTitle:
      'Domestic Carpet Cleaning | Wirral Carpet Cleaning',
    metaDescription:
      'Professional domestic carpet cleaning across Wirral, Liverpool & Merseyside. Deep hot-water extraction removes dirt, stains & allergens. From £60 per room. Free quotes — 0151 936 9664.',
    heroText:
      'Professional deep cleaning that brings your carpets back to life.',
    longDescription: [
      'Our domestic carpet cleaning service uses professional-grade hot-water extraction equipment to deep clean your carpets, removing embedded dirt, dust mites, allergens and stubborn stains that regular vacuuming simply cannot reach. The result is carpets that look, feel and smell like new.',
      'We use eco-friendly, non-toxic cleaning solutions that are completely safe for children, pets and allergy sufferers. Our technicians are fully trained, DBS-checked and insured, giving you complete peace of mind when we enter your home.',
      'Whether you need a single room freshened up or a whole-house deep clean, we provide honest, upfront pricing with no hidden fees. Your first room starts from just £60, with additional rooms from £30 each.',
    ],
    processSteps: [
      { title: 'Pre-inspection', description: 'We assess your carpets, identify stains and choose the best treatment method for your carpet type.' },
      { title: 'Pre-treatment', description: 'Problem areas and stubborn stains are pre-treated with specialist solutions to break down dirt and grease.' },
      { title: 'Hot-water extraction', description: 'Our professional equipment injects hot water deep into carpet fibres and immediately extracts it along with all the dissolved dirt.' },
      { title: 'Grooming & drying', description: 'We groom the carpet pile for an even finish and ensure fast drying, typically 2-4 hours.' },
    ],
    pricingNote:
      'First room from £60, additional rooms from £30 each. Hall, stairs and landing combinations available at discounted rates.',
    faqs: [
      {
        question: 'How much does domestic carpet cleaning cost?',
        answer:
          'Our domestic carpet cleaning starts from £60 for the first room, with additional rooms from £30 each. We offer discounted rates for hall, stairs and landing combinations. Contact us for a free, no-obligation quote.',
      },
      {
        question: 'How long does carpet cleaning take to dry?',
        answer:
          'Most carpets are dry within 2-4 hours after cleaning. We use professional-grade equipment that extracts maximum moisture, ensuring fast drying times. Opening windows and using fans can speed up the process.',
      },
      {
        question: 'Is carpet cleaning safe for pets and children?',
        answer:
          'Absolutely. We use eco-friendly, non-toxic cleaning solutions that are completely safe for pets, children and allergy sufferers. All our products are professionally formulated and leave no harmful residue.',
      },
      {
        question: 'Can you remove stubborn stains from carpets?',
        answer:
          'Yes, our professional equipment and specialist stain treatments can remove most stubborn stains including red wine, coffee, tea, pet accidents, ink and more. We assess every stain individually and apply the most effective treatment.',
      },
    ],
  },
  {
    slug: 'upholstery-cleaning',
    title: 'Upholstery Cleaning',
    icon: HiHome,
    image: upholsteryImg,
    price: 'From £50',
    accent: 'from-accent to-accent-light',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    shortDescription:
      'Specialist fabric cleaning for sofas, chairs and mattresses. We treat every piece with the care it deserves.',
    features: [
      'All fabric types',
      'Colour-safe cleaning',
      'Odour elimination',
      'Stain protection',
    ],
    metaTitle:
      'Upholstery & Sofa Cleaning | Wirral Carpet Cleaning',
    metaDescription:
      'Professional sofa and upholstery cleaning across Wirral, Liverpool & Merseyside. Specialist fabric care for sofas, chairs & mattresses. From £50. Free quotes — 0151 936 9664.',
    heroText:
      'Specialist cleaning that revives your sofas, chairs and soft furnishings.',
    longDescription: [
      'Our upholstery cleaning service is designed to safely and effectively clean all types of soft furnishings, from fabric and microfibre sofas to leather armchairs, dining chairs and mattresses. We use colour-safe, fabric-appropriate cleaning methods tailored to each piece.',
      'Over time, upholstered furniture collects body oils, sweat, pet dander, food spills and dust mites deep within the fabric. Our professional cleaning removes these contaminants, eliminates odours and restores the original colour and texture of your furniture.',
      'We also offer optional stain protection treatments that create an invisible barrier on your upholstery, making future spills easier to clean and extending the life of your furniture.',
    ],
    processSteps: [
      { title: 'Fabric assessment', description: 'We identify the fabric type and test cleaning solutions in a hidden area to ensure colour-fastness.' },
      { title: 'Vacuuming', description: 'Deep vacuuming removes loose dirt, pet hair and debris from all surfaces and crevices.' },
      { title: 'Cleaning', description: 'Using the appropriate method for your fabric — hot-water extraction, dry cleaning or low-moisture cleaning — we deep clean every surface.' },
      { title: 'Protection (optional)', description: 'We can apply a fabric protector that guards against future stains and spills.' },
    ],
    pricingNote:
      'Sofa cleaning from £50 for a two-seater, £70 for a three-seater. Armchairs, dining chairs and mattresses also available. Contact us for a bespoke quote.',
    faqs: [
      {
        question: 'How much does sofa cleaning cost?',
        answer:
          'Sofa cleaning starts from £50 for a two-seater and £70 for a three-seater. Armchairs, dining chairs and mattresses are also available. Prices vary depending on fabric type and condition. Contact us for a free quote.',
      },
      {
        question: 'Can you clean leather sofas?',
        answer:
          'Yes, we clean all types of upholstery including leather, fabric, microfibre, velvet and more. We use specialist products designed specifically for each material to ensure safe, effective cleaning.',
      },
      {
        question: 'How long does upholstery take to dry?',
        answer:
          'Drying times depend on the fabric type and cleaning method used. Most fabric sofas are dry within 4-6 hours. Leather and low-moisture cleaned items can be used almost immediately.',
      },
      {
        question: 'Do you offer stain protection for sofas?',
        answer:
          'Yes, we offer an optional fabric protection treatment that creates an invisible barrier against future spills and stains. This is applied after cleaning and helps keep your upholstery looking fresh for longer.',
      },
    ],
  },
  {
    slug: 'commercial-cleaning',
    title: 'Commercial Carpet Cleaning',
    icon: HiOfficeBuilding,
    image: commercialImg,
    price: 'Custom Quote',
    accent: 'from-primary-dark to-primary',
    iconBg: 'bg-primary-dark/10',
    iconColor: 'text-primary-dark',
    shortDescription:
      'Keep your business premises pristine. Contract and one-off carpet cleaning services for offices, restaurants, hotels and more.',
    features: [
      'Flexible scheduling',
      'Minimal disruption',
      'Contract options',
      'All commercial spaces',
    ],
    metaTitle:
      'Commercial Carpet Cleaning | Wirral Carpet Cleaning',
    metaDescription:
      'Professional commercial carpet cleaning for offices, restaurants, hotels & businesses across Wirral, Liverpool & Merseyside. Contract & one-off cleans. Free quotes — 0151 936 9664.',
    heroText:
      'Professional carpet cleaning for offices, restaurants, hotels and commercial premises.',
    longDescription: [
      'First impressions matter. Dirty, stained carpets in your business premises can put off customers, lower staff morale and create an unhealthy working environment. Our commercial carpet cleaning service keeps your premises looking their best.',
      'We work with offices, restaurants, hotels, pubs, retail stores, care homes, schools and all types of commercial premises across Merseyside and Cheshire. We offer both one-off deep cleans and regular contract cleaning to suit your needs and budget.',
      'Our team works around your schedule to minimise disruption to your business. We can clean evenings, weekends or during quiet periods. All our technicians are fully insured, DBS-checked and trained to work in commercial environments.',
    ],
    processSteps: [
      { title: 'Site survey', description: 'We visit your premises to assess the area, carpet type and condition, and provide a detailed quote.' },
      { title: 'Scheduling', description: 'We agree a cleaning schedule that works around your business hours to minimise disruption.' },
      { title: 'Deep cleaning', description: 'Using commercial-grade equipment, we deep clean all carpeted areas to remove dirt, stains and allergens.' },
      { title: 'Reporting', description: 'After each clean, we provide a summary of work completed and any areas that may need attention.' },
    ],
    pricingNote:
      'Commercial pricing depends on the size of the area, carpet condition and frequency of cleaning. Contact us for a free site survey and bespoke quote.',
    faqs: [
      {
        question: 'Do you offer contract cleaning for businesses?',
        answer:
          'Yes, we offer flexible contract options for regular commercial carpet cleaning. Whether you need weekly, monthly or quarterly cleans, we can create a schedule that suits your business needs and budget.',
      },
      {
        question: 'Can you clean outside of business hours?',
        answer:
          'Absolutely. We understand that disruption to your business is costly. We can clean evenings, weekends, early mornings or during any quiet periods that suit you.',
      },
      {
        question: 'What types of commercial premises do you clean?',
        answer:
          'We clean offices, restaurants, hotels, pubs, retail stores, care homes, schools, churches, gyms and all types of commercial premises. If it has carpets, we can clean it.',
      },
      {
        question: 'How quickly can carpets be used after commercial cleaning?',
        answer:
          'Carpets are typically ready for light foot traffic within 2 hours and fully dry within 4-6 hours. We can use fast-drying methods for areas that need to be back in use quickly.',
      },
    ],
  },
  {
    slug: 'biohazard-cleaning',
    title: 'Biohazard Cleaning',
    icon: HiShieldCheck,
    image: biohazardImg,
    price: 'Call for Quote',
    accent: 'from-emerald-500 to-emerald-400',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    shortDescription:
      'Certified biohazard and trauma cleaning. Discreet, compassionate service when you need it most.',
    features: [
      'Certified & compliant',
      'Discreet service',
      'Rapid response',
      '24/7 availability',
    ],
    metaTitle:
      'Biohazard & Trauma Cleaning | Wirral Carpet Cleaning',
    metaDescription:
      'Certified biohazard and trauma cleaning across Wirral, Liverpool & Merseyside. Discreet, compassionate 24/7 service. Fully insured & compliant. Call 0151 936 9664.',
    heroText:
      'Discreet, compassionate biohazard and trauma cleaning when you need it most.',
    longDescription: [
      'Our biohazard cleaning service provides professional, certified cleaning for situations involving blood, bodily fluids, trauma scenes, unattended deaths, hoarding and other biohazardous materials. We handle these sensitive situations with the utmost discretion and compassion.',
      'All our biohazard technicians are fully trained in the safe handling and disposal of hazardous materials. We follow strict protocols to ensure complete decontamination and safe disposal in compliance with current regulations.',
      'We understand that these situations are incredibly stressful. Our team arrives in unmarked vehicles, works discreetly and handles everything so you do not have to. We are available 24 hours a day, 7 days a week for emergency callouts.',
    ],
    processSteps: [
      { title: 'Initial call', description: 'Speak to our team confidentially. We assess the situation and can be on-site within hours.' },
      { title: 'Assessment', description: 'On arrival, we assess the affected area and create a detailed cleaning and decontamination plan.' },
      { title: 'Decontamination', description: 'Using specialist equipment and hospital-grade disinfectants, we thoroughly clean and decontaminate the area.' },
      { title: 'Verification', description: 'We verify the area is fully decontaminated and safe, and handle all waste disposal in compliance with regulations.' },
    ],
    pricingNote:
      'Biohazard cleaning is quoted on a case-by-case basis depending on the nature and extent of the situation. Call us for a confidential, no-obligation discussion.',
    faqs: [
      {
        question: 'Is your biohazard cleaning service available 24/7?',
        answer:
          'Yes, we offer a 24/7 emergency biohazard cleaning service. Call us any time and we can typically be on-site within a few hours.',
      },
      {
        question: 'Is biohazard cleaning discreet?',
        answer:
          'Absolutely. We arrive in unmarked vehicles and our team works discreetly. We understand the sensitive nature of these situations and treat every case with compassion and confidentiality.',
      },
      {
        question: 'What types of biohazard situations do you handle?',
        answer:
          'We handle all types of biohazard situations including trauma scenes, unattended deaths, blood and bodily fluid clean-up, needle and sharps removal, hoarding clean-up and industrial accidents.',
      },
      {
        question: 'Are you certified for biohazard cleaning?',
        answer:
          'Yes, all our biohazard technicians are fully trained and certified. We follow strict health and safety protocols and dispose of all hazardous waste in compliance with current regulations.',
      },
    ],
  },
];

export default services;
