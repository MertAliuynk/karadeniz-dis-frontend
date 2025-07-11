"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Clinic {
  id: string;
  name: string;
  image: string;
  phone?: string;
}

interface Doctor {
  id: string;
  name: string;
  clinic_id: string;
  image: string;
}

interface Feedback {
  id: string;
  name: string;
  comment: string;
  rating: number;
  image: string;
}

interface Treatment {
  id: number;
  title: string;
  short_description: string;
  description: string;
  content: {
    sections: Array<{
      title: string;
      content: string;
      links?: Array<{
        text: string;
        url: string;
      }>;
    }>;
  };
  image: string | File;
  slug: string;
  meta_title: string;
  meta_description: string;
  featured: boolean;
  order_index: number;
}

interface Video {
  id: string;
  video_id: string;
  title: string;
  description: string;
  long_description: string;
}

interface Branch {
  id: string;
  name: string;
  image: string;
  address?: string;
  phone?: string;
  email?: string;
  gallery?: string[];
}

interface Appointment {
  id: number;
  clinic_id: string;
  doctor_id: string;
  date: string;
  time_slot: string;
  name: string;
  phone: string;
  status: string;
}

interface PriceItem {
  id: number;
  category: string;
  name: string;
  min_price: number;
  max_price: number;
  description: string;
}

interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  showNames?: boolean;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  is_active: boolean;
}

interface TimelineItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

const Notification = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-6 right-6 z-[9999] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    role="alert">
    {message}
    <button onClick={onClose} className="ml-4 text-white/80 hover:text-white font-bold">×</button>
  </div>
);

const AdminPage: React.FC = () => {
  // const router = useRouter(); // Kullanılmıyor, kaldırıldı
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimeout = useRef<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newVideo, setNewVideo] = useState({
    video_id: '',
    title: '',
    description: '',
    long_description: ''
  });
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [newPrice, setNewPrice] = useState({
    category: '',
    name: '',
    min_price: '',
    max_price: '',
    description: ''
  });
  const [newTreatment, setNewTreatment] = useState<Partial<Treatment>>({
    title: '',
    short_description: '',
    description: '',
    content: { sections: [] },
    slug: '',
    meta_title: '',
    meta_description: '',
    featured: false,
    order_index: 0
  });
  const [newPartner, setNewPartner] = useState({
    name: '',
    description: '',
    logo: null as File | null,
    showNames: false
  });
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: 'genel',
    order_index: 0
  });
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [newTimelineItem, setNewTimelineItem] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [editingTimelineItem, setEditingTimelineItem] = useState<TimelineItem | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = appointments.filter(app => app.date === selectedDate);
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [selectedDate, appointments]);

  useEffect(() => {
    if (activeTab === 'prices') {
      fetchPrices();
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    try {
      const [clinicsRes, doctorsRes, feedbacksRes, treatmentsRes, videosRes, branchesRes, appointmentsRes, partnersRes, faqsRes, timelineRes] = await Promise.all([
        axios.get('https://webapi.karadenizdis.com/api/clinics'),
        axios.get('https://webapi.karadenizdis.com/api/doctors'),
        axios.get('https://webapi.karadenizdis.com/api/feedbacks'),
        axios.get('https://webapi.karadenizdis.com/api/treatments'),
        axios.get('https://webapi.karadenizdis.com/api/videos'),
        axios.get('https://webapi.karadenizdis.com/api/branches'),
        axios.get('https://webapi.karadenizdis.com/api/appointments'),
        axios.get('https://webapi.karadenizdis.com/api/partners'),
        axios.get('https://webapi.karadenizdis.com/api/faqs'),
        axios.get('https://webapi.karadenizdis.com/api/timeline'),
      ]);
      setClinics(clinicsRes.data);
      setDoctors(doctorsRes.data);
      setFeedbacks(feedbacksRes.data);
      setTreatments(treatmentsRes.data);
      setVideos(videosRes.data);
      setBranches(branchesRes.data);
      setAppointments(appointmentsRes.data);
      setPartners(partnersRes.data);
      setFaqs(faqsRes.data);
      setTimelineItems(timelineRes.data);
      setError('');
    } catch (err: unknown) {
      console.error('Veri yükleme hatası:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as { response?: { data?: { detail?: string }, statusText?: string } };
        setError(`Veriler yüklenemedi: ${errorObj.response?.data?.detail || errorObj.response?.statusText}`);
      } else if (err && typeof err === 'object' && 'request' in err) {
        setError('Sunucuya bağlanılamadı. Lütfen backend servisinin çalıştığından emin olun.');
      } else {
        setError('Beklenmeyen bir hata oluştu.');
      }
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('https://webapi.karadenizdis.com/api/appointments');
      const sortedAppointments = response.data.sort((a: Appointment, b: Appointment) => {
        const dateA = new Date(a.date + 'T' + a.time_slot);
        const dateB = new Date(b.date + 'T' + b.time_slot);
        return dateA.getTime() - dateB.getTime();
      });
      setAppointments(sortedAppointments);
    } catch (err: unknown) {
      console.error('Randevular yüklenemedi:', err);
    }
  };

  const fetchPrices = async () => {
    try {
      const response = await axios.get('https://webapi.karadenizdis.com/api/prices');
      setPrices(response.data);
    } catch (err: unknown) {
      console.error('Fiyatlar yüklenirken hata:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://webapi.karadenizdis.com/api/admin/login', { username, password });
      if (response.data.success) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Geçersiz kullanıcı adı veya şifre');
      }
    } catch (err: unknown) {
      setError('Giriş yapılamadı');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent, endpoint: string) => {
    e.preventDefault();

    try {
      // JSON formatında veri gönderilecek endpoint'ler
      if (endpoint === 'videos') {
        // Zorunlu alanları kontrol et
        if (!formData.video_id || !formData.title || !formData.description) {
          setError('Video ID, başlık ve açıklama alanları zorunludur');
          return;
        }

        const jsonData = {
          video_id: formData.video_id,
          title: formData.title,
          description: formData.description,
        };

        if (editId) {
          await axios.put(`https://webapi.karadenizdis.com/api/videos/${editId}`, jsonData, {
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          await axios.post(`https://webapi.karadenizdis.com/api/videos`, jsonData, {
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } else if (endpoint === 'branches') {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key !== 'image' && key !== 'galleryFiles' && key !== 'galleryPreview' && key !== 'gallery') {
            data.append(key, formData[key]);
          }
        });
        if (imageFile) {
          data.append('image', imageFile);
        } else if (formData.image && typeof formData.image === 'string') {
          data.append('image', formData.image);
        }
        if (formData.galleryFiles && formData.galleryFiles.length > 0) {
          formData.galleryFiles.forEach((file: File) => {
            data.append('gallery', file);
          });
        }
        if (formData.gallery && Array.isArray(formData.gallery)) {
          data.append('gallery', JSON.stringify(formData.gallery));
        }
        try {
          if (editId) {
            await axios.put(`https://webapi.karadenizdis.com/api/branches/${editId}`, data, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          } else {
            await axios.post(`https://webapi.karadenizdis.com/api/branches`, data, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          }
          fetchAllData();
          setFormData({});
          setEditId(null);
          setImageFile(null);
          setError('');
        } catch (err) {
          setError('İşlem başarısız');
        }
        return;
      } else {
        // Dosya yüklemesi gerektiren endpoint'ler için FormData kullan
        const data = new FormData();
        
        // Feedback için özel kontrol
        if (endpoint === 'feedbacks') {
          if (!formData.name || !formData.comment || !formData.rating) {
            setError('İsim, yorum ve puan alanları zorunludur');
            return;
          }
        }
        
        Object.keys(formData).forEach((key) => {
          if (key !== 'image') {
            data.append(key, formData[key]);
          }
        });
        
        if (imageFile) {
          data.append('image', imageFile);
        }

        if (editId) {
          await axios.put(`https://webapi.karadenizdis.com/api/${endpoint}/${editId}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          await axios.post(`https://webapi.karadenizdis.com/api/${endpoint}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      fetchAllData();
      setFormData({});
      setEditId(null);
      setImageFile(null);
      setError('');
    } catch (err) {
      console.error('Hata:', err);
      setError('İşlem başarısız');
    }
  };

  const handleEdit = (item: any, endpoint: string) => {
    if (endpoint === 'branches') {
      setFormData({
        ...item,
        gallery: item.gallery || [],
        galleryFiles: [],
        galleryPreview: [],
      });
      setEditId(item.id);
      setActiveTab(endpoint);
      return;
    }
    setFormData(item);
    setEditId(item.id);
    setActiveTab(endpoint);
  };

  const handleDelete = async (id: string, endpoint: string) => {
    try {
      console.log(`Deleting ${endpoint} with id:`, id);
      const response = await axios.delete(`https://webapi.karadenizdis.com/api/${endpoint}/${id}`);
      console.log('Delete response:', response);
      fetchAllData();
    } catch (err: any) {
      console.error(`Error deleting ${endpoint}:`, err);
      console.error('Error status:', err.response?.status);
      console.error('Error statusText:', err.response?.statusText);
      console.error('Error data:', err.response?.data);
      console.error('Error headers:', err.response?.headers);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      setError(`${endpoint} silme işlemi başarısız: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    try {
      const response = await axios.delete(`https://webapi.karadenizdis.com/api/appointments/${id}`);
      if (response.data.success) {
        await fetchAppointments();
        setError('');
      } else {
        setError('Randevu silinemedi. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('Randevu silinemedi:', err);
      setError('Randevu silinemedi. Lütfen tekrar deneyin.');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    notificationTimeout.current = setTimeout(() => setNotification(null), 3500);
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasyonlar
    if (!newVideo.video_id || !newVideo.title || !newVideo.description) {
      showNotification('Video ID, başlık ve açıklama zorunludur.', 'error');
      return;
    }
    if (newVideo.title.length > 50) {
      showNotification('Başlık en fazla 50 karakter olmalı.', 'error');
      return;
    }
    if (newVideo.description.length > 300) {
      showNotification('Açıklama en fazla 300 karakter olmalı.', 'error');
      return;
    }
    try {
      const response = await axios.post('https://webapi.karadenizdis.com/api/videos', newVideo);
      setVideos([...videos, response.data]);
      setNewVideo({ video_id: '', title: '', description: '', long_description: '' });
      showNotification('Video başarıyla eklendi!', 'success');
    } catch (error) {
      showNotification('Video eklenirken bir hata oluştu.', 'error');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (window.confirm('Bu videoyu silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`https://webapi.karadenizdis.com/api/videos/${id}`);
        setVideos(videos.filter(video => video.id !== id));
        alert('Video başarıyla silindi');
      } catch (error) {
        alert('Video silinirken bir hata oluştu');
      }
    }
  };

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice.category || newPrice.category.length > 60) {
      showNotification('Kategori zorunlu ve en fazla 60 karakter olmalı.', 'error');
      return;
    }
    if (!newPrice.name || newPrice.name.length > 60) {
      showNotification('İsim zorunlu ve en fazla 60 karakter olmalı.', 'error');
      return;
    }
    if (!newPrice.min_price || isNaN(Number(newPrice.min_price)) || Number(newPrice.min_price) < 0) {
      showNotification('Minimum fiyat pozitif bir sayı olmalı.', 'error');
      return;
    }
    if (!newPrice.max_price || isNaN(Number(newPrice.max_price)) || Number(newPrice.max_price) < Number(newPrice.min_price)) {
      showNotification('Maksimum fiyat, minimum fiyattan büyük olmalı.', 'error');
      return;
    }
    try {
      await axios.post('https://webapi.karadenizdis.com/api/prices', {
        ...newPrice,
        min_price: parseFloat(newPrice.min_price),
        max_price: parseFloat(newPrice.max_price)
      });
      setNewPrice({ category: '', name: '', min_price: '', max_price: '', description: '' });
      fetchPrices();
      showNotification('Fiyat başarıyla eklendi!', 'success');
    } catch (err) {
      showNotification('Fiyat eklenirken bir hata oluştu.', 'error');
    }
  };

  const handleDeletePrice = async (id: number) => {
    try {
      await axios.delete(`https://webapi.karadenizdis.com/api/prices/${id}`);
      fetchPrices();
    } catch (err) {
      console.error('Fiyat silinirken hata:', err);
    }
  };

  const fetchTreatments = async () => {
    try {
      const response = await axios.get('https://webapi.karadenizdis.com/api/treatments');
      setTreatments(response.data);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  const handleAddTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasyonlar
    if (!newTreatment.title || !newTreatment.short_description || !newTreatment.description || !newTreatment.slug) {
      showNotification('Başlık, kısa açıklama, açıklama ve slug zorunludur.', 'error');
      return;
    }
    if (newTreatment.title.length > 60) {
      showNotification('Başlık en fazla 60 karakter olmalı.', 'error');
      return;
    }
    if (newTreatment.short_description && newTreatment.short_description.length > 200) {
      showNotification('Kısa açıklama en fazla 200 karakter olmalı.', 'error');
      return;
    }
    if (newTreatment.slug.length > 60) {
      showNotification('Slug en fazla 60 karakter olmalı.', 'error');
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(newTreatment).forEach(([key, value]) => {
        if (key === 'content') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'featured') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await axios.post('https://webapi.karadenizdis.com/api/treatments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNewTreatment({
        title: '',
        short_description: '',
        description: '',
        content: { sections: [] },
        slug: '',
        meta_title: '',
        meta_description: '',
        featured: false,
        order_index: 0
      });
      fetchTreatments();
      setError('');
      showNotification('Tedavi başarıyla eklendi!', 'success');
    } catch (error: any) {
      if (error.response?.data?.error) {
        showNotification(error.response.data.error, 'error');
      } else {
        showNotification('Tedavi eklenirken bir hata oluştu.', 'error');
      }
      console.error('Error adding treatment:', error);
    }
  };

  const handleDeleteTreatment = async (id: string) => {
    if (window.confirm('Bu tedaviyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`https://webapi.karadenizdis.com/api/treatments/${id}`);
        fetchTreatments();
      } catch (error) {
        console.error('Error deleting treatment:', error);
      }
    }
  };

  const handleAddSection = () => {
    setNewTreatment(prev => ({
      ...prev,
      content: {
        sections: [
          ...(prev.content?.sections || []),
          { title: '', content: '', links: [] }
        ]
      }
    }));
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    setNewTreatment(prev => ({
      ...prev,
      content: {
        sections: prev.content?.sections.map((section, i) => 
          i === index ? { ...section, [field]: value } : section
        ) || []
      }
    }));
  };

  const handleAddLink = (sectionIndex: number) => {
    setNewTreatment(prev => ({
      ...prev,
      content: {
        sections: prev.content?.sections.map((section, i) => 
          i === sectionIndex 
            ? { 
                ...section, 
                links: [...(section.links || []), { text: '', url: '' }] 
              } 
            : section
        ) || []
      }
    }));
  };

  const handleLinkChange = (sectionIndex: number, linkIndex: number, field: string, value: string) => {
    setNewTreatment(prev => ({
      ...prev,
      content: {
        sections: prev.content?.sections.map((section, i) => 
          i === sectionIndex 
            ? {
                ...section,
                links: section.links?.map((link, j) => 
                  j === linkIndex ? { ...link, [field]: value } : link
                )
              }
            : section
        ) || []
      }
    }));
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newPartner.name);
      formData.append('description', newPartner.description);
      if (newPartner.logo) {
        formData.append('logo', newPartner.logo);
      }

      await axios.post('https://webapi.karadenizdis.com/api/partners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setNewPartner({
        name: '',
        description: '',
        logo: null,
        showNames: false
      });
      fetchAllData();
    } catch (error) {
      console.error('Error adding partner:', error);
      setError('Kurum eklenemedi');
    }
  };

  const handleDeletePartner = async (id: number) => {
    try {
      await axios.delete(`https://webapi.karadenizdis.com/api/partners/${id}`);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting partner:', error);
      setError('Kurum silinemedi');
    }
  };

  const handleAddFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://webapi.karadenizdis.com/api/faqs', newFAQ);
      setNewFAQ({
        question: '',
        answer: '',
        category: 'genel',
        order_index: 0
      });
      fetchAllData();
    } catch (error) {
      console.error('Error adding FAQ:', error);
      setError('SSS eklenemedi');
    }
  };

  const handleEditFAQ = async (id: number, updatedFAQ: Partial<FAQ>) => {
    try {
      await axios.put(`https://webapi.karadenizdis.com/api/faqs/${id}`, updatedFAQ);
      fetchAllData();
    } catch (error) {
      console.error('Error updating FAQ:', error);
      setError('SSS güncellenemedi');
    }
  };

  const handleStartEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
  };

  const handleCancelEdit = () => {
    setEditingFAQ(null);
  };

  const handleSaveEdit = async () => {
    if (!editingFAQ) return;
    
    try {
      await axios.put(`https://webapi.karadenizdis.com/api/faqs/${editingFAQ.id}`, {
        question: editingFAQ.question,
        answer: editingFAQ.answer,
        category: editingFAQ.category,
        order_index: editingFAQ.order_index
      });
      setEditingFAQ(null);
      fetchAllData();
    } catch (error) {
      console.error('Error updating FAQ:', error);
      setError('SSS güncellenemedi');
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    try {
      await axios.delete(`https://webapi.karadenizdis.com/api/faqs/${id}`);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setError('SSS silinemedi');
    }
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      const response = await axios.patch(`https://webapi.karadenizdis.com/api/appointments/${appointmentId}`, {
        status: newStatus
      });

      if (response.status === 200) {
        await fetchAppointments();
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Randevu durumu güncellenirken bir hata oluştu');
      await fetchAppointments();
    }
  };

  const getBranchImageSrc = (image: any): string => {
    if (!image) return '/default-image.jpg';
    if (image.startsWith('http')) return image;
    return `https://webapi.karadenizdis.com${image.startsWith('/') ? image : '/' + image}`;
  };

  const handleAddTimelineItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://webapi.karadenizdis.com/api/timeline', newTimelineItem);
      setNewTimelineItem({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchAllData();
    } catch (error) {
      console.error('Error adding timeline item:', error);
      setError('Timeline öğesi eklenemedi');
    }
  };

  const handleStartEditTimeline = (item: TimelineItem) => {
    setEditingTimelineItem(item);
  };

  const handleCancelEditTimeline = () => {
    setEditingTimelineItem(null);
  };

  const handleSaveEditTimeline = async () => {
    if (!editingTimelineItem) return;
    
    try {
      await axios.put(`https://webapi.karadenizdis.com/api/timeline/${editingTimelineItem.id}`, {
        title: editingTimelineItem.title,
        description: editingTimelineItem.description,
        date: editingTimelineItem.date,
      });
      setEditingTimelineItem(null);
      fetchAllData();
    } catch (error) {
      console.error('Error updating timeline item:', error);
      setError('Timeline öğesi güncellenemedi');
    }
  };

  const handleDeleteTimelineItem = async (id: number) => {
    try {
      await axios.delete(`https://webapi.karadenizdis.com/api/timeline/${id}`);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting timeline item:', error);
      setError('Timeline öğesi silinemedi');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm('Bu doktoru silmek istediğinizden emin misiniz?')) {
      try {
        console.log('Attempting to delete doctor with id:', id);
        await axios.delete(`https://webapi.karadenizdis.com/api/doctors/${id}`);
        fetchAllData();
      } catch (err: any) {
        console.error('Error deleting doctor:', err);
        setError('Doctor silme işlemi başarısız.');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F7F8FA]">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent">
            Admin Girişi
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
          />
          <button
            type="submit"
            className="w-full p-2 bg-gradient-to-r from-[#4964A9] to-[#022171] text-white rounded-lg hover:bg-blue-700"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent">
          Admin Paneli
        </h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Çıkış Yap
        </button>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-1/4 bg-white rounded-xl shadow-md p-4">
          <nav className="flex flex-col space-y-2">
            {['videos', 'treatments', 'feedbacks', 'branches', 'clinics', 'doctors', 'appointments', 'prices', 'partners', 'faqs', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-2 text-left rounded-lg ${
                  activeTab === tab ? 'bg-[#4964A9] text-white' : 'hover:bg-gray-100'
                }`}
              >
                {tab === 'faqs' ? 'SSS' : tab === 'timeline' ? 'Timeline' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="w-full sm:w-3/4">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {activeTab === 'videos' && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Video Yönetimi</h2>
              <form onSubmit={handleAddVideo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video ID</label>
                  <input
                    type="text"
                    value={newVideo.video_id}
                    onChange={(e) => setNewVideo({ ...newVideo, video_id: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4964A9]"
                    placeholder="YouTube video ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 50) {
                        setNewVideo({ ...newVideo, title: value });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4964A9]"
                    placeholder="Video başlığı (maksimum 50 karakter)"
                    maxLength={50}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">{newVideo.title.length}/50 karakter</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4964A9]"
                    placeholder="Video açıklaması"
                    rows={3}
                    maxLength={300}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">{newVideo.description.length}/300 karakter</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detaylı Açıklama</label>
                  <textarea
                    value={newVideo.long_description}
                    onChange={(e) => setNewVideo({ ...newVideo, long_description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4964A9]"
                    placeholder="Detaylı video açıklaması"
                    rows={5}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#4964A9] text-white rounded-lg hover:bg-[#022171] transition-colors"
                >
                  Video Ekle
                </button>
              </form>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mevcut Videolar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.video_id}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-lg"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">{video.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{video.description}</p>
                      {video.long_description && (
                        <p className="text-gray-500 text-sm mb-4">{video.long_description}</p>
                      )}
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'treatments' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Tedavi Yönetimi</h2>
              
              <form onSubmit={handleAddTreatment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={newTreatment.title}
                      onChange={(e) => setNewTreatment(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                      maxLength={60}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">{(newTreatment.title || '').length}/60 karakter</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={newTreatment.slug}
                      onChange={(e) => setNewTreatment(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                      maxLength={60}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">{(newTreatment.slug || '').length}/60 karakter</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kısa Açıklama
                  </label>
                  <textarea
                    value={newTreatment.short_description}
                    onChange={(e) => setNewTreatment(prev => ({ ...prev, short_description: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                    rows={3}
                    maxLength={200}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">{(newTreatment.short_description || '').length}/200 karakter</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={newTreatment.description}
                    onChange={(e) => setNewTreatment(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                    rows={5}
                    maxLength={300}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">{(newTreatment.description || '').length}/300 karakter</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Görsel
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewTreatment(prev => ({ ...prev, image: file }));
                      }
                    }}
                    className="w-full"
                    accept="image/*"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Başlık
                    </label>
                    <input
                      type="text"
                      value={newTreatment.meta_title}
                      onChange={(e) => setNewTreatment(prev => ({ ...prev, meta_title: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Açıklama
                    </label>
                    <input
                      type="text"
                      value={newTreatment.meta_description}
                      onChange={(e) => setNewTreatment(prev => ({ ...prev, meta_description: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTreatment.featured}
                      onChange={(e) => setNewTreatment(prev => ({ ...prev, featured: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Öne Çıkan</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sıralama
                    </label>
                    <input
                      type="number"
                      value={newTreatment.order_index}
                      onChange={(e) => setNewTreatment(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                      className="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">İçerik Bölümleri</h3>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="px-4 py-2 bg-[#4964A9] text-white rounded-lg hover:bg-[#022171] transition-colors"
                    >
                      Bölüm Ekle
                    </button>
                  </div>

                  {newTreatment.content?.sections?.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border rounded-lg p-4 space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bölüm Başlığı
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bölüm İçeriği
                        </label>
                        <textarea
                          value={section.content}
                          onChange={(e) => handleSectionChange(sectionIndex, 'content', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                          rows={4}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#4964A9] text-white rounded-lg hover:bg-[#022171] transition-colors"
                >
                  Tedavi Ekle
                </button>
              </form>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mevcut Tedaviler</h3>
                <div className="space-y-4">
                  {treatments.map((treatment) => (
                    <div key={treatment.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="max-w-xs sm:max-w-sm md:max-w-md overflow-hidden">
                        <h4 className="font-medium text-gray-800 truncate max-w-full">{treatment.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-full">{treatment.short_description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteTreatment(treatment.id.toString())}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedbacks' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Geri Dönüşler</h2>
              <form onSubmit={(e) => handleSubmit(e, 'feedbacks')} className="mb-6">
                <input
                  type="text"
                  name="name"
                  placeholder="İsim"
                  value={formData.name || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                  maxLength={60}
                />
                <p className="mt-1 text-sm text-gray-500">{(formData.name || '').length}/60 karakter</p>
                <textarea
                  name="comment"
                  placeholder="Yorum"
                  value={formData.comment || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                  maxLength={300}
                />
                <p className="mt-1 text-sm text-gray-500">{(formData.comment || '').length}/300 karakter</p>
                <input
                  type="number"
                  name="rating"
                  placeholder="Puan (1-5)"
                  value={formData.rating || ''}
                  onChange={handleFormChange}
                  min="1"
                  max="5"
                  className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 mb-2"
                />
                {formData.image && !imageFile && (
                  <Image
                    src={`https://webapi.karadenizdis.com${formData.image}`}
                    alt="Mevcut Resim"
                    width={100}
                    height={100}
                    className="mb-2 object-cover rounded"
                  />
                )}
                <button
                  type="submit"
                  className="p-2 bg-gradient-to-r from-[#4964A9] to-[#022171] text-white rounded-lg hover:bg-blue-700"
                >
                  {editId ? 'Güncelle' : 'Ekle'}
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={`https://webapi.karadenizdis.com${feedback.image}`}
                        alt={feedback.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-bold">{feedback.name}</p>
                        <p className="text-sm text-gray-600">{feedback.comment}</p>
                        <p className="text-sm">Puan: {feedback.rating}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(feedback, 'feedbacks')}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(feedback.id, 'feedbacks')}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Şubeler</h2>
              <form onSubmit={(e) => handleSubmit(e, 'branches')} className="mb-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Şube Adı"
                  value={formData.name || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                  maxLength={60}
                />
                <p className="mt-1 text-sm text-gray-500">{(formData.name || '').length}/60 karakter</p>
                <input
                  type="text"
                  name="address"
                  placeholder="Adres veya Google Maps Embed Linki"
                  value={formData.address || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                  maxLength={200}
                />
                <p className="mt-1 text-sm text-gray-500">{(formData.address || '').length}/200 karakter</p>
                <div className="flex gap-4 mb-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="lat"
                      placeholder="Enlem (Latitude)"
                      value={formData.lat || ''}
                      onChange={handleFormChange}
                      step="any"
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      name="lng"
                      placeholder="Boylam (Longitude)"
                      value={formData.lng || ''}
                      onChange={handleFormChange}
                      step="any"
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Telefon (örn: 0555 123 45 67)"
                  value={formData.phone || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                  maxLength={20}
                />
                <p className="mt-1 text-sm text-gray-500">{(formData.phone || '').length}/20 karakter</p>
                <input
                  type="email"
                  name="email"
                  placeholder="E-posta (örn: info@karadenizdis.com)"
                  value={formData.email || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                  maxLength={100}
                />
                <p className="mt-1 text-sm text-gray-500">{(formData.email || '').length}/100 karakter</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData((prev: any) => ({
                      ...prev,
                      galleryFiles: files,
                      galleryPreview: files.map(file => URL.createObjectURL(file)),
                      // Eğer ana görsel seçilmemişse ilk fotoğrafı ana görsel yap
                      image: prev.image || files[0] || null,
                    }));
                  }}
                  className="w-full p-2 mb-2"
                />
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* Yeni seçilenler */}
                  {formData.galleryPreview && formData.galleryPreview.map((src: string, i: number) => (
                    <div key={i} className="relative w-20 h-20 group">
                      <Image src={src} alt="Galeri Önizleme" fill className="object-cover rounded" />
                      <button type="button" onClick={() => {
                        setFormData((prev: any) => {
                          const newFiles = prev.galleryFiles.filter((_: any, idx: number) => idx !== i);
                          const newPreview = prev.galleryPreview.filter((_: any, idx: number) => idx !== i);
                          // Eğer silinen ana görselse, yeni ana görseli ilk kalan fotoğraf yap
                          let newImage = prev.image;
                          if (prev.galleryFiles[i] === prev.image) {
                            newImage = newFiles[0] || null;
                          }
                          return { ...prev, galleryFiles: newFiles, galleryPreview: newPreview, image: newImage };
                        });
                      }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                      <button type="button" onClick={() => {
                        if (formData.galleryFiles && formData.galleryFiles[i] instanceof File) {
                          setImageFile(formData.galleryFiles[i]);
                          setFormData({ ...formData, image: formData.galleryFiles[i] });
                        } else {
                          setImageFile(null);
                          setFormData({ ...formData, image: formData.galleryFiles[i] });
                        }
                      }}
                        className={`absolute bottom-0 left-0 right-0 mx-auto mb-1 px-1 py-0.5 text-xs rounded bg-white/80 text-[#4964A9] font-bold border border-[#4964A9] shadow transition-all duration-200 group-hover:opacity-100 ${formData.image === formData.galleryFiles[i] ? 'bg-gradient-to-r from-[#4964A9] to-[#022171] text-white border-none' : 'opacity-80 hover:bg-[#4964A9] hover:text-white'}`}
                      >
                        {formData.image === formData.galleryFiles[i] ? 'Ana Görsel' : 'Ana görsel olarak seç'}
                      </button>
                    </div>
                  ))}
                  {/* Düzenleme modunda mevcut galeri */}
                  {formData.gallery && Array.isArray(formData.gallery) && formData.gallery.map((src: string, i: number) => (
                    <div key={i} className="relative w-20 h-20 group">
                      <Image src={`https://webapi.karadenizdis.com${src}`} alt="Mevcut Galeri" fill className="object-cover rounded" />
                      <button type="button" onClick={() => {
                        setFormData((prev: any) => {
                          const newGallery = prev.gallery.filter((_: any, idx: number) => idx !== i);
                          // Eğer silinen ana görselse, yeni ana görseli ilk kalan fotoğraf yap
                          let newImage = prev.image;
                          if (src === prev.image) {
                            newImage = newGallery[0] || null;
                          }
                          return { ...prev, gallery: newGallery, image: newImage };
                        });
                      }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                      <button type="button" onClick={() => {
                        setImageFile(null);
                        setFormData({ ...formData, image: src });
                      }}
                        className={`absolute bottom-0 left-0 right-0 mx-auto mb-1 px-1 py-0.5 text-xs rounded bg-white/80 text-[#4964A9] font-bold border border-[#4964A9] shadow transition-all duration-200 group-hover:opacity-100 ${formData.image === src ? 'bg-gradient-to-r from-[#4964A9] to-[#022171] text-white border-none' : 'opacity-80 hover:bg-[#4964A9] hover:text-white'}`}
                      >
                        {formData.image === src ? 'Ana Görsel' : 'Ana görsel olarak seç'}
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="p-2 bg-gradient-to-r from-[#4964A9] to-[#022171] text-white rounded-lg hover:bg-blue-700"
                >
                  {editId ? 'Güncelle' : 'Ekle'}
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branches.map((branch) => {
                  const src = getBranchImageSrc(branch.image);
                  if (!src.startsWith('http') && !src.startsWith('/')) {
                    console.warn('Geçersiz image src:', src, branch);
                  }
                  return (
                    <div key={branch.id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center min-h-[90px]">
                      <div className="flex items-center space-x-4 w-full">
                        <Image
                          src={src}
                          alt={branch.name}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                        <div className="flex flex-col w-full">
                          <p className="font-bold truncate max-w-[200px]">{branch.name}</p>
                          {branch.address && <p className="text-xs text-gray-600 truncate max-w-[200px]">{branch.address}</p>}
                          {branch.phone && <p className="text-xs text-gray-600 truncate max-w-[200px]">{branch.phone}</p>}
                          {branch.email && <p className="text-xs text-gray-600 truncate max-w-[200px]">{branch.email}</p>}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(branch, 'branches')}
                          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(branch.id, 'branches')}
                          className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'clinics' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Klinikler</h2>
              <form onSubmit={(e) => handleSubmit(e, 'clinics')} className="mb-6">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Klinik Adı</label>
                  <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleFormChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Telefon Numarası</label>
                  <input type="text" name="phone" id="phone" value={formData.phone || ''} onChange={handleFormChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Resim</label>
                  <input type="file" name="image" id="image" onChange={handleImageChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                {formData.image && !imageFile && (
                  <Image
                    src={`https://webapi.karadenizdis.com${formData.image}`}
                    alt="Mevcut Resim"
                    width={100}
                    height={100}
                    className="mb-2 object-cover rounded"
                  />
                )}
                <button
                  type="submit"
                  className="p-2 bg-gradient-to-r from-[#4964A9] to-[#022171] text-white rounded-lg hover:bg-blue-700"
                >
                  {editId ? 'Güncelle' : 'Ekle'}
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clinics.map((clinic) => (
                  <div key={clinic.id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={`https://webapi.karadenizdis.com${clinic.image}`}
                        alt={clinic.name}
                        width={50}
                        height={50}
                        className="rounded"
                      />
                      <p className="font-bold">{clinic.name}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(clinic, 'clinics')}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(clinic.id, 'clinics')}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Doktorlar</h2>
              <form onSubmit={(e) => handleSubmit(e, 'doctors')} className="mb-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Doktor Adı"
                  value={formData.name || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                  maxLength={60}
                />
                <p className="mt-1 text-sm text-gray-500">{(formData.name || '').length}/60 karakter</p>
                <select
                  name="clinic_id"
                  value={formData.clinic_id || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9]"
                >
                  <option value="">Klinik Seç</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 mb-2"
                />
                {formData.image && !imageFile && (
                  <Image
                    src={`https://webapi.karadenizdis.com${formData.image}`}
                    alt="Mevcut Resim"
                    width={100}
                    height={100}
                    className="mb-2 object-cover rounded"
                  />
                )}
                <button
                  type="submit"
                  className="p-2 bg-gradient-to-r from-[#4964A9] to-[#022171] text-white rounded-lg hover:bg-blue-700"
                >
                  {editId ? 'Güncelle' : 'Ekle'}
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="p-4 bg-gray-600 rounded-lg flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={`https://webapi.karadenizdis.com${doctor.image}`}
                        alt={doctor.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                      <div>
                        <p className="font-bold">{doctor.name}</p>
                        <p className="text-sm text-gray-600">
                          Klinik: {clinics.find((c) => c.id === doctor.clinic_id)?.name || 'Yok'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(doctor, 'doctors')}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Randevular</h2>
              <div className="mb-6">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9] transition-all duration-300"
                />
              </div>
              <button
                onClick={fetchAppointments}
                className="mb-4 p-2 bg-gradient-to-r from-[#4964A9] to-[#022171] text-white rounded-lg hover:bg-blue-700"
              >
                Yenile
              </button>
              <div className="grid grid-cols-1 gap-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-[#4964A9] text-white rounded-lg p-3 text-center min-w-[100px]">
                          <div className="text-sm font-semibold">
                            {format(parseISO(appointment.date), 'd MMMM yyyy', { locale: tr })}
                          </div>
                          <div className="text-lg font-bold">
                            {appointment.time_slot}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-lg font-semibold text-gray-800">{appointment.name}</div>
                          <div className="text-gray-600">{appointment.phone}</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end">
                        <div className="text-sm text-gray-600">
                          Klinik: {clinics.find((c) => c.id === appointment.clinic_id)?.name || 'Bilinmeyen Klinik'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Doktor: {doctors.find((d) => d.id === appointment.doctor_id)?.name || 'Bilinmeyen Doktor'}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="pending">Beklemede</option>
                          <option value="confirmed">Onaylandı</option>
                          <option value="cancelled">İptal Edildi</option>
                        </select>
                        <button
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 flex justify-end">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full \
                        ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.status === 'confirmed' ? 'Onaylandı' :
                         appointment.status === 'cancelled' ? 'İptal Edildi' :
                         'Beklemede'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prices' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Fiyat Listesi Yönetimi</h2>
              
              {/* Yeni Fiyat Ekleme Formu */}
              <form onSubmit={handleAddPrice} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Yeni Fiyat Ekle</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Kategori"
                    value={newPrice.category}
                    onChange={(e) => setNewPrice({ ...newPrice, category: e.target.value })}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="İsim"
                    value={newPrice.name}
                    onChange={(e) => setNewPrice({ ...newPrice, name: e.target.value })}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Minimum Fiyat"
                    value={newPrice.min_price}
                    onChange={(e) => setNewPrice({ ...newPrice, min_price: e.target.value })}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Maksimum Fiyat"
                    value={newPrice.max_price}
                    onChange={(e) => setNewPrice({ ...newPrice, max_price: e.target.value })}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Açıklama (opsiyonel)"
                    value={newPrice.description}
                    onChange={(e) => setNewPrice({ ...newPrice, description: e.target.value })}
                    className="p-2 border rounded sm:col-span-2"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-[#4964A9] text-white rounded hover:bg-[#022171] transition-colors"
                >
                  Ekle
                </button>
              </form>

              {/* Fiyat Listesi */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prices.map((price) => (
                  <div key={price.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{price.name}</h3>
                        <p className="text-sm text-gray-500">{price.category}</p>
                      </div>
                      <button
                        onClick={() => handleDeletePrice(price.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Sil
                      </button>
                    </div>
                    <p className="text-lg font-bold text-[#4964A9]">
                      {price.min_price.toLocaleString('tr-TR')} ₺ - {price.max_price.toLocaleString('tr-TR')} ₺
                    </p>
                    {price.description && (
                      <p className="text-sm text-gray-600 mt-2">{price.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Anlaşmalı Kurumlar</h2>
              
              <form onSubmit={handleAddPartner} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Yeni Kurum Ekle</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kurum Adı
                    </label>
                    <input
                      type="text"
                      value={newPartner.name}
                      onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                      maxLength={60}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">{newPartner.name.length}/60 karakter</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={newPartner.description}
                      onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                      rows={3}
                      maxLength={200}
                    />
                    <p className="mt-1 text-sm text-gray-500">{newPartner.description.length}/200 karakter</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewPartner({ ...newPartner, logo: file });
                        }
                      }}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                      accept="image/*"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showNames"
                      checked={newPartner.showNames}
                      onChange={(e) => setNewPartner({ ...newPartner, showNames: e.target.checked })}
                      className="h-4 w-4 text-[#4964A9] focus:ring-[#4964A9] border-gray-300 rounded"
                    />
                    <label htmlFor="showNames" className="ml-2 block text-sm text-gray-700">
                      Kartlarda isim göster
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-[#4964A9] text-white rounded-lg hover:bg-[#022171] transition-colors"
                >
                  Kurum Ekle
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <div key={partner.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <Image
                        src={`https://webapi.karadenizdis.com${partner.logo}`}
                        alt={partner.name}
                        width={200}
                        height={200}
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
                    {partner.description && (
                      <p className="text-gray-600 text-sm mb-2">{partner.description}</p>
                    )}
                    <div className="flex items-center mb-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        partner.showNames 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {partner.showNames ? 'İsim Gösteriliyor' : 'İsim Gizli'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeletePartner(partner.id)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">SSS Yönetimi</h2>
              
              <form onSubmit={handleAddFAQ} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Yeni SSS Ekle</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Soru
                    </label>
                    <input
                      type="text"
                      value={newFAQ.question}
                      onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                      maxLength={200}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">{newFAQ.question.length}/200 karakter</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cevap
                    </label>
                    <textarea
                      value={newFAQ.answer}
                      onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                      rows={4}
                      maxLength={500}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">{newFAQ.answer.length}/500 karakter</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori
                      </label>
                      <input
                        type="text"
                        value={newFAQ.category}
                        onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                        placeholder="Kategori adı (örn: genel, tedavi, randevu)"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sıra
                      </label>
                      <input
                        type="number"
                        value={newFAQ.order_index}
                        onChange={(e) => setNewFAQ({ ...newFAQ, order_index: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-[#4964A9] text-white rounded-lg hover:bg-[#022171] transition-colors"
                >
                  SSS Ekle
                </button>
              </form>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                    {editingFAQ?.id === faq.id ? (
                      // Düzenleme modu
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Soru
                          </label>
                          <input
                            type="text"
                            value={editingFAQ.question}
                            onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cevap
                          </label>
                          <textarea
                            value={editingFAQ.answer}
                            onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                            rows={4}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Kategori
                            </label>
                            <input
                              type="text"
                              value={editingFAQ.category}
                              onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value })}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sıra
                            </label>
                            <input
                              type="number"
                              value={editingFAQ.order_index}
                              onChange={(e) => setEditingFAQ({ ...editingFAQ, order_index: parseInt(e.target.value) || 0 })}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                              min="0"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Görüntüleme modu
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                              {faq.question}
                            </h3>
                            <div className="max-h-32 overflow-y-auto">
                              <p className="text-gray-600 text-sm whitespace-pre-wrap break-words">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4 flex-shrink-0">
                            <button
                              onClick={() => handleStartEdit(faq)}
                              className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteFAQ(faq.id)}
                              className="px-3 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Kategori: {faq.category}</span>
                          <span>Sıra: {faq.order_index}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Timeline Yönetimi</h2>
              
              <form onSubmit={handleAddTimelineItem} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Yeni Timeline Öğesi Ekle</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={newTimelineItem.title}
                      onChange={(e) => setNewTimelineItem({ ...newTimelineItem, title: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                      maxLength={60}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">{newTimelineItem.title.length}/60 karakter</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={newTimelineItem.description}
                      onChange={(e) => setNewTimelineItem({ ...newTimelineItem, description: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                      rows={4}
                      maxLength={300}
                    />
                    <p className="mt-1 text-sm text-gray-500">{newTimelineItem.description.length}/300 karakter</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tarih
                      </label>
                      <input
                        type="date"
                        value={newTimelineItem.date}
                        onChange={(e) => setNewTimelineItem({ ...newTimelineItem, date: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-[#4964A9] text-white rounded-lg hover:bg-[#022171] transition-colors"
                >
                  Timeline Öğesi Ekle
                </button>
              </form>

              <div className="space-y-4">
                {timelineItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                    {editingTimelineItem?.id === item.id ? (
                      // Düzenleme modu
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Başlık
                          </label>
                          <input
                            type="text"
                            value={editingTimelineItem.title}
                            onChange={(e) => setEditingTimelineItem({ ...editingTimelineItem, title: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Açıklama
                          </label>
                          <textarea
                            value={editingTimelineItem.description}
                            onChange={(e) => setEditingTimelineItem({ ...editingTimelineItem, description: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                            rows={4}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tarih
                            </label>
                            <input
                              type="date"
                              value={editingTimelineItem.date}
                              onChange={(e) => setEditingTimelineItem({ ...editingTimelineItem, date: e.target.value })}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4964A9] focus:border-transparent"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEditTimeline}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={handleCancelEditTimeline}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Görüntüleme modu
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                              {item.title}
                            </h3>
                            <div className="max-h-32 overflow-y-auto">
                              <p className="text-gray-600 text-sm whitespace-pre-wrap break-words">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4 flex-shrink-0">
                            <button
                              onClick={() => handleStartEditTimeline(item)}
                              className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteTimelineItem(item.id)}
                              className="px-3 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Tarih: {item.date}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default AdminPage;