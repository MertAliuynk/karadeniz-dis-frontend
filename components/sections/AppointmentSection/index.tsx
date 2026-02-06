"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import GradientButton from '@/components/common/GradientButton';
import StepIndicator from '@/components/common/StepIndicator';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Clinic {
  id: number;
  name: string;
  image: string;
}

interface Doctor {
  id: number;
  name: string;
  image: string;
}

interface AppointmentData {
  clinicId?: string;
  doctorId?: string;
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
}

const AppointmentSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({});
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [bookedHours, setBookedHours] = useState<string[]>([]);
  
  // Sayfalama state'leri
  const [currentClinicPage, setCurrentClinicPage] = useState<number>(1);
  const [currentDoctorPage, setCurrentDoctorPage] = useState<number>(1);
  const itemsPerPage = 8; // Sayfa başına gösterilecek öğe sayısı

  const steps = ['Klinik Seç', 'Hekim Seç', 'Tarih ve Saat Seç', 'Kayıt Bilgileri', 'Onayla'];

  // Sayfalama için klinikler
  const totalClinicPages = Math.ceil(clinics.length / itemsPerPage);
  const paginatedClinics = clinics.slice(
    (currentClinicPage - 1) * itemsPerPage,
    currentClinicPage * itemsPerPage
  );

  // Sayfalama için doktorlar
  const totalDoctorPages = Math.ceil(doctors.length / itemsPerPage);
  const paginatedDoctors = doctors.slice(
    (currentDoctorPage - 1) * itemsPerPage,
    currentDoctorPage * itemsPerPage
  );

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const clinicsRes = await axios.get('https://webapi.karadenizdis.com/api/clinics');
        setClinics(clinicsRes.data);
        setLoading(false);
      } catch (err: any) {
        setError('Klinik verileri yüklenemedi: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  useEffect(() => {
    if (appointmentData.clinicId) {
      const fetchDoctors = async () => {
        try {
          const doctorsRes = await axios.get(`https://webapi.karadenizdis.com/api/doctors?clinicId=${appointmentData.clinicId}`);
          setDoctors(doctorsRes.data);
        } catch (err: any) {
          setError('Doktorlar yüklenemedi: ' + (err.response?.data?.error || err.message));
        }
      };
      fetchDoctors();
    } else {
      setDoctors([]);
    }
  }, [appointmentData.clinicId]);

  useEffect(() => {
    if (selectedDate && appointmentData.doctorId) {
      const fetchAppointments = async () => {
        try {
          const response = await axios.get(
            `https://webapi.karadenizdis.com/api/appointments/doctor/${appointmentData.doctorId}/date/${selectedDate}`
          );
          const booked = response.data.bookedSlots || [];
          setBookedHours(booked);
          const allHours = generateTimeOptions();
          const available = allHours.filter(hour => !booked.includes(hour));
          setAvailableHours(available);
        } catch (err: any) {
          setError('Randevu saatleri yüklenemedi: ' + (err.response?.data?.error || err.message));
        }
      };
      fetchAppointments();
    }
  }, [selectedDate, appointmentData.doctorId]);

  const handleNextStep = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      setIsTransitioning(false);
    }, 300);
  };

  const handlePreviousStep = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      setIsTransitioning(false);
    }, 300);
  };

  const handleClinicSelect = (id: number) => {
    setAppointmentData((prev) => ({ ...prev, clinicId: id.toString(), doctorId: undefined }));
  };

  const handleDoctorSelect = (id: number) => {
    setAppointmentData((prev) => ({ ...prev, doctorId: id.toString() }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setAppointmentData(prev => ({ ...prev, date, time: undefined }));
  };

  const handleTimeSelect = (time: string) => {
    if (!bookedHours.includes(time)) {
      setAppointmentData(prev => ({ ...prev, time }));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCompleteAppointment = async () => {
    const payload = {
      clinic_id: appointmentData.clinicId,
      doctor_id: appointmentData.doctorId,
      date: appointmentData.date,
      time_slot: appointmentData.time,
      name: appointmentData.name,
      phone: appointmentData.phone,
    };
    console.log('Gönderilen randevu verisi:', payload);
    try {
      const response = await axios.post('https://webapi.karadenizdis.com/api/appointments', payload);
      setCurrentStep(0);
      setAppointmentData({});
      setError('');
      setSuccessMessage('Randevunuz başarıyla oluşturuldu! SMS ile bilgilendirileceksiniz.');
      toast.success('Randevunuz başarıyla oluşturuldu!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Randevu kaydedilemedi';
      setError(errorMessage);
      console.error('Randevu hatası:', err.response?.data || err);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 10; hour < 18; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  if (loading) {
    return <div className="text-gray-600 text-center p-4">Yükleniyor...</div>;
  }

  return (
    <div id="appointment-section" className="w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] flex flex-col items-center p-2 sm:p-4 lg:p-8 space-y-3 sm:space-y-4 lg:space-y-5 bg-white">
      {typeof window !== 'undefined' && <ToastContainer />}
      
      {successMessage && (
        <div className="text-green-500 text-center p-4 bg-green-100 rounded-lg">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <h2 className="font-bold text-2xl sm:text-3xl lg:text-5xl py-2 sm:py-3 lg:py-5 bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent text-center">
          Sizi Bekliyoruz
        </h2>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <div>
        <p className="heartbeat font-thin text-base sm:text-lg lg:text-2xl bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent animate-pulse text-center">
          Ön Muayene ve Röntgen Çekimi Ücretsizdir
        </p>
      </div>

      {currentStep === 0 && (
        <GradientButton onClick={() => setCurrentStep(1)} ariaLabel="Randevu al">
          Randevu Al
        </GradientButton>
      )}

      {currentStep === 1 && (
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8 w-full">
          {/* Klinikler grid */}
          <div className="w-full max-w-6xl px-2 sm:px-4">
            <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-3 sm:flex-wrap sm:overflow-x-visible sm:justify-center pb-4">
              {paginatedClinics.length === 0 ? (
                <div className="flex-shrink-0 w-full text-center py-8">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Klinik bulunmamaktadır.
                  </p>
                </div>
              ) : (
                paginatedClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    onClick={() => handleClinicSelect(clinic.id)}
                    className={`flex-shrink-0 w-48 sm:w-56 lg:w-64 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      appointmentData.clinicId === clinic.id.toString()
                        ? 'border-[#4964A9] bg-[#4964A9]/5 shadow-md'
                        : 'border-gray-300 hover:border-[#4964A9]/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {clinic.image ? (
                          <img
                            src={`https://webapi.karadenizdis.com${clinic.image}`}
                            alt={clinic.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl sm:text-3xl lg:text-4xl text-gray-500">🏥</span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-center text-gray-800">
                        {clinic.name}
                      </h3>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sayfalama butonları */}
          {totalClinicPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => setCurrentClinicPage(prev => Math.max(prev - 1, 1))}
                disabled={currentClinicPage === 1}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Önceki
              </button>
              
              <span className="text-sm text-gray-600">
                Sayfa {currentClinicPage} / {totalClinicPages}
              </span>
              
              <button
                onClick={() => setCurrentClinicPage(prev => Math.min(prev + 1, totalClinicPages))}
                disabled={currentClinicPage === totalClinicPages}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Sonraki
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full justify-center px-2">
            <GradientButton
              onClick={() => setCurrentStep(0)}
              ariaLabel="Geri"
              className="w-full sm:w-auto"
            >
              Geri
            </GradientButton>
            <GradientButton
              onClick={handleNextStep}
              disabled={!appointmentData.clinicId}
              ariaLabel="İleri"
              className="w-full sm:w-auto"
            >
              İleri
            </GradientButton>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8 w-full">
          {/* Hekimler grid */}
          <div className="w-full max-w-6xl px-2 sm:px-4">
            <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-3 sm:flex-wrap sm:overflow-x-visible sm:justify-center pb-4">
              {paginatedDoctors.length === 0 ? (
                <div className="flex-shrink-0 w-full text-center py-8">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Bu klinikte doktor bulunmamaktadır.
                  </p>
                </div>
              ) : (
                paginatedDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => {console.log("[DOCTOR SELECT]", doctor); handleDoctorSelect(doctor.id);}}
                    className={`flex-shrink-0 w-48 sm:w-56 lg:w-64 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      appointmentData.doctorId === doctor.id.toString()
                        ? 'border-[#4964A9] bg-[#4964A9]/5 shadow-md'
                        : 'border-gray-300 hover:border-[#4964A9]/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {doctor.image ? (
                          <img
                            src={`https://webapi.karadenizdis.com${doctor.image}`}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl sm:text-3xl lg:text-4xl text-gray-500">👨‍⚕️</span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-center text-gray-800">
                        {doctor.name}
                      </h3>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sayfalama butonları */}
          {totalDoctorPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => setCurrentDoctorPage(prev => Math.max(prev - 1, 1))}
                disabled={currentDoctorPage === 1}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Önceki
              </button>
              
              <span className="text-sm text-gray-600">
                Sayfa {currentDoctorPage} / {totalDoctorPages}
              </span>
              
              <button
                onClick={() => setCurrentDoctorPage(prev => Math.min(prev + 1, totalDoctorPages))}
                disabled={currentDoctorPage === totalDoctorPages}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Sonraki
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full justify-center px-2">
            <GradientButton onClick={handlePreviousStep} ariaLabel="Geri" className="w-full sm:w-auto">
              Geri
            </GradientButton>
            <GradientButton
              onClick={handleNextStep}
              disabled={!appointmentData.doctorId}
              ariaLabel="İleri"
              className="w-full sm:w-auto"
            >
              İleri
            </GradientButton>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8 w-full">
          <div className="relative w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] px-2">
            <input
              type="date"
              onChange={handleDateChange}
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#4964A9] transition-all duration-300 bg-white text-gray-800 font-semibold text-center shadow-md hover:shadow-lg text-sm sm:text-base"
              aria-label="Tarih seç"
            />
          </div>

          {selectedDate && (
            <div className="w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] px-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 text-center">Müsait Saatler</h3>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {(() => {
                  const selectedDoctor = doctors.find(d => d.id.toString() === appointmentData.doctorId);
                  const isBlocked = selectedDoctor && (selectedDoctor.name.includes("Murat KARAKUZU") || selectedDoctor.name.includes("Kübra UĞURLU"));
                  return generateTimeOptions().map((time) => {
                    const isBooked = bookedHours.includes(time) || isBlocked;
                    const isSelected = appointmentData.time === time;
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        disabled={isBooked}
                        className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                          isBooked
                            ? 'bg-red-100 text-red-500 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-[#4964A9] text-white shadow-lg scale-105'
                            : 'bg-white text-gray-800 hover:bg-gray-100 border-2 border-gray-200 hover:border-[#4964A9] hover:scale-105'
                        } min-h-[40px] sm:min-h-[48px]`}
                      >
                        {time}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full justify-center px-2">
            <GradientButton onClick={handlePreviousStep} ariaLabel="Geri" className="w-full sm:w-auto">
              Geri
            </GradientButton>
            <GradientButton
              onClick={handleNextStep}
              disabled={!appointmentData.date || !appointmentData.time}
              ariaLabel="İleri"
              className="w-full sm:w-auto"
            >
              İleri
            </GradientButton>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8 w-full">
          <div className="w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] space-y-4 px-2">
          <input
            type="text"
            name="name"
            placeholder="Ad Soyad"
            onChange={handleFormChange}
            value={appointmentData.name || ''}
              className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9] transition-all duration-300 text-sm sm:text-base placeholder-gray-500"
            aria-label="Ad Soyad"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Telefon Numarası"
            onChange={handleFormChange}
            value={appointmentData.phone || ''}
              className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9] transition-all duration-300 text-sm sm:text-base placeholder-gray-500"
            aria-label="Telefon Numarası"
          />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full justify-center px-2">
            <GradientButton onClick={handlePreviousStep} ariaLabel="Geri" className="w-full sm:w-auto">
              Geri
            </GradientButton>
            <GradientButton
              onClick={handleNextStep}
              disabled={!appointmentData.name || !appointmentData.phone}
              ariaLabel="İleri"
              className="w-full sm:w-auto"
            >
              İleri
            </GradientButton>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8 w-full">
          <div className="w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] bg-gray-50 rounded-xl p-4 sm:p-6 shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-4">
              Randevu Özeti
            </h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Klinik:</span>
                <span className="text-gray-800">{clinics.find((c) => c.id.toString() === appointmentData.clinicId)?.name || 'Seçilmedi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Hekim:</span>
                <span className="text-gray-800">{doctors.find((d) => d.id.toString() === appointmentData.doctorId)?.name || 'Seçilmedi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Tarih:</span>
                <span className="text-gray-800">{appointmentData.date || 'Seçilmedi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Saat:</span>
                <span className="text-gray-800">{appointmentData.time || 'Seçilmedi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Ad Soyad:</span>
                <span className="text-gray-800">{appointmentData.name || 'Girilmedi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Telefon:</span>
                <span className="text-gray-800">{appointmentData.phone || 'Girilmedi'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full justify-center px-2">
            <GradientButton onClick={handlePreviousStep} ariaLabel="Geri" className="w-full sm:w-auto">
              Geri
            </GradientButton>
            <GradientButton
              onClick={handleCompleteAppointment}
              ariaLabel="Randevuyu tamamla"
              className="w-full sm:w-auto"
            >
              Randevuyu Tamamla
            </GradientButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentSection;