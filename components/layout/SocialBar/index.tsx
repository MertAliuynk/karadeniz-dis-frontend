"use client";
import React, { useState, useEffect } from 'react'
import { FaInstagram, FaWhatsapp, FaFacebook, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';

interface Branch {
  id: string;
  name: string;
  phone?: string;
  image?: string;
  address?: string;
  email?: string;
}

const SocialBar = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showWhatsAppMenu, setShowWhatsAppMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('https://webapi.karadenizdis.com/api/branches');
        setBranches(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Branch verileri yüklenemedi:', error);
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppClick = (phone?: string, branchName?: string) => {
    if (phone) {
      let cleanPhone = phone.replace(/[^\d]/g, '');
      
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '90' + cleanPhone.substring(1);
      } else if (!cleanPhone.startsWith('90')) {
        cleanPhone = '90' + cleanPhone;
      }
      
      // Otomatik mesaj oluştur
      const message = `Merhaba, ${branchName || 'şube'} hakkında bilgi almak istiyorum.`;
      const encodedMessage = encodeURIComponent(message);
      
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else {
      const defaultPhone = '905555555555';
      const message = 'Merhaba, bilgi almak istiyorum.';
      const encodedMessage = encodeURIComponent(message);
      
      const whatsappUrl = `https://wa.me/${defaultPhone}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    setShowWhatsAppMenu(false);
  };

  return (
    <div className="fixed right-2 xs:right-3 sm:right-5 bottom-2 xs:bottom-3 sm:bottom-5 h-35 w-30 flex flex-col items-center space-y-1 xs:space-y-2 z-50">
      <button
        onClick={() => handleSocialClick('https://www.instagram.com/')}
        className="p-1.5 xs:p-2 rounded-full hover:bg-gradient-to-r from-[#4964A9] to-[#022171] hover:text-white transition-all duration-300"
        aria-label="Instagram"
      >
        <FaInstagram color="#E1306C" className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 hover:text-white transition-colors duration-300" />
      </button>
      
      {/* WhatsApp Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowWhatsAppMenu(!showWhatsAppMenu)}
          className="p-1.5 xs:p-2 rounded-full hover:bg-gradient-to-r from-[#4964A9] to-[#022171] hover:text-white transition-all duration-300 flex items-center"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-[#25D366] hover:text-white transition-colors duration-300" />
          <FaChevronDown className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 ml-0.5 xs:ml-1 text-[#25D366] hover:text-white transition-colors duration-300" />
        </button>
        
        {showWhatsAppMenu && (
          <div className="absolute bottom-0 right-full mr-2 bg-white rounded-lg shadow-lg border border-gray-200 w-[180px] xs:w-[200px] sm:w-[240px] max-h-[250px] xs:max-h-[300px] overflow-y-auto">
            <div className="p-2">
              <div className="flex items-center mb-1.5 xs:mb-2 pb-1 border-b border-gray-100">
                <FaWhatsapp className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-[#25D366] mr-1" />
                <p className="text-[10px] xs:text-xs font-medium text-gray-700">Şube Seçin</p>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-3 xs:py-4">
                  <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-[#25D366]"></div>
                  <span className="ml-1 text-[10px] xs:text-xs text-gray-500">Yükleniyor...</span>
                </div>
              ) : branches.length > 0 ? (
                <div className="space-y-1">
                  {branches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => handleWhatsAppClick(branch.phone, branch.name)}
                      className="w-full text-left p-1.5 xs:p-2 rounded border border-gray-100 hover:border-[#25D366] hover:bg-green-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[10px] xs:text-xs text-gray-800 group-hover:text-[#25D366] transition-colors duration-200 truncate">
                            {branch.name}
                          </h4>
                          {branch.phone && (
                            <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-500 mt-0.5 group-hover:text-gray-600 truncate">
                              {branch.phone}
                            </p>
                          )}
                        </div>
                        <FaWhatsapp className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 xs:py-4">
                  <FaWhatsapp className="w-4 h-4 xs:w-5 xs:h-5 mx-auto mb-1 text-[#25D366] opacity-50" />
                  <p className="text-[10px] xs:text-xs text-gray-500">Şube bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => handleSocialClick('https://www.facebook.com/')}
        className="p-1.5 xs:p-2 rounded-full hover:bg-gradient-to-r from-[#4964A9] to-[#022171] hover:text-white transition-all duration-300"
        aria-label="Facebook"
      >
        <FaFacebook className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-[#1877F2] hover:text-white transition-colors duration-300" />
      </button>
    </div>
  )
}

export default SocialBar