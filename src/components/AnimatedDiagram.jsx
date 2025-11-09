import React from 'react';
import { motion } from 'framer-motion';
import { FileText, MapPin, CheckCircle2, User, Banknote, ArrowRight } from 'lucide-react';

const diagramVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AnimatedDiagram = ({ stepId }) => {
  const renderDiagram = () => {
    switch (stepId) {
      case 1:
        return (
          <motion.div variants={diagramVariants} initial="hidden" animate="visible" className="flex items-center justify-center p-6 bg-gray-50 rounded-xl shadow-inner">
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <FileText size={48} className="text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Aadhaar</span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center mx-10">
              <Banknote size={48} className="text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Bank Passbook</span>
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div variants={diagramVariants} initial="hidden" animate="visible" className="flex items-center justify-center p-6 bg-gray-50 rounded-xl shadow-inner">
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <User size={48} className="text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">You</span>
            </motion.div>
            <motion.div variants={itemVariants} className="mx-8">
              <MapPin size={48} className="text-orange-500 animate-bounce" />
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <Banknote size={48} className="text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Bank Branch</span>
            </motion.div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div variants={diagramVariants} initial="hidden" animate="visible" className="flex items-center justify-center p-6 bg-gray-50 rounded-xl shadow-inner">
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <FileText size={48} className="text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Filled Form</span>
            </motion.div>
            <motion.div 
              variants={itemVariants} 
              className="mx-8"
              animate={{ x: [0, 20, 0], opacity: [0, 1, 1], rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <ArrowRight size={48} className="text-gray-400" />
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <User size={48} className="text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Bank Officer</span>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Visual Guide:</h4>
      {renderDiagram()}
    </div>
  );
};

export default AnimatedDiagram;
