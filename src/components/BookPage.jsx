import { Helmet } from 'react-helmet-async';
import { HiCheck } from 'react-icons/hi';
import CostCalculator from './CostCalculator';

/**
 * The dedicated booking page: price in seconds, book online, pay on the day.
 * This is the page ads and every "Book Online" button point at.
 */
export default function BookPage() {
  return (
    <>
      <Helmet>
        <title>Book Carpet Cleaning Online | Wirral Carpet Cleaning</title>
        <meta
          name="description"
          content="Get your fixed carpet cleaning price in seconds and book online. Any 3 areas for £99. Nothing to pay until the job is done — serving Wirral, Liverpool, Chester and Merseyside."
        />
        <link rel="canonical" href="https://www.wirralcarpetcleaning.com/book" />
      </Helmet>

      <section className="bg-primary-dark pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Your price in seconds.
            <br />
            Booked in a minute.
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Pick what needs cleaning, choose a day that suits, and you&rsquo;re
            booked — nothing to pay until the job is done.
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-300">
            {[
              'Any 3 areas for £99',
              'Pay on the day — cash or card',
              'Fully insured, 15+ years experience',
            ].map((point) => (
              <li key={point} className="flex items-center gap-2">
                <HiCheck className="w-4 h-4 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CostCalculator />
    </>
  );
}
