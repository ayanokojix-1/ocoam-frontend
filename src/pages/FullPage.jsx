import { useState } from 'react';
import { motion } from "framer-motion";
import OrnamentBg from "../assets/yoruba_patterns.svg"; // optional subtle background
import Navbar from "../components/NormalNavbar";
import { Card, CardContent } from "@/components/ui/card";

function Hero() {
  return (
    <>
      {/* SEO Meta Tags and Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Oduduwa College of Yoruba Medicine",
            alternateName: "OCYM",
            description:
              "Premier institution for traditional Yoruba medicine education, offering online diplomas and certifications in ancestral healing practices and indigenous herbal medicine.",
            url: "https://oyocam.com",
            logo: "https://oyocam.org/logo.png",
            image: "https://oyocam.org/logo.png",
            founder: {
              "@type": "Person",
              name: "Dr. Jegede Obafemi",
              affiliation: "Institute of African Studies, University of Ibadan",
            },
            address: {
              "@type": "PostalAddress",
              addressCountry: "Nigeria",
            },
            educationalCredentialAwarded: [
              "Diploma in Traditional Yoruba Medicine",
              "Certificate in Herbal Medicine",
              "Professional Certification in Indigenous Healing",
            ],
            offers: {
              "@type": "EducationalOccupationalProgram",
              name: "Traditional Yoruba Medicine Programs",
              description:
                "Comprehensive online education in Yoruba traditional medicine and herbal practices",
            },
          }),
        }}
      />

      <section
        id="home"
        className="relative min-h-screen bg-green-50 flex items-center justify-center text-center px-4 overflow-hidden pt-20"
        aria-labelledby="hero-heading"
        role="banner"
        style={{ scrollMarginTop: "5rem" }}
      >
        {/* Decorative background */}
        <img
          src={OrnamentBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-5 z-0 pointer-events-none"
          loading="lazy"
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Logo with proper SEO attributes */}
          <img
            src="/logo.png"
            alt="Oduduwa College of Yoruba Medicine - Traditional African Healing Education"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full mx-auto mb-6"
            width="128"
            height="128"
            loading="eager"
            fetchPriority="high"
          />

          {/* Main heading with SEO optimization */}
          <h1
            id="hero-heading"
            className="text-4xl md:text-6xl font-bold text-green-900 mb-4"
          >
            Oduduwa College of{" "}
            <span className="text-green-700">Yoruba Medicine</span>
          </h1>

          {/* Enhanced subtitle with keywords */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Nigeria's premier online institution for{" "}
            <strong>traditional Yoruba medicine education</strong>. Learn
            authentic <strong>herbal healing practices</strong> and earn
            professional certifications in{" "}
            <strong>indigenous African medicine</strong>.
          </motion.p>

          {/* Key benefits/features for SEO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-8 text-sm md:text-base"
          >
            <span className="bg-white/80 text-green-800 px-4 py-2 rounded-full border border-green-200">
              📜 Online Diplomas Available
            </span>
            <span className="bg-white/80 text-green-800 px-4 py-2 rounded-full border border-green-200">
              🌿 Traditional Herbal Medicine
            </span>
            <span className="bg-white/80 text-green-800 px-4 py-2 rounded-full border border-green-200">
              👨‍🎓 Professional Certifications
            </span>
          </motion.div>

          {/* CTA buttons with better SEO */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#about"
              className="inline-block bg-green-700 text-white px-8 py-4 rounded-full hover:bg-green-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
              aria-label="Learn more about our traditional Yoruba medicine programs"
            >
              Explore Our Heritage
            </a>

            <a
              href="/signup"
              className="inline-block border-2 border-green-700 text-green-700 px-8 py-4 rounded-full hover:bg-green-700 hover:text-white transition-all duration-300 font-semibold text-lg"
              aria-label="Contact Oduduwa College for enrollment information"
            >
              Apply Now
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-green-700 font-medium mb-4">
              Trusted by traditional healers and wellness practitioners across
              Nigeria
            </p>
            <div className="flex justify-center items-center space-x-8 text-green-600">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Students Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm">Online Learning</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Breadcrumb for SEO (hidden visually) */}
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol>
            <li>
              <a href="/">Home</a>
            </li>
            <li aria-current="page">Traditional Yoruba Medicine Education</li>
          </ol>
        </nav>
      </section>
    </>
  );
}

function AboutSection() {
  return (
    <>
      {/* SEO Meta Tags - These would typically go in your page head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Oduduwa College of Yoruba Medicine",
            description:
              "Premier institution for traditional Yoruba medicine education, offering online diplomas and certifications in ancestral healing practices.",
            founder: {
              "@type": "Person",
              name: "Dr. Jegede Obafemi",
              affiliation: "Institute of African Studies, University of Ibadan",
            },
            educationalCredentialAwarded: ["Diploma", "Certificate"],
            teaches: "Traditional Yoruba Medicine",
            keywords:
              "Yoruba medicine, traditional healing, herbal medicine, African studies, indigenous knowledge",
          }),
        }}
      />

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-4 sm:px-6 lg:px-20 py-12 bg-white pt-20 text-gray-800 w-full overflow-x-hidden"
        id="about"
        aria-labelledby="about-heading"
        style={{ scrollMarginTop: "5rem" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 items-start">
          {/* TEXT CONTENT */}
          <article className="lg:col-span-2 space-y-6 w-full">
            <header>
              <h1
                id="about-heading"
                className="text-2xl sm:text-3xl font-bold text-green-900 mb-4"
              >
                About Oduduwa College of Yoruba Medicine
              </h1>
              <p className="text-lg sm:text-xl text-green-700 font-medium mb-6">
                Preserving ancestral healing wisdom through structured education
                in traditional Yoruba medicine
              </p>
            </header>

            <div className="prose prose-lg max-w-none w-full">
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Oduduwa College of Yoruba Medicine</strong> is Nigeria's
                premier educational institution dedicated to preserving and
                teaching traditional Yoruba healing practices. Founded by{" "}
                <strong>Dr. Jegede Obafemi</strong> from the Institute of
                African Studies at the University of Ibadan, our college bridges
                ancient herbal medicine with contemporary educational standards.
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mt-8 mb-4">
                Our Heritage and Mission
              </h2>
              <p className="text-base sm:text-lg leading-relaxed">
                For over a millennium, Yoruba traditional medicine has
                integrated holistic healing through medicinal herbs, spiritual
                practices, and community wellness. Our ancestors developed
                sophisticated healing systems combining botanical knowledge,
                divination practices, and therapeutic rituals—wisdom transmitted
                through sacred oral traditions and master-apprentice
                relationships.
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mt-8 mb-4">
                Modern Education, Ancient Wisdom
              </h2>
              <p className="text-base sm:text-lg leading-relaxed">
                At Oduduwa College, we offer accredited online diplomas,
                professional certifications, and mentorship programs in
                traditional Yoruba medicine. Our curriculum combines indigenous
                knowledge systems with evidence-based research methodologies,
                creating comprehensive learning experiences for traditional
                healers, wellness practitioners, and cultural scholars.
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mt-8 mb-4">
                Professional Standards and Ethics
              </h2>
              <p className="text-base sm:text-lg leading-relaxed">
                We are committed to professionalizing Yoruba healing practices
                through ethical standardization and quality education. Our
                programs empower the next generation of traditional medicine
                practitioners, researchers, and wellness entrepreneurs while
                maintaining the sacred integrity of ancestral teachings.
              </p>

              <blockquote className="border-l-4 border-green-500 pl-4 sm:pl-6 italic text-base sm:text-lg text-green-800 my-6">
                "Where the leaves speak, the ancestors guide, and the spirit of
                Ọ̀rúnmìlà, the custodian of wisdom, walks beside you."
              </blockquote>

              <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mt-8 mb-4">
                Join Our Community
              </h2>
              <p className="text-base sm:text-lg leading-relaxed">
                Whether you're a practicing healer, spiritual seeker, academic
                scholar, or wellness entrepreneur, Oduduwa College provides a
                sacred learning environment. Join us in preserving our cultural
                heritage, healing our communities, and advancing traditional
                Yoruba medicine for future generations.
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-8 p-4 sm:p-6 bg-green-50 rounded-lg border border-green-200 w-full">
              <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-green-700 mb-4 text-sm sm:text-base">
                Explore our diploma programs and certification courses in
                traditional Yoruba medicine.
              </p>
              <a href="#programs">
                <button className="bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-800 transition-colors text-sm sm:text-base w-full sm:w-auto">
                  View Our Programs
                </button>
              </a>
            </div>
          </article>

          {/* FOUNDER PROFILE */}
          <motion.aside
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            aria-labelledby="founder-heading"
            className="w-full"
          >
            <Card className="shadow-xl rounded-2xl overflow-hidden border-2 border-green-700 w-full">
              <img
                src="/dr-jegede.jpg"
                alt="Dr. Jegede Obafemi, Founder of Oduduwa College of Yoruba Medicine"
                className="w-full object-cover h-48 sm:h-64"
                loading="lazy"
                width="400"
                height="256"
              />
              <CardContent className="bg-green-50 text-center py-4">
                <h3
                  id="founder-heading"
                  className="text-lg sm:text-xl font-semibold text-green-900"
                >
                  Dr. Jegede Obafemi
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Founder & Director
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Institute of African Studies, University of Ibadan
                </p>
              </CardContent>
            </Card>

            {/* Additional SEO Content */}
            <div className="mt-6 p-4 bg-white border border-green-200 rounded-lg w-full">
              <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">
                Quick Facts
              </h4>
              <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                <li>• Online diploma programs available</li>
                <li>• Professional certifications offered</li>
                <li>• Traditional herbal medicine training</li>
                <li>• Cultural preservation focus</li>
                <li>• Research-based curriculum</li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </motion.section>
    </>
  );
}

function OurRootsSection() {
  return (
    <>
      {/* SEO Schema for Historical Content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "The Historical Roots of Yoruba Traditional Medicine",
            description:
              "Discover the ancient origins of Yoruba medicine, from Ọ̀rúnmìlà's teachings to modern practice, spanning over 1000 years of healing wisdom.",
            about: {
              "@type": "MedicalSpecialty",
              name: "Traditional Yoruba Medicine",
            },
            keywords:
              "Yoruba history, traditional medicine, African healing, Orunmila, indigenous medicine, herbal remedies",
            datePublished: "2024",
            author: {
              "@type": "Organization",
              name: "Oduduwa College of Yoruba Medicine",
            },
          }),
        }}
      />

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-green-50 to-green-100 text-gray-800 overflow-x-hidden"
        id="roots"
        aria-labelledby="roots-heading"
        style={{ scrollMarginTop: "5rem" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2
              id="roots-heading"
              className="text-3xl sm:text-4xl font-bold text-green-900 mb-4"
            >
              Our Ancient Roots
            </h2>
            <p className="text-lg sm:text-xl text-green-700 max-w-3xl mx-auto">
              <strong>Yoruba traditional medicine</strong> represents one of
              Africa's oldest and most sophisticated healing systems, tracing
              back over <strong>1,000 years</strong> of documented practice.
            </p>
          </motion.header>

          {/* Historical Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Ancient Origins */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300"
            >
              <div className="text-3xl mb-4">🌿</div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Ancient Foundations
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Ọ̀rúnmìlà taught the Yoruba people divination, herbal medicine,
                and spiritual healing practices, establishing the foundation of{" "}
                <strong>egbòogi</strong> - the holistic Yoruba medical system.
              </p>
            </motion.div>

            {/* Spiritual Integration */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300"
            >
              <div className="text-3xl mb-4">⚕️</div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Holistic Approach
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Yoruba medicine views health as a balance between the body,
                mind, and spirit, combining <strong>herbal remedies</strong>,
                rituals, and spiritual practices for complete healing.
              </p>
            </motion.div>

            {/* Historical Resilience */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300"
            >
              <div className="text-3xl mb-4">💪</div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Living Tradition
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Despite colonization and westernization, Yoruba medicine remains
                resilient and continues to exist today, adapting while
                preserving ancient wisdom.
              </p>
            </motion.div>

            {/* Knowledge System */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300"
            >
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Ifa Medicine System
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Yoruba traditional medicine, known as Ifa medicine, combines
                herbal remedies, rituals, and spiritual beliefs in a
                comprehensive healthcare approach.
              </p>
            </motion.div>

            {/* Master-Apprentice Tradition */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300"
            >
              <div className="text-3xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Oral Tradition
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Traditional medicine practitioners specialized in diagnosis,
                treatment, and healing methods passed down through generations
                via sacred <strong>master-apprentice relationships</strong>.
              </p>
            </motion.div>

            {/* Modern Relevance */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300"
            >
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Global Recognition
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The Yoruba people are considered among the oldest herbalists on
                the planet, with their healing systems now recognized worldwide
                for their effectiveness.
              </p>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="text-center mt-12 p-8 bg-green-900 text-white rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-4">
              Continue This Ancient Legacy
            </h3>
            <p className="text-green-100 mb-6 text-lg">
              Join thousands of students preserving and advancing traditional
              Yoruba medicine for future generations.
            </p>
            <a href="#programs">
              <button className="bg-white text-green-900 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors text-lg">
                Begin Your Journey
              </button>
            </a>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

function ProgramsSection() {
  const programs = [
    {
      id: 1,
      title: "Part-time (Weekend) Track",
      duration: "15 months",
      format: "Virtual",
      audience: "Practitioners and mature people with passion",
      programBegins: "25/09/2026",
      programBeginsISO: "2026-09-25",
      icon: "🌿",
    },
    {
      id: 2,
      title: "Full-time Track",
      duration: "15 months full-time + 3 months internship",
      format: "Hybrid (virtual and physical)",
      audience: "Secondary school certificate holders",
      programBegins: "21/09/2026",
      programBeginsISO: "2026-09-21",
      icon: "🎓",
    },
  ];

  return (
    <>
      {/* SEO Schema for Educational Programs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Oduduwa College of Yoruba Medicine",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Traditional Yoruba Medicine Programs",
              itemListElement: programs.map((program, index) => ({
                "@type": "Course",
                name: program.title,
                description: `${program.format} track for ${program.audience.toLowerCase()}.`,
                provider: {
                  "@type": "EducationalOrganization",
                  name: "Oduduwa College of Yoruba Medicine",
                },
                educationalCredentialAwarded: "Diploma",
                timeRequired: program.duration,
                courseMode: program.format.startsWith("Hybrid")
                  ? "Blended"
                  : "Online",
                startDate: program.programBeginsISO,
                position: index + 1,
              })),
            },
          }),
        }}
      />

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-4 sm:px-6 lg:px-20 py-16 bg-white text-gray-800 overflow-x-hidden"
        id="programs"
        aria-labelledby="programs-heading"
        style={{ scrollMarginTop: "5rem" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              id="programs-heading"
              className="text-3xl sm:text-4xl font-bold text-green-900 mb-6"
            >
              Our Programs
            </h2>
            <p className="text-lg sm:text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
              Choose the <strong>track</strong> that fits your life — flexible
              weekend study or an immersive full-time path — both preserving
              and advancing traditional Yoruba medicine.
            </p>
          </motion.header>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.2, duration: 0.8 }}
                className="bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-xl border-2 border-green-100 hover:border-green-300 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Program Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{program.icon}</div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                        {program.title}
                      </h3>
                      <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Program Details */}
                <dl className="space-y-3 mb-8">
                  <div className="flex gap-2">
                    <dt className="font-semibold text-green-900 w-36 flex-shrink-0">
                      Format:
                    </dt>
                    <dd className="text-gray-700">{program.format}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold text-green-900 w-36 flex-shrink-0">
                      For:
                    </dt>
                    <dd className="text-gray-700">{program.audience}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold text-green-900 w-36 flex-shrink-0">
                      Program begins:
                    </dt>
                    <dd className="text-gray-700">{program.programBegins}</dd>
                  </div>
                </dl>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-green-700 text-white py-3 px-6 rounded-xl hover:bg-green-800 transition-all duration-300 font-semibold hover:shadow-lg"
                  >
                    <button>Learn More</button>
                  </a>
                  <a
                    href="/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border-2 border-green-700 text-green-700 py-3 px-6 rounded-xl text-center hover:bg-green-700 hover:text-white transition-all duration-300 font-semibold"
                  >
                    <button className="">Enroll Now</button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits and Derivatives Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-16 bg-green-50 border-2 border-green-100 rounded-3xl p-8 sm:p-12 text-center"
          >
            <h3 className="text-sm sm:text-base font-semibold text-green-700 uppercase tracking-wide mb-3">
              Benefits and Derivatives of the Professional Diploma in Yoruba
              Medicine
            </h3>
            <h4 className="text-2xl sm:text-3xl font-bold text-green-900 mb-6">
              Don't look for a job. Build a Healing Empire.
            </h4>
            <div className="max-w-3xl mx-auto space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Programme's core philosophy is entrepreneurship, not
                employment. In 18 months, you will transform from a school
                leaver into a certified, confident, practicing Yoruba
                Medicine Professional — with the knowledge, skills, and
                business tools to build your own healing enterprise from day
                one.
              </p>
              <p>
                Every module is designed to build your capacity to own and
                operate a business. In 15 months, without leaving your job or
                disrupting your weekend, you will add a powerful professional
                qualification to your life — becoming a certified Yoruba
                Medicine practitioner with a ready-to-launch business plan in
                your hands.
              </p>
            </div>
          </motion.div>

          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="mt-16 text-center bg-gradient-to-r from-green-900 to-green-700 text-white p-12 rounded-3xl"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Begin Your Journey in Traditional Medicine?
            </h3>
            <p className="text-green-100 mb-8 text-lg max-w-2xl mx-auto">
              Join our community of traditional medicine practitioners and help
              preserve ancestral healing wisdom for future generations.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl mb-2">💻</div>
                <div className="font-semibold">Virtual & Hybrid Tracks</div>
                <div className="text-green-200 text-sm">
                  Study part-time or full-time
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">👨‍🏫</div>
                <div className="font-semibold">Expert Instruction</div>
                <div className="text-green-200 text-sm">
                  Learn from Dr. Jegede
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📜</div>
                <div className="font-semibold">Certified Programs</div>
                <div className="text-green-200 text-sm">
                  Recognized credentials
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact">
                <button className="bg-white text-green-900 px-8 py-4 rounded-xl font-bold hover:bg-green-50 transition-all duration-300 text-lg">
                  Contact Admissions
                </button>
              </a>
              {/* <a href="#contact">
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-green-900 transition-all duration-300 text-lg">
                Contact Admissions
              </button>
              </a> */}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}


function ContactFooterSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${baseURL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', program: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* SEO Schema for Contact */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Oduduwa College of Yoruba Medicine",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+234-802-298-1214",
              contactType: "Admissions",
              availableLanguage: ["English", "Yoruba"],
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "Beside Prof Oni's House, Oke Eruru",
              addressCountry: "Nigeria",
              addressRegion: "Osun State",
              addressLocality: "Ijebu Jesa",
            },
            founder: {
              "@type": "Person",
              name: "Dr. Jegede Obafemi",
              affiliation: "Institute of African Studies, University of Ibadan",
            },
          }),
        }}
      />

      {/* CONTACT SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-green-50 to-white text-gray-800 overflow-x-hidden"
        id="contact"
        aria-labelledby="contact-heading"
        style={{ scrollMarginTop: "5rem" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              id="contact-heading"
              className="text-3xl sm:text-4xl font-bold text-green-900 mb-6"
            >
              Get In Touch
            </h2>
            <p className="text-lg sm:text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
              Ready to begin your journey in traditional Yoruba medicine?
              Contact our admissions team for enrollment guidance and program
              information.
            </p>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* CONTACT FORM */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white p-8 rounded-3xl shadow-2xl border border-green-100"
            >
              <h3 className="text-2xl font-bold text-green-900 mb-6">
                Send Us a Message
              </h3>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  ❌ Failed to send message. Please try again or contact us directly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring focus:ring-green-200 focus:outline-none transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring focus:ring-green-200 focus:outline-none transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring focus:ring-green-200 focus:outline-none transition-all duration-300"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>

                {/* Program Interest */}
                <div>
                  <label
                    htmlFor="program"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Program of Interest
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring focus:ring-green-200 focus:outline-none transition-all duration-300"
                  >
                    <option value="">Select a program</option>
                    <option value="diploma">
                      Diploma in Traditional Yoruba Medicine
                    </option>
                    <option value="herbal">
                      Certificate in Herbal Medicine
                    </option>
                    <option value="foundation">
                      Foundation in Yoruba Wellness
                    </option>
                    <option value="professional">
                      Professional Practitioner Certification
                    </option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring focus:ring-green-200 focus:outline-none transition-all duration-300 resize-vertical"
                    placeholder="Tell us about your interest in traditional Yoruba medicine..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-700 text-white py-4 px-6 rounded-xl hover:bg-green-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* CONTACT INFO - Rest remains the same */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="space-y-8"
            >
              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Email */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      📧
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900 text-lg mb-2">
                        Email Us
                      </h4>
                      <p className="text-gray-700">
                        info@oyocam.org
                      </p>
                      <p className="text-gray-700">
                        admissions@oyocam.org
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      📞
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900 text-lg mb-2">
                        Call Us
                      </h4>
                      <p className="text-gray-700">+234 802 298 1214</p>
                      <p className="text-sm text-green-600">
                        Mon-Fri: 9AM - 6PM WAT
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      📱
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900 text-lg mb-2">
                        WhatsApp
                      </h4>
                      <p className="text-gray-700">+234 802 298 1214</p>
                      <p className="text-sm text-green-600">
                        Quick responses available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      📍
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900 text-lg mb-2">
                        Academic Affiliation
                      </h4>
                      <p className="text-gray-700">
                        Institute of African Studies
                      </p>
                      <p className="text-gray-700">
                        University of Ibadan, Nigeria
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-r from-green-700 to-green-600 p-8 rounded-2xl text-white">
                <h4 className="font-bold text-xl mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg transition-all duration-300 text-left">
                    📚 Download Program Brochure
                  </button>
                  <button className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg transition-all duration-300 text-left">
                    💬 Schedule a Consultation
                  </button>
                  <button className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg transition-all duration-300 text-left">
                    🎓 Apply for Admission
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FOOTER SECTION - Rest remains the same */}
      <footer className="bg-green-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* College Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/logo.png"
                  alt="Oduduwa College Logo"
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div>
                  <h3 className="text-xl font-bold">Oduduwa College</h3>
                  <p className="text-green-200">of Yoruba Medicine</p>
                </div>
              </div>
              <p className="text-green-100 leading-relaxed mb-6">
                Preserving and advancing traditional Yoruba medicine through
                structured online education, bridging ancient healing wisdom
                with modern learning methodologies.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  📘
                </button>
                <button className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  📷
                </button>
                <button className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  🐦
                </button>
                <button className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  💼
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-green-100">
                <li>
                  <a
                    href="#home"
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#our-roots"
                    className="hover:text-white transition-colors"
                  >
                    Our Roots
                  </a>
                </li>
                <li>
                  <a
                    href="#programs"
                    className="hover:text-white transition-colors"
                  >
                    Programs
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-lg font-bold mb-6">Our Programs</h4>
              <ul className="space-y-3 text-green-100">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Traditional Medicine Diploma
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Herbal Medicine Certificate
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Yoruba Wellness Foundation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Professional Certification
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-green-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-green-200 text-sm">
                <p>
                  &copy; 2025 Oduduwa College of Yoruba Medicine. All rights
                  reserved.
                </p>
                <p className="mt-1">
                  Founded by Dr. Jegede Obafemi, Institute of African Studies,
                  University of Ibadan
                </p>
              </div>

              <div className="flex space-x-6 text-sm text-green-200">
                <a href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="/copyright" className="hover:text-white transition-colors">
                  Copyright Laws
                </a>
              </div>
            </div>

            {/* Made by */}
            <div className="text-center mt-8 pt-4 border-t border-green-800">
              <p className="text-green-300 text-sm">
                Proudly developed with ❤️ for traditional medicine preservation
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
import { Helmet } from 'react-helmet';

export default function FullPageWebsite() {
  const currentYear = new Date().getFullYear();
  
  // Structured Data for the entire organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://oyocam.org/#organization",
    "name": "Oduduwa College of Yoruba Medicine",
    "alternateName": "OCOYAM",
    "url": "https://oyocam.org",
    "logo": {
      "@type": "ImageObject",
      "url": "https://oyocam.org/logo.png",
      "width": 400,
      "height": 400
    },
    "description": "Leading online institution for traditional Yoruba medicine education, offering comprehensive courses in herbal medicine, wellness practices, and ancestral healing wisdom.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Dr. Jegede Obafemi",
      "jobTitle": "Associate Professor",
      "affiliation": {
        "@type": "Organization",
        "name": "Institute of African Studies, University of Ibadan"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Beside Prof Oni's House, Oke Eruru",
      "addressCountry": "Nigeria",
      "addressRegion": "Osun State",
      "addressLocality": "Ijebu Jesa"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+234-802-298-1214",
        "contactType": "Admissions",
        "availableLanguage": ["English", "Yoruba"],
        "areaServed": "NG"
      },
      {
        "@type": "ContactPoint",
        "email": "info@oyocam.org",
        "contactType": "General Inquiry"
      }
    ],
    "sameAs": [],
    "educationalCredentialAwarded": "Certificate",
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "Traditional Yoruba Medicine Certificate",
      "description": "Comprehensive certification in traditional healing practices and herbal medicine"
    }
  };

  // Course offerings schema
  const coursesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Traditional Yoruba Medicine Courses",
    "description": "Part-time and full-time tracks in traditional Yoruba medicine and healing practices",
    "numberOfItems": 2,
    "itemListElement": [
      {
        "@type": "Course",
        "name": "Part-time (Weekend) Track",
        "description": "15-month virtual track for practitioners and mature people with passion. Program begins 25/09/2026.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Oduduwa College of Yoruba Medicine"
        },
        "courseMode": "online",
        "educationalCredentialAwarded": "Diploma"
      },
      {
        "@type": "Course",
        "name": "Full-time Track",
        "description": "15 months full-time plus 3 months internship, hybrid (virtual and physical), for secondary school certificate holders. Program begins 21/09/2026.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Oduduwa College of Yoruba Medicine"
        },
        "courseMode": "blended",
        "educationalCredentialAwarded": "Diploma"
      }
    ]
  };

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://oyocam.org/#website",
    "url": "https://oyocam.org",
    "name": "Oduduwa College of Yoruba Medicine",
    "description": "Online traditional Yoruba medicine education platform",
    "inLanguage": "en-NG",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://oyocam.org/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Oduduwa College of Yoruba Medicine | Online Traditional Healing Education Nigeria</title>
        <meta 
          name="description" 
          content="Learn authentic Yoruba traditional medicine online. Expert-led courses in herbal medicine, wellness practices, and ancestral healing wisdom. Founded by Dr. Jegede Obafemi. Enroll today!" 
        />
        <meta 
          name="keywords" 
          content="Yoruba medicine, traditional healing, herbal medicine Nigeria, online medical courses, African traditional medicine, Yoruba herbs, natural healing, traditional wellness, Dr Jegede Obafemi, University of Ibadan" 
        />
        <link rel="canonical" href="https://oyocam.org/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Oduduwa College of Yoruba Medicine - Learn Traditional Healing Online" />
        <meta 
          property="og:description" 
          content="Master authentic Yoruba traditional medicine through expert-led online courses. Study herbal medicine, wellness practices, and ancestral healing wisdom from anywhere in the world." 
        />
        <meta property="og:image" content="https://oyocam.org/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Oduduwa College of Yoruba Medicine - Traditional healing education" />
        <meta property="og:url" content="https://oyocam.org/" />
        <meta property="og:site_name" content="Oduduwa College of Yoruba Medicine" />
        <meta property="og:locale" content="en_NG" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Oduduwa College of Yoruba Medicine - Online Traditional Healing Education" />
        <meta 
          name="twitter:description" 
          content="Learn authentic Yoruba traditional medicine online. Expert courses in herbal medicine and ancestral healing wisdom. Start your journey today!" 
        />
        <meta name="twitter:image" content="https://oyocam.org/og-image.jpg" />
        <meta name="twitter:image:alt" content="Traditional Yoruba medicine education platform" />

        {/* Additional Meta Tags */}
        <meta name="author" content="Dr. Jegede Obafemi" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        {/* Geographic Meta Tags */}
        <meta name="geo.region" content="NG-OS" />
        <meta name="geo.placename" content="Ijebu Jesa, Nigeria" />
        <meta name="geo.position" content="7.6333;4.6833" />
        <meta name="ICBM" content="7.6333, 4.6833" />

        {/* Mobile and Accessibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#166534" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OCOYAM" />

        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.oyocam.org" />

        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(coursesSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>

        {/* Additional SEO Enhancement */}
        <meta name="news_keywords" content="traditional medicine, Yoruba healing, herbal medicine, African medicine, online education, cultural preservation" />
        <meta name="article:author" content="Dr. Jegede Obafemi" />
        <meta name="article:publisher" content="Oduduwa College of Yoruba Medicine" />
        
        {/* Educational specific meta */}
        <meta name="DC.Type" content="Text" />
        <meta name="DC.Format" content="text/html" />
        <meta name="DC.Language" content="en" />
        <meta name="DC.Creator" content="Oduduwa College of Yoruba Medicine" />
        <meta name="DC.Subject" content="Traditional Medicine Education" />
        <meta name="DC.Coverage" content="Global" />
        <meta name="DC.Rights" content="© {currentYear} Oduduwa College of Yoruba Medicine. All rights reserved." />

        {/* Verification Tags (add when you get them) */}
        {/* <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" /> */}

        {/* Hreflang for future international versions */}
        <link rel="alternate" hrefLang="en" href="https://oyocam.org/" />
        <link rel="alternate" hrefLang="yo" href="https://oyocam.org/?lang=yo" />

        {/* Page Loading Optimization */}
        <link rel="preload" href="/hero-bg.jpg" as="image" type="image/jpeg" />
        <link rel="prefetch" href="/about-image.jpg" />
      </Helmet>

      <main itemScope itemType="https://schema.org/EducationalOrganization">
        {/* Hidden structured data for screen readers and search engines */}
        <div style={{ display: 'none' }}>
          <h1 itemProp="name">Oduduwa College of Yoruba Medicine</h1>
          <meta itemProp="description" content="Leading online institution for traditional Yoruba medicine education" />
          <meta itemProp="url" content="https://oyocam.org" />
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <meta itemProp="streetAddress" content="Beside Prof Oni's House, Oke Eruru" />
            <meta itemProp="addressCountry" content="Nigeria" />
            <meta itemProp="addressRegion" content="Osun State" />
            <meta itemProp="addressLocality" content="Ijebu Jesa" />
          </div>
        </div>

        <Navbar />
        <Hero />
        <AboutSection />
        <OurRootsSection />
        <ProgramsSection />
        <ContactFooterSection />
      </main>
    </>
  );
}