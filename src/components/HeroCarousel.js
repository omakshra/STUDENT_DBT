import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Award, Users, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Welcome to DBT Student Portal",
      subtitle: "Your Gateway to Seamless Scholarship Management",
      description: "Track your scholarship applications, manage DBT settings, and stay updated with the latest opportunities all in one place.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      icon: Award,
      color: "from-teal-500 to-lime-500",
      stats: { value: "2.5M+", label: "Students Benefited" }
    },
    {
      id: 2,
      title: "Direct Benefit Transfer",
      subtitle: "Faster, Transparent, Reliable",
      description: "Experience the power of DBT-enabled accounts with instant scholarship disbursements and real-time tracking.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      icon: TrendingUp,
      color: "from-green-600 to-teal-600",
      stats: { value: "85%", label: "Faster Processing" }
    },
    {
      id: 3,
      title: "Join the Community",
      subtitle: "Connect with Fellow Students",
      description: "Be part of a growing community of students who have successfully enabled DBT and are receiving their scholarships on time.",
      image: "https://images.unsplash.com/photo-1523240798036-6b216ae0a944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      icon: Users,
      color: "from-slate-600 to-gray-800",
      stats: { value: "1.8M+", label: "Active Users" }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl shadow-2xl">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 transform translate-x-0'
                : index < currentSlide
                ? 'opacity-0 transform -translate-x-full'
                : 'opacity-0 transform translate-x-full'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80`}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="max-w-2xl">
                  <div className="flex items-center mb-4">
                    <slide.icon className="h-8 w-8 text-white mr-3" />
                    <span className="text-white/90 text-lg font-medium">{slide.subtitle}</span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  
                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex items-center space-x-6">
                    <Button 
                      size="lg" 
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Get Started
                    </Button>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{slide.stats.value}</div>
                      <div className="text-white/80 text-sm">{slide.stats.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default HeroCarousel;
