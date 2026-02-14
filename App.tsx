
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, Search, Star, Clock, Home, BookOpen, Compass, User, GraduationCap,
  CheckCircle2, Bookmark, TrendingUp, Filter, Plus, X, Youtube, DollarSign,
  Layers, ShieldCheck, Settings, LogOut, ChevronRight, LayoutGrid, Trash2, Edit3,
  Phone, CreditCard, PlayCircle, Lock, BookmarkCheck, ChevronLeft, ChevronDown, MonitorPlay,
  Wallet, Landmark, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, COURSES } from './constants.tsx';
import { Course, Topic } from './types.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  
  // Persist Admin State in localStorage
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('barohub_admin_mode') === 'true';
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  // Load courses from localStorage or use defaults
  const [allCourses, setAllCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('barohub_courses_data');
    return saved ? JSON.parse(saved) : COURSES;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payingFor, setPayingFor] = useState<Course | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [activeGateway, setActiveGateway] = useState<string | null>(null);

  // Form State for Adding/Editing
  const [formCourse, setFormCourse] = useState({
    title: '',
    price: '',
    categoryId: 'cat_biz',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400'
  });

  // Save admin state to localStorage
  useEffect(() => {
    localStorage.setItem('barohub_admin_mode', isAdmin.toString());
  }, [isAdmin]);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('barohub_courses_data', JSON.stringify(allCourses));
  }, [allCourses]);

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormCourse({
      title: course.title,
      price: course.price.toString(),
      categoryId: course.categoryId,
      image: course.image
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    if (!isAdmin) {
      alert("Fadlan daar Admin Mode-ka si aad u tirtirto koorsada.");
      return;
    }
    if (confirm('Ma hubtaa inaad tirtirto koorsadan?')) {
      setAllCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSaveCourse = () => {
    if (!isAdmin) {
      alert("Permission Denied: Admin mode is not active. Please go to Profile and enable Admin Mode.");
      return;
    }

    if (!formCourse.title || !formCourse.price) {
      alert("Fadlan buuxi magaca iyo qiimaha koorsada.");
      return;
    }

    const selectedCat = CATEGORIES.find(c => c.id === formCourse.categoryId);

    const updatedCourseData: Course = {
      id: editingCourse ? editingCourse.id : `c${Date.now()}`,
      title: formCourse.title,
      category: selectedCat ? selectedCat.name.toUpperCase() : 'GENERAL',
      categoryId: formCourse.categoryId,
      price: parseFloat(formCourse.price),
      rating: editingCourse ? editingCourse.rating : 5.0,
      duration: editingCourse ? editingCourse.duration : '12h 00m',
      image: formCourse.image,
      topics: editingCourse ? editingCourse.topics : [
        { id: 't1', title: 'Hordhaca Koorsada', videoUrl: '' },
        { id: 't2', title: 'Qaybta 1aad ee Casharka', videoUrl: '' },
        { id: 't3', title: 'Qaybta 2aad ee Casharka', videoUrl: '' }
      ]
    };

    if (editingCourse) {
      setAllCourses(prev => prev.map(c => c.id === editingCourse.id ? updatedCourseData : c));
    } else {
      setAllCourses(prev => [updatedCourseData, ...prev]);
    }

    setIsAddModalOpen(false);
    setEditingCourse(null);
    setFormCourse({ title: '', price: '', categoryId: 'cat_biz', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400' });
    
    // Smooth visual feedback
    const toast = document.createElement('div');
    toast.className = 'fixed top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] font-bold text-sm';
    toast.innerText = 'Si guul leh ayaa loo kaydiyay!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handlePurchase = (course: Course) => {
    setPayingFor(course);
    setIsPaymentModalOpen(true);
  };

  const processPayment = async (gateway: string) => {
    setActiveGateway(gateway);
    setPaymentStatus('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentStatus('success');
    setTimeout(() => {
      setIsPaymentModalOpen(false);
      setPaymentStatus('idle');
      setActiveGateway(null);
      setSelectedCourseDetail(null);
    }, 1500);
  };

  const filteredCourses = useMemo(() => {
    return allCourses.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategoryId ? c.categoryId === selectedCategoryId : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, allCourses, selectedCategoryId]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDFDFF] relative pb-24 shadow-2xl overflow-x-hidden font-['Plus_Jakarta_Sans']">
      
      <AnimatePresence mode="wait">
        {activeTab === 'Home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
            <header className="px-6 pt-10 pb-6 flex justify-between items-end sticky top-0 bg-[#FDFDFF]/80 backdrop-blur-md z-40 border-b border-slate-50">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px] mb-1">KU SOO DHAWAADA</p>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">BaroHub</h1>
              </div>
              <button className="relative p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-600">
                <Bell className="w-5 h-5" />
              </button>
            </header>

            <div className="space-y-8 pt-4">
              <div className="px-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Raadi koorsadaada..." 
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[22px] outline-none text-sm font-medium shadow-sm"
                  />
                </div>
              </div>

              <div className="px-6">
                <div className="hero-gradient rounded-[32px] p-7 relative overflow-hidden shadow-2xl shadow-blue-200/50">
                  <div className="relative z-10">
                    <h2 className="text-white text-2xl font-extrabold mb-3 leading-[1.2]">Mustaqbalkaaga <br />Halkan Ka Bilow.</h2>
                    <p className="text-blue-100/80 text-sm mb-7 font-medium leading-relaxed">Ka baro xirfadaha ugu casrisan macalimiinta Soomaaliyeed.</p>
                    <button onClick={() => setActiveTab('Explore')} className="bg-white text-blue-600 px-7 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl">Bilow Hadda</button>
                  </div>
                </div>
              </div>

              <div className="px-6 space-y-6 pb-10">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                   <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                   Koorsooyinka ugu Fiican
                </h3>
                {filteredCourses.slice(0, 3).map(course => (
                  <div key={course.id} className="bg-white rounded-[32px] p-4 border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48 rounded-[24px] overflow-hidden mb-4 cursor-pointer" onClick={() => { setActiveTab('Explore'); setSelectedCourseDetail(course); }}>
                      <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                         <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                         <span className="text-[10px] font-black text-slate-800">{course.rating}</span>
                      </div>
                    </div>
                    <div className="px-1">
                      <p className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-widest">{course.category}</p>
                      <h3 className="font-extrabold text-slate-900 mb-4 line-clamp-1">{course.title}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black text-slate-900">${course.price}</span>
                        <button onClick={() => { setActiveTab('Explore'); setSelectedCourseDetail(course); }} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs active:scale-95 transition-transform">Arag</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Explore' && (
          <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col bg-white min-h-screen">
            <header className="px-6 pt-10 pb-4 bg-white sticky top-0 z-40 border-b border-slate-50">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-slate-900 leading-tight">Koorsoyin & Barnaamijyo</h1>
                {isAdmin && (
                  <button onClick={() => { setEditingCourse(null); setFormCourse({ title: '', price: '', categoryId: 'cat_biz', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400' }); setIsAddModalOpen(true); }} className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100"><Plus className="w-6 h-6" /></button>
                )}
              </div>
              <p className="text-[#16a34a] text-sm font-bold leading-relaxed mb-8">Ku biir in ka badan 40,000 oo ka tirsan nidamkeena waxbarashada</p>

              <div className="space-y-4">
                <div className="relative">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" className="w-full pl-6 pr-12 py-4 bg-[#f4f4f5] border-none rounded-sm outline-none text-slate-500 font-medium focus:ring-1 focus:ring-blue-100" />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900" />
                </div>
                <div className="relative">
                  <button onClick={() => setSelectedCategoryId(null)} className="w-full flex justify-between items-center px-6 py-4 border border-blue-500 rounded-sm text-slate-800 font-medium bg-white">
                    <span>{selectedCategoryId ? CATEGORIES.find(c => c.id === selectedCategoryId)?.name : 'All Courses'}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </header>

            <div className="px-6 space-y-12 pt-10 pb-32">
              {filteredCourses.length > 0 ? filteredCourses.map(course => (
                <div key={course.id} className="bg-[#e5e1da] rounded-sm overflow-hidden shadow-sm group relative">
                  <div className="relative h-64 cursor-pointer" onClick={() => setSelectedCourseDetail(course)}>
                    <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
                    <div className="absolute bottom-0 left-0 right-0 bg-[#3a2c27] py-2 px-4">
                      <p className="text-white text-[10px] font-medium tracking-wide">Ka Adkaw Maskaxdaada, Samee Hormar Joogto Ah</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(course); }} className="p-2.5 bg-white/95 backdrop-blur rounded-xl text-slate-700 shadow-xl border border-white/50"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }} className="p-2.5 bg-red-500 text-white rounded-xl shadow-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ALL COURSES, {course.category}</p>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{course.title}</h3>
                    <div className="flex items-center gap-2 text-slate-600"><MonitorPlay className="w-4 h-4" /><span className="text-xs font-bold">Full Program</span></div>
                    <div className="pt-4 flex justify-between items-end border-t border-slate-400/10 mt-2">
                      <span className="text-2xl font-black text-slate-900">${course.price}</span>
                      <button onClick={() => setSelectedCourseDetail(course)} className="text-blue-600 text-sm font-black border-b-2 border-blue-600 pb-0.5 hover:text-blue-700 transition-colors uppercase tracking-wider">Iibso Hadda</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center text-slate-400 font-bold">Koorsooyin lama helin.</div>
              )}
            </div>

            <a 
              href="https://wa.me/252610000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="fixed bottom-24 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform active:scale-90 flex items-center justify-center"
            >
              <Phone className="w-6 h-6 fill-white" />
            </a>
          </motion.div>
        )}

        {activeTab === 'Learn' && (
          <motion.div key="learn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-10">
            <h2 className="text-2xl font-black text-slate-900">Barashadayda</h2>
            <div className="mt-10 bg-slate-50 p-12 rounded-[40px] text-center border-2 border-dashed border-slate-200">
               <div className="w-16 h-16 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6"><BookOpen className="w-8 h-8 text-slate-400" /></div>
               <p className="text-slate-500 font-bold">Wali koorsooyin ma iibsan.</p>
               <button onClick={() => setActiveTab('Explore')} className="mt-6 text-blue-600 font-black text-sm uppercase tracking-widest">Raadi Koorsooyinka</button>
            </div>
          </motion.div>
        )}

        {activeTab === 'Profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-10">
            <div className="flex flex-col items-center mb-10">
               <div className="relative">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" className="w-28 h-28 rounded-[40px] object-cover border-4 border-white shadow-2xl" alt="Profile" />
                 {isAdmin && <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-2xl shadow-lg border-4 border-white"><ShieldCheck className="w-5 h-5 text-white" /></div>}
               </div>
               <h2 className="text-2xl font-black text-slate-900 mt-6">Mohamed Shiine</h2>
               <p className="text-slate-400 font-black uppercase text-[10px] tracking-[3px] mt-2">Status: {isAdmin ? 'ADMINISTRATOR' : 'PREMIUM USER'}</p>
            </div>
            
            <div className="p-8 bg-blue-600 rounded-[40px] text-white shadow-2xl shadow-blue-100 mb-8 overflow-hidden relative group">
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md"><ShieldCheck className="w-6 h-6" /></div>
                   <h2 className="text-xl font-black uppercase tracking-tight">Admin Settings</h2>
                 </div>
                 <p className="text-sm text-blue-100/80 mb-6 font-medium leading-relaxed">Daar Admin Mode si aad u maamusho koorsooyinka, u tirtirto, ama u bedesho xogta.</p>
                 <button 
                  onClick={() => setIsAdmin(!isAdmin)} 
                  className={`w-full py-4 rounded-2xl font-black transition-all active:scale-[0.98] ${isAdmin ? 'bg-white text-blue-600 shadow-xl' : 'bg-blue-800 text-white'}`}
                 >
                   {isAdmin ? 'DISABLE ADMIN MODE' : 'ENABLE ADMIN MODE'}
                 </button>
               </div>
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-slate-100 p-6 rounded-[32px] flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4 text-slate-700 font-bold"><Settings className="w-5 h-5 text-slate-400" /> Settings</div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
              <div className="bg-white border border-slate-100 p-6 rounded-[32px] flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors text-red-500">
                <div className="flex items-center gap-4 font-bold"><LogOut className="w-5 h-5" /> Logout</div>
                <ChevronRight className="w-5 h-5 text-slate-200" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[380px] glass rounded-[32px] px-6 py-4 flex justify-between items-center z-50 shadow-2xl border-t border-white/40">
        <NavItem icon={<Home className="w-6 h-6" />} label="Hoyga" isActive={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
        <NavItem icon={<Compass className="w-6 h-6" />} label="Baadh" isActive={activeTab === 'Explore'} onClick={() => setActiveTab('Explore')} />
        <div className="relative -top-10">
            <button 
              onClick={() => { setActiveTab('Explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="w-16 h-16 bg-blue-600 rounded-[24px] shadow-2xl flex items-center justify-center text-white border-4 border-white active:scale-90 transition-transform hover:bg-blue-700"
            >
                <Search className="w-7 h-7" />
            </button>
        </div>
        <NavItem icon={<BookOpen className="w-6 h-6" />} label="Baro" isActive={activeTab === 'Learn'} onClick={() => setActiveTab('Learn')} />
        <NavItem icon={<User className="w-6 h-6" />} label="Akoonka" isActive={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
      </nav>

      {/* Program Information / Course Detail Overlay */}
      <AnimatePresence>
        {selectedCourseDetail && (
           <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCourseDetail(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 max-w-md mx-auto bg-white z-[70] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-6 bg-white sticky top-0 z-10 border-b border-slate-50">
                   <h2 className="text-2xl font-black text-slate-900">Program Information</h2>
                   <button onClick={() => setSelectedCourseDetail(null)} className="p-2 text-slate-900 hover:bg-slate-50 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-40">
                   <div className="space-y-0">
                      {(selectedCourseDetail.topics.length > 0 ? selectedCourseDetail.topics : [
                        { id: 'm1', title: 'Hordhaca Koorsada' },
                        { id: 'm2', title: 'Sida loo bilaabo casharka' },
                        { id: 'm3', title: 'Xirfadaha muhiimka ah' }
                      ]).map((t: any, i: number) => (
                        <div key={t.id} className="py-8 border-b border-slate-300 relative group overflow-hidden">
                           <div className="flex items-start justify-between opacity-70 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-4">
                                 <span className="text-2xl mt-1">👋</span>
                                 <div className="space-y-1">
                                    <p className="text-lg font-bold text-slate-900 uppercase tracking-tighter">CUTUBKA {i + 1}aad:</p>
                                    <p className="text-xl font-normal text-slate-800 leading-snug">{t.title}</p>
                                 </div>
                              </div>
                              <div className="flex flex-col items-center gap-3 mt-2">
                                <ChevronDown className="w-5 h-5 text-blue-500" />
                                <div className="bg-slate-100 p-2 rounded-full shadow-inner"><Lock className="w-4 h-4 text-slate-400" /></div>
                              </div>
                           </div>
                           <div className="absolute inset-0 bg-transparent cursor-not-allowed" title="Fadlan iibso koorsada si aad u daawato" />
                        </div>
                      ))}
                   </div>
                   <div className="mt-12 mb-10 bg-white rounded-sm overflow-hidden shadow-2xl border border-slate-100 p-4">
                      <div className="relative h-56 mb-6">
                         <img src={selectedCourseDetail.image} className="w-full h-full object-cover" alt="Banner" />
                         <div className="absolute bottom-0 left-0 right-0 bg-[#3a2c27] py-2.5 px-4">
                            <p className="text-white text-[10px] font-bold text-center tracking-[1px]">KA ADKAW MASKAXDAADA, SAMEE HORMAR JOOGTO AH</p>
                         </div>
                      </div>
                      <div className="text-center py-4">
                         <h3 className="text-3xl font-black text-[#8b1a2d] uppercase leading-none mb-1">ISBARO OO</h3>
                         <h3 className="text-3xl font-black text-[#16a34a] uppercase leading-none">WAXQABSO</h3>
                         <div className="mt-6 flex justify-center">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full"></div>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="p-6 bg-white border-t border-slate-50 absolute bottom-0 left-0 right-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                   <button onClick={() => handlePurchase(selectedCourseDetail)} className="w-full py-5 bg-blue-600 text-white font-black text-sm rounded-sm shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-blue-700">
                     <DollarSign className="w-5 h-5" /> Hadda Iibso - ${selectedCourseDetail.price}
                   </button>
                </div>
            </motion.div>
           </>
        )}
      </AnimatePresence>

      {/* Admin Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && isAdmin && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[80]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[90] p-8 shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900">{editingCourse ? 'Bedel Koorsada' : 'Koorso Cusub'}</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              <div className="space-y-8 flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ciwaanka Koorsada</label>
                  <input 
                    type="text" 
                    value={formCourse.title} 
                    onChange={e => setFormCourse({...formCourse, title: e.target.value})}
                    placeholder="e.g. Graphic Design Pro" 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qiimaha ($)</label>
                  <input 
                    type="number" 
                    value={formCourse.price} 
                    onChange={e => setFormCourse({...formCourse, price: e.target.value})}
                    placeholder="49" 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qaybta (Category)</label>
                  <select 
                    value={formCourse.categoryId} 
                    onChange={e => setFormCourse({...formCourse, categoryId: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                  <input 
                    type="text" 
                    value={formCourse.image} 
                    onChange={e => setFormCourse({...formCourse, image: e.target.value})}
                    placeholder="https://images.unsplash..." 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>
              <div className="pt-8 border-t border-slate-50 space-y-4">
                 <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl text-amber-700 text-xs font-bold border border-amber-100/50">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Xogta aad kaydiso waxaa lagu soo bandhigi doonaa bogga 'Baadh'.</span>
                 </div>
                 <button onClick={handleSaveCourse} className="w-full py-5 bg-blue-600 text-white rounded-[28px] font-black text-sm shadow-2xl shadow-blue-100 active:scale-95 transition-all hover:bg-blue-700">
                    Keydi Progress-ka (Save)
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Gateways Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && payingFor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { if(paymentStatus !== 'processing') setIsPaymentModalOpen(false); }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[40px] p-10 z-[110] shadow-2xl">
              {paymentStatus === 'idle' ? (
                <div className="space-y-8">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-sm"><Wallet className="w-10 h-10" /></div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Lacag Bixinta</h3>
                    <p className="text-sm text-slate-400 mt-2 font-medium">Koorsada: {payingFor.title}</p>
                    <div className="mt-4 text-3xl font-black text-blue-600 leading-none">${payingFor.price}</div>
                  </div>
                  <div className="space-y-4">
                    <button onClick={() => processPayment('waafi')} className="w-full p-6 border-2 border-slate-50 rounded-[28px] flex items-center justify-between hover:border-blue-500 hover:bg-blue-50/20 active:scale-[0.98] transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-green-200">W</div> 
                        <div className="text-left">
                           <p className="font-black text-slate-900 leading-none">WaafiPay</p>
                           <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Hormuud</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-blue-500 transition-colors" />
                    </button>
                    <button onClick={() => processPayment('edahab')} className="w-full p-6 border-2 border-slate-50 rounded-[28px] flex items-center justify-between hover:border-blue-500 hover:bg-blue-50/20 active:scale-[0.98] transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-amber-200">E</div> 
                        <div className="text-left">
                           <p className="font-black text-slate-900 leading-none">e-Dahab Plus</p>
                           <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Somtel</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-blue-500 transition-colors" />
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">BaroHub Platform Secure Checkout</p>
                </div>
              ) : (
                <div className="py-24 text-center space-y-8">
                   {paymentStatus === 'processing' ? (
                     <div className="relative w-24 h-24 mx-auto mb-10">
                        <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                     </div>
                   ) : (
                     <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-100 mb-10">
                        <CheckCircle2 className="w-12 h-12" />
                     </motion.div>
                   )}
                   <div className="space-y-3">
                      <h3 className="text-2xl font-black text-slate-900">{paymentStatus === 'processing' ? 'Waa la farsameynayaa...' : 'Waa lagu guuleystay!'}</h3>
                      <p className="text-sm text-slate-400 font-medium">{paymentStatus === 'processing' ? 'Fadlan ha xidhin barnaamijka' : 'Koorsadii si guul leh ayaad u iibsatay.'}</p>
                   </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

interface NavItemProps { icon: React.ReactElement; label: string; isActive: boolean; onClick: () => void; }
const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className="relative flex flex-col items-center gap-1.5 focus:outline-none focus:ring-0">
    <div className={`transition-all duration-300 ${isActive ? 'text-blue-600 scale-110 -translate-y-1' : 'text-slate-400'}`}>{icon}</div>
    <span className={`text-[9px] font-black uppercase tracking-tighter transition-all duration-300 ${isActive ? 'text-blue-600 opacity-100' : 'opacity-0 translate-y-2'}`}>{label}</span>
    {isActive && <motion.div layoutId="navActiveDot" className="absolute -bottom-1 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />}
  </button>
);

export default App;
