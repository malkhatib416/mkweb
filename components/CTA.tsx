'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Clock, Shield, Star, CheckCircle } from 'lucide-react';
import NavLink from './NavLink';

const benefits = [
  {
    icon: MessageCircle,
    text: 'Réponse sous 24h'
  },
  {
    icon: Clock,
    text: 'Livraison rapide'
  },
  {
    icon: Shield,
    text: 'Garantie qualité'
  }
];

const testimonialHighlights = [
  "\"Travail exceptionnel, délais respectés\"",
  "\"Site performant qui convertit vraiment\"",
  "\"Support réactif et professionnel\""
];

const CTA = () => (
  <SectionWrapper className="bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
    {/* Enhanced background decoration */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-myorange-100/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>
    
    <div className="custom-screen relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center"
      >
        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>5.0/5 - Clients satisfaits</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>50+ projets réalisés</span>
          </div>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight" id="oss">
          <span className="text-white">Prêt à transformer</span>
          <br />
          <span className="bg-gradient-to-r from-myorange-100 via-red-500 to-orange-600 bg-clip-text text-transparent">
            votre vision en réalité ?
          </span>
        </h2>
        
        <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Rejoignez les entrepreneurs qui ont choisi l'excellence. 
          Obtenez un site web qui génère de vrais résultats pour votre business.
        </p>
        
        {/* Testimonial highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {testimonialHighlights.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-white/90 italic text-sm">{testimonial}</p>
              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-white/90">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <benefit.icon className="w-5 h-5" />
              </div>
              <span className="font-semibold">{benefit.text}</span>
            </div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
        >
          <NavLink
            href="/nous-contacter"
            className="text-gray-900 bg-white hover:bg-gray-100 active:bg-gray-200 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 flex items-center gap-3 group border-2 border-white/20"
          >
            Démarrer mon projet maintenant
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </NavLink>
          
          <a 
            href="tel:+33646777804"
            className="text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/10 px-10 py-5 rounded-2xl font-bold text-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            Appeler maintenant
          </a>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <p className="text-white/70 text-lg">
            <span className="text-myorange-100 font-bold">Consultation gratuite de 30 minutes</span> • 
            Devis détaillé sous 24h • Sans engagement
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm">
            <span>✓ Analyse de vos besoins</span>
            <span>✓ Conseils personnalisés</span>
            <span>✓ Estimation précise</span>
            <span>✓ Roadmap détaillée</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </SectionWrapper>
);

const SectionWrapper = ({ children, className = '', ...props }: any) => (
  <section {...props} className={`py-32 ${className}`}>
    {children}
  </section>
);

export default CTA;