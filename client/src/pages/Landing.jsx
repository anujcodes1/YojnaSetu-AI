import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle, Users, BookOpen, Shield,
         ChevronLeft, ChevronRight, Star, Globe, Award, TrendingUp } from 'lucide-react';

const quotes = [
  { text: "सबका साथ, सबका विकास, सबका विश्वास", translation: "Together, Development for All, Trust of All", author: "PM Narendra Modi" },
  { text: "The government's duty is to ensure that every citizen gets their rightful benefit.", translation: "हर नागरिक को उसका हक मिले", author: "Government of India" },
  { text: "Empowering citizens through information is the foundation of good governance.", translation: "सूचना से सशक्तिकरण", author: "Digital India Mission" },
  { text: "जन धन, जन शक्ति, जन सेवा", translation: "People's Wealth, People's Power, People's Service", author: "Financial Inclusion Mission" },
  { text: "A nation's strength lies in the welfare of its every citizen.", translation: "राष्ट्र की शक्ति हर नागरिक की भलाई में है", author: "Sarva Shiksha Abhiyan" },
];

const stats = [
  { icon: BookOpen, value: '25+', label: 'Government Schemes', color: 'bg-blue-50 text-blue-600' },
  { icon: Users, value: '100Cr+', label: 'Citizens Benefited', color: 'bg-saffron-50 text-saffron-600' },
  { icon: Globe, value: '28', label: 'States Covered', color: 'bg-green-50 text-green-600' },
  { icon: Award, value: 'Free', label: 'Always Free', color: 'bg-purple-50 text-purple-600' },
];

const categories = [
  { icon: '🌾', label: 'Agriculture', count: '12+', color: 'bg-green-50 hover:bg-green-100' },
  { icon: '📚', label: 'Education', count: '8+', color: 'bg-blue-50 hover:bg-blue-100' },
  { icon: '🏥', label: 'Health', count: '6+', color: 'bg-red-50 hover:bg-red-100' },
  { icon: '👩', label: 'Women', count: '10+', color: 'bg-pink-50 hover:bg-pink-100' },
  { icon: '🚀', label: 'Startup', count: '5+', color: 'bg-purple-50 hover:bg-purple-100' },
  { icon: '🏠', label: 'Housing', count: '4+', color: 'bg-orange-50 hover:bg-orange-100' },
  { icon: '💼', label: 'Employment', count: '7+', color: 'bg-yellow-50 hover:bg-yellow-100' },
  { icon: '🛠️', label: 'Skills', count: '9+', color: 'bg-teal-50 hover:bg-teal-100' },
];

const features = [
  { icon: Sparkles, title: 'AI-Powered Matching', desc: 'Gemini AI analyzes your profile and instantly matches you to schemes you qualify for.', color: 'text-saffron-600 bg-saffron-50' },
  { icon: CheckCircle, title: 'Eligibility Checker', desc: 'Know exactly which criteria you meet and what documents you need before applying.', color: 'text-green-600 bg-green-50' },
  { icon: Shield, title: 'Verified & Official', desc: 'All schemes are from official government sources with direct application links.', color: 'text-blue-600 bg-blue-50' },
  { icon: TrendingUp, title: 'Profile-Based', desc: 'The more complete your profile, the more accurate and relevant your recommendations.', color: 'text-purple-600 bg-purple-50' },
];

const steps = [
  { step: '01', title: 'Create Free Account', desc: 'Sign up in 30 seconds — no documents needed.' },
  { step: '02', title: 'Complete Your Profile', desc: 'Tell us your age, location, income and occupation.' },
  { step: '03', title: 'Get AI Recommendations', desc: 'Gemini AI matches you to schemes you qualify for.' },
  { step: '04', title: 'Apply with Guidance', desc: 'Get document checklists and direct application links.' },
];

export default function Landing() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote(prev => (prev + 1) % quotes.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevQuote = () => {
    setCurrentQuote(prev => (prev - 1 + quotes.length) % quotes.length);
  };

  const nextQuote = () => {
    setCurrentQuote(prev => (prev + 1) % quotes.length);
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-700 to-saffron-700 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-saffron-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>

        {/* Ashoka Chakra watermark */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 text-[200px] select-none hidden lg:block">
          ☸
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles size={14} className="text-saffron-300" />
              <span className="text-sm text-white/90">AI-Powered Government Assistance Platform</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Find Government<br />
              Schemes<br />
              <span className="text-saffron-300">Made for You</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
              YojnaSetu AI bridges the gap between citizens and government benefits. Get
              personalized scheme recommendations based on your profile with AI-powered
              eligibility checking.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95">
                Start for Free <ArrowRight size={18} />
              </Link>
              <Link to="/schemes" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl transition-all">
                <BookOpen size={18} /> Browse Schemes
              </Link>
            </div>
          </div>
        </div>

        {/* Tricolor bottom bar */}
        <div className="flex h-1.5">
          <div className="flex-1 bg-saffron-400" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-green-500" />
        </div>
      </section>

      {/* Government Quote Ticker */}
      <section className="bg-navy-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-saffron-400 text-2xl">❝</span>
          </div>
          <p className={`font-display text-xl sm:text-2xl font-semibold mb-2 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {quotes[currentQuote].text}
          </p>
          <p className="text-white/60 text-sm mb-1 italic">
            "{quotes[currentQuote].translation}"
          </p>
          <p className="text-saffron-400 text-sm font-medium">
            — {quotes[currentQuote].author}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={prevQuote} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5">
              {quotes.map((_, i) => (
                <button key={i} onClick={() => setCurrentQuote(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentQuote ? 'bg-saffron-400 w-4' : 'bg-white/30'}`} />
              ))}
            </div>
            <button onClick={nextQuote} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-xl text-navy-800">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-saffron-600 font-semibold text-sm uppercase tracking-wider">Browse by Category</span>
          <h2 className="font-display font-bold text-3xl text-navy-800 mt-2">Schemes for Everyone</h2>
          <p className="text-gray-500 mt-2">From farmers to students, women to senior citizens — we cover it all.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map(({ icon, label, count, color }) => (
            <Link key={label} to={`/schemes?category=${label.toLowerCase()}`}
              className={`${color} rounded-2xl p-4 text-center transition-all cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm group`}>
              <span className="text-3xl mb-2 block">{icon}</span>
              <p className="text-xs font-semibold text-gray-700 group-hover:text-navy-800">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-saffron-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="font-display font-bold text-3xl text-navy-800 mt-2">How YojnaSetu Works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-dashed border-t-2 border-dashed border-gray-200 z-0" />
                )}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative z-10">
                  <div className="w-12 h-12 bg-saffron-600 text-white rounded-xl flex items-center justify-center font-display font-bold text-lg mb-4">
                    {step}
                  </div>
                  <h3 className="font-semibold text-navy-800 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-saffron-600 font-semibold text-sm uppercase tracking-wider">Why YojnaSetu</span>
          <h2 className="font-display font-bold text-3xl text-navy-800 mt-2">Everything You Need</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-navy-800 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Government Notice Style Banner */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🇮🇳</span>
            <span className="font-display font-bold text-navy-800 text-lg">भारत सरकार — Government of India</span>
            <span className="text-2xl">🇮🇳</span>
          </div>
          <p className="text-amber-800 text-sm font-medium mb-1">
            This platform provides information about government schemes for awareness purposes only.
          </p>
          <p className="text-amber-700 text-sm">
            सभी जानकारी सरकारी स्रोतों से ली गई है। All information sourced from official government portals.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-amber-700">
            <span>✓ myscheme.gov.in verified</span>
            <span>✓ india.gov.in aligned</span>
            <span>✓ Digital India initiative</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-navy-800 to-saffron-700 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Ready to find your schemes?
          </h2>
          <p className="text-white/75 mb-8 text-lg">
            Create a free account, complete your profile, and get AI-matched to
            schemes you qualify for.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg active:scale-95">
            Create Free Account <ArrowRight size={20} />
          </Link>
          <p className="text-white/50 text-sm mt-4">Free forever • No documents required • 2 minute setup</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-saffron-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">YS</span>
            </div>
            <div>
              <p className="font-display font-bold text-sm">YojnaSetu AI</p>
              <p className="text-xs text-white/50">Built for Indian Citizens</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-white/60">
            <Link to="/schemes" className="hover:text-white transition-colors">All Schemes</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
          <p className="text-white/40 text-xs">Build by Anuj Mishra </p>
        </div>
      </footer>

    </div>
  );
}