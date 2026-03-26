import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { clearStoredUser, getStoredUser } from '../utils/auth';

// Register ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

export default function StaffDashboard() {
    const navigate = useNavigate();
    const currentUser = getStoredUser();
    const displayName = currentUser?.displayName || 'Admin IKMB';
    const userInitials = displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    
    // STATE
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm("Pasti untuk log keluar?")) {
            clearStoredUser();
            navigate('/');
        }
    };

    // --- DATA GRAF (Tepat macam dalam gambar) ---
    const performanceData = {
        labels:['Januari - Jun 2025', 'Julai - Disember 2025', 'Januari - Jun 2026', 'Julai - Disember 2026'],
        datasets: [
            { 
                label: 'Prestasi Akademik', 
                data:[75, 80, 84, 88], 
                borderColor: '#2563EB', // Biru
                backgroundColor: '#2563EB', 
                tension: 0.3, 
                borderWidth: 3,
                pointBackgroundColor: '#2563EB'
            },
            { 
                label: 'Kompetensi Kemahiran', 
                data:[65, 75, 82, 86], 
                borderColor: '#10B981', // Hijau
                backgroundColor: '#10B981', 
                tension: 0.3, 
                borderWidth: 3,
                pointBackgroundColor: '#10B981'
            },
            { 
                label: 'Kesesuaian Industri', 
                data:[60, 70, 78, 85], 
                borderColor: '#F59E0B', // Kuning/Oren
                backgroundColor: '#F59E0B', 
                tension: 0.3, 
                borderWidth: 3,
                pointBackgroundColor: '#F59E0B'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
        },
        scales: {
            y: { beginAtZero: true, max: 100, title: { display: true, text: 'Skor Pencapaian (%)', font: { weight: 'bold' } } },
            x: { title: { display: true, text: 'Sesi Pengajian', font: { weight: 'bold' } } }
        }
    };

    return (
        <div className="flex h-screen overflow-hidden text-slate-800 bg-[#F8FAFC] font-sans">
            
            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"></div>
            )}

            {/* SIDEBAR (Tepat macam gambar: border kiri, font kelabu) */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 shadow-2xl md:shadow-none`}>
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <img src="/logo-tvetmara.jpg" alt="TVETMARA" className="w-48 h-auto object-contain" />
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
                        <i className="ph-bold ph-x text-xl"></i>
                    </button>
                </div>

                <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
                    <p className="px-6 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Menu Utama</p>
                    
                    <button onClick={() => {setActiveTab('overview'); setIsSidebarOpen(false);}} 
                            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                        <i className="ph ph-squares-four text-lg"></i> Dashboard Overview
                    </button>
                    <button onClick={() => {setActiveTab('prediction'); setIsSidebarOpen(false);}} 
                            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${activeTab === 'prediction' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                        <i className="ph ph-magic-wand text-lg"></i> AI Prediction
                    </button>
                    <button onClick={() => {setActiveTab('skills'); setIsSidebarOpen(false);}} 
                            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${activeTab === 'skills' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                        <i className="ph ph-chart-bar text-lg"></i> Skills Gap Analysis
                    </button>
                    <button onClick={() => {setActiveTab('pathways'); setIsSidebarOpen(false);}} 
                            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${activeTab === 'pathways' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                        <i className="ph ph-path text-lg"></i> Learning Pathways
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center text-white font-bold text-sm">{userInitials}</div>
                            <div className="flex flex-col">
                                <p className="text-sm font-bold text-slate-800">{displayName}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Penyelaras</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition">
                            <i className="ph-bold ph-sign-out text-xl"></i>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
                
                {/* HEADER (Search & Bell) */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                            <i className="ph-bold ph-list text-2xl"></i>
                        </button>
                        <div className="flex items-center gap-2 text-slate-400 bg-slate-100 px-4 py-2.5 rounded-full w-full md:w-96">
                            <i className="ph ph-magnifying-glass text-lg"></i>
                            <input type="text" placeholder="Cari pelajar, kursus, atau skill..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-2">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
                            <i className="ph ph-bell text-xl"></i>
                            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20">
                    
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">
                            
                            {/* Tajuk & Badge */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Overview Dashboard</h2>
                                    <p className="text-slate-500 text-sm mt-1">Statistik utama pembangunan kemahiran dan bakat pelajar TVETMARA Besut.</p>
                                </div>
                                <span className="px-4 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">AI-Enabled Analytics</span>
                            </div>
                            
                            {/* KPI CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                {/* Card 1 */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm text-slate-500 font-medium">Jumlah Pelajar Aktif</p>
                                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><i className="ph-fill ph-users text-lg"></i></div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">1,247</h3>
                                    <p className="text-xs text-green-600 font-bold mt-2">▲ 8.2% <span className="text-slate-400 font-normal">berbanding sem lepas</span></p>
                                    <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                                        <div className="bg-slate-800 h-full rounded-full" style={{width: '75%'}}></div>
                                    </div>
                                </div>
                                {/* Card 2 */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm text-slate-500 font-medium">Kadar Kebolehpasaran</p>
                                        <div className="p-1.5 bg-green-50 text-green-600 rounded-lg"><i className="ph-fill ph-briefcase text-lg"></i></div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">92.3%</h3>
                                    <p className="text-xs text-green-600 font-bold mt-2">▲ 5.1% <span className="text-slate-400 font-normal">berbanding sem lepas</span></p>
                                    <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                                        <div className="bg-slate-800 h-full rounded-full" style={{width: '92%'}}></div>
                                    </div>
                                </div>
                                {/* Card 3 */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm text-slate-500 font-medium">Pelajar Berisiko Tinggi</p>
                                        <div className="p-1.5 bg-red-50 text-red-600 rounded-lg"><i className="ph-fill ph-warning text-lg"></i></div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">23</h3>
                                    <p className="text-xs text-green-600 font-bold mt-2">▼ 18.2% <span className="text-slate-400 font-normal">penurunan (Bagus!)</span></p>
                                    <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                                        <div className="bg-slate-800 h-full rounded-full" style={{width: '15%'}}></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* GRAF UTAMA */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                    <i className="ph-bold ph-trend-up text-blue-600"></i> Trend Prestasi & Pembangunan Bakat
                                </h3>
                                <div className="h-80 w-full">
                                    <Line data={performanceData} options={chartOptions} />
                                </div>
                            </div>

                            {/* DUA KOTAK BAWAH (Berisiko & Top Performers) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Kiri: Pelajar Berisiko */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-lg text-red-600 flex items-center gap-2 mb-4">
                                        <i className="ph-fill ph-warning-circle"></i> Pelajar Berisiko Tinggi
                                    </h3>
                                    <div className="space-y-4">
                                        <div onClick={() => navigate('/student-profile?id=TVET001')} className="bg-red-50 p-4 rounded-xl border border-red-100 cursor-pointer hover:bg-red-100 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-800">Muhammad Faiz</h4>
                                                    <p className="text-xs text-red-500 font-semibold mt-1">Prestasi Rendah</p>
                                                </div>
                                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">URGENT</span>
                                            </div>
                                            <div className="mt-4">
                                                <span className="text-xs bg-white border border-red-200 px-3 py-1.5 rounded-lg text-slate-600 font-medium">✓ Bimbingan Akademik</span>
                                            </div>
                                        </div>

                                        <div onClick={() => navigate('/student-profile?id=TVET002')} className="bg-red-50 p-4 rounded-xl border border-red-100 cursor-pointer hover:bg-red-100 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-800">Nur Aisyah</h4>
                                                    <p className="text-xs text-red-500 font-semibold mt-1">Kehadiran Rendah</p>
                                                </div>
                                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">URGENT</span>
                                            </div>
                                            <div className="mt-4">
                                                <span className="text-xs bg-white border border-red-200 px-3 py-1.5 rounded-lg text-slate-600 font-medium">✓ Kaunseling</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Kanan: Top Performers */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-lg text-yellow-600 flex items-center gap-2 mb-4">
                                        <i className="ph-fill ph-star"></i> Top Performers - AI Recognition
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-slate-800">Amirah Sofea</h4>
                                                <p className="text-xs text-yellow-700 mt-1">Cloud Computing Excellence</p>
                                            </div>
                                            <span className="text-2xl font-bold text-yellow-600">98%</span>
                                        </div>
                                        
                                        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-slate-800">Danish Hakim</h4>
                                                <p className="text-xs text-yellow-700 mt-1">AI Innovation Award</p>
                                            </div>
                                            <span className="text-2xl font-bold text-yellow-600">96%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder untuk tab lain */}
                    {activeTab === 'prediction' && (<div className="p-8 text-center text-slate-500">Kandungan AI Prediction.</div>)}
                    {activeTab === 'skills' && (<div className="p-8 text-center text-slate-500">Kandungan Skills Gap.</div>)}
                    {activeTab === 'pathways' && (<div className="p-8 text-center text-slate-500">Kandungan Learning Pathways.</div>)}

                </div>
            </main>
        </div>
    );
}
