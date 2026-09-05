'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Utensils, FolderHeart, CalendarCheck, Settings, 
  Plus, Edit, Trash2, Check, X, LogOut, ArrowRight, ShieldCheck,
  TrendingUp, Star, Phone, DollarSign, Calendar, RotateCcw, AlertTriangle,
  CheckCircle2, AlertCircle, Loader2, Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useBusiness } from '@/context/BusinessContext';
import { Product, Category, Reservation, BusinessProfile, Event } from '@/lib/types';

export default function AdminPage() {
  const { 
    profile, categories, products, events, testimonials, gallery, 
    isMock, refreshData,
    saveMockProducts, saveMockCategories, saveMockEvents, saveMockProfile, resetDemoData
  } = useBusiness();

  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Brute force protection states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Mock accounts state for credentials change
  const [mockUsers, setMockUsers] = useState<{ email: string; username: string; password: string; role: string }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_mock_users') || localStorage.getItem('kb_mock_users');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [
      { email: 'admin@restaurante.com', username: 'admin', password: 'admin123', role: 'Administrador Principal' },
      { email: 'manager@restaurante.com', username: 'manager', password: 'manager123', role: 'Gerente de Turno' }
    ];
  });

  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Dashboard Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'summary' | 'products' | 'categories' | 'reservations' | 'events' | 'recycle' | 'settings'>('summary');

  const handleTabChange = (tab: 'summary' | 'products' | 'categories' | 'reservations' | 'events' | 'recycle' | 'settings') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        const mainEl = document.getElementById('admin-main-view');
        if (mainEl) {
          mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  // Dynamic lists from context for mutations
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [localEvents, setLocalEvents] = useState<Event[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demo_deleted_products');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    // Inicializar mock de productos eliminados para pruebas en modo Demo
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const twelveDaysAgo = new Date();
    twelveDaysAgo.setDate(twelveDaysAgo.getDate() - 12);

    return [
      {
        id: 'del-prod-1',
        category_id: 'cat-2',
        name: 'Costillitas BBQ de la Casa (Eliminado)',
        description: 'Costillitas de cerdo premium de la casa bañadas en salsa barbacoa de whisky, acompañadas de papas fritas y ensalada fresca.',
        price: 48000,
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
        tags: ['Cerdo', 'BBQ', 'Destacado'],
        is_available: true,
        is_promotion: false,
        order_index: 99,
        deleted_at: fiveDaysAgo.toISOString()
      },
      {
        id: 'del-prod-2',
        category_id: 'cat-3',
        name: 'Margarita Clásica de Limón (Eliminado)',
        description: 'Tequila reposado premium, triple sec, zumo de limón fresco y borde escarchado con sal marina.',
        price: 28000,
        image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600',
        tags: ['Coctel', 'Alcohol'],
        is_available: true,
        is_promotion: true,
        original_price: 35000,
        order_index: 99,
        deleted_at: twelveDaysAgo.toISOString()
      }
    ];
  });
  const [deletedEvents, setDeletedEvents] = useState<Event[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demo_deleted_events');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    // Inicializar mock de eventos eliminados para pruebas en modo Demo
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    return [
      {
        id: 'del-evt-1',
        title: 'Noche de Catación de Mezcal (Eliminado)',
        description: 'Una experiencia sensorial guiada por un maestro mezcalero con maridaje de 4 tiempos y música folclórica en vivo.',
        event_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600',
        is_active: true,
        deleted_at: eightDaysAgo.toISOString()
      }
    ];
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resLoading, setResLoading] = useState(false);

  // Floating Toast Notification State
  const [toast, setToast] = useState<{
    id: number;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast(current => (current?.id === id ? null : current));
    }, 4500);
  };

  // Custom Responsive Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    isDanger: false,
    onConfirm: () => {},
  });

  const requestConfirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    options?: { confirmText?: string; isDanger?: boolean }
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText: options?.confirmText || 'Confirmar',
      cancelText: 'Cancelar',
      isDanger: options?.isDanger ?? true,
      onConfirm,
    });
  };

  // Forms state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productFormError, setProductFormError] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    original_price: '',
    category_id: '',
    image_url: '',
    tags: '',
    is_available: true,
    is_promotion: false
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState('');
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    order_index: 0
  });

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventFormError, setEventFormError] = useState('');
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    image_url: '',
    is_active: true
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<BusinessProfile | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsSubmitting, setSettingsSubmitting] = useState(false);

  // Sync business contexts to state
  useEffect(() => {
    setLocalProducts(products);
    setLocalCategories(categories);
    setLocalEvents(events);
    if (profile) {
      setSettingsForm(profile);
    }
  }, [products, categories, events, profile]);

  // Fetch reservations from Supabase (or load mock reservations in Mock mode)
  const loadReservations = async () => {
    setResLoading(true);
    try {
      if (isMock) {
        // Mock reservations
        setReservations([
          { id: 'res-1', customer_name: 'Juan Pérez', customer_phone: '3001234567', reservation_date: '2026-06-05', reservation_time: '20:30', num_people: 2, comments: 'Cerca de la banda', status: 'pending' },
          { id: 'res-2', customer_name: 'Alejandra Moreno', customer_phone: '3007654321', reservation_date: '2026-06-05', reservation_time: '20:30', num_people: 4, comments: 'Cumpleaños de mi madre', status: 'confirmed' },
          { id: 'res-3', customer_name: 'Juan Pablo Roldán', customer_phone: '3109876543', reservation_date: '2026-06-06', reservation_time: '21:00', num_people: 6, comments: undefined, status: 'pending' },
        ]);
      } else {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .order('reservation_date', { ascending: false });
        if (data && !error) {
          setReservations(data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResLoading(false);
    }
  };

  // Cargar elementos eliminados (papelera) y procesar retención
  const loadDeletedItems = async () => {
    if (isMock) {
      if (typeof window !== 'undefined') {
        const savedProds = localStorage.getItem('demo_deleted_products');
        if (savedProds) {
          try { setDeletedProducts(JSON.parse(savedProds)); } catch (e) {}
        }
        const savedEvts = localStorage.getItem('demo_deleted_events');
        if (savedEvts) {
          try { setDeletedEvents(JSON.parse(savedEvts)); } catch (e) {}
        }
      }
      return;
    }

    try {
      const retentionDays = 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      const cutoffString = cutoffDate.toISOString();

      // Purgar definitivamente registros que superen el límite de días (30 días)
      await supabase.from('products').delete().lt('deleted_at', cutoffString);
      await supabase.from('events').delete().lt('deleted_at', cutoffString);

      // Cargar productos en la papelera (deleted_at IS NOT NULL)
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (prodData && !prodErr) {
        setDeletedProducts(prodData.map(p => ({
          ...p,
          price: Number(p.price),
          original_price: p.original_price ? Number(p.original_price) : undefined
        })));
      }

      // Cargar eventos en la papelera (deleted_at IS NOT NULL)
      const { data: evtData, error: evtErr } = await supabase
        .from('events')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (evtData && !evtErr) {
        setDeletedEvents(evtData);
      }
    } catch (err) {
      console.error('Error al cargar la papelera:', err);
    }
  };

  const getRemainingDays = (deletedAtStr?: string) => {
    if (!deletedAtStr) return 30;
    try {
      const deletedAt = new Date(deletedAtStr);
      const now = new Date();
      const diffTime = now.getTime() - deletedAt.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const remaining = 30 - diffDays;
      return remaining > 0 ? remaining : 0;
    } catch (e) {
      return 30;
    }
  };

  const handleRestoreProduct = async (prod: Product) => {
    try {
      if (isMock) {
        const nextDeleted = deletedProducts.filter(p => p.id !== prod.id);
        setDeletedProducts(nextDeleted);
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo_deleted_products', JSON.stringify(nextDeleted));
        }
        const restored: Product = { ...prod, deleted_at: undefined };
        const nextProds = [...localProducts, restored];
        setLocalProducts(nextProds);
        saveMockProducts(nextProds);
      } else {
        const { error } = await supabase
          .from('products')
          .update({ deleted_at: null })
          .eq('id', prod.id);
        if (error) throw error;
        await refreshData();
        await loadDeletedItems();
      }
      showToast('¡Producto Restaurado!', `"${prod.name}" fue devuelto al menú exitosamente.`, 'success');
    } catch (e: any) {
      showToast('Error al restaurar', e.message, 'error');
    }
  };

  const handleRestoreEvent = async (evt: Event) => {
    try {
      if (isMock) {
        const nextDeleted = deletedEvents.filter(e => e.id !== evt.id);
        setDeletedEvents(nextDeleted);
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo_deleted_events', JSON.stringify(nextDeleted));
        }
        const restored: Event = { ...evt, deleted_at: undefined };
        const nextEvts = [...localEvents, restored];
        setLocalEvents(nextEvts);
        saveMockEvents(nextEvts);
      } else {
        const { error } = await supabase
          .from('events')
          .update({ deleted_at: null })
          .eq('id', evt.id);
        if (error) throw error;
        await refreshData();
        await loadDeletedItems();
      }
      showToast('¡Evento Restaurado!', `"${evt.title}" volvió a estar activo.`, 'success');
    } catch (e: any) {
      showToast('Error al restaurar', e.message, 'error');
    }
  };

  const handlePermanentDeleteProduct = (id: string) => {
    const prod = deletedProducts.find(p => p.id === id);
    const prodName = prod?.name || 'este producto';

    requestConfirm(
      '¿Eliminar producto definitivamente?',
      `¿Deseas borrar permanentemente "${prodName}"? Esta acción no se puede revertir.`,
      async () => {
        try {
          if (isMock) {
            const nextDeleted = deletedProducts.filter(p => p.id !== id);
            setDeletedProducts(nextDeleted);
            if (typeof window !== 'undefined') {
              localStorage.setItem('demo_deleted_products', JSON.stringify(nextDeleted));
            }
          } else {
            const { error } = await supabase
              .from('products')
              .delete()
              .eq('id', id);
            if (error) throw error;
            await loadDeletedItems();
          }
          showToast('Producto Eliminado', `"${prodName}" fue purgado definitivamente.`, 'info');
        } catch (e: any) {
          showToast('Error al eliminar', e.message, 'error');
        }
      },
      { confirmText: 'Eliminar Definitivamente', isDanger: true }
    );
  };

  const handlePermanentDeleteEvent = (id: string) => {
    const evt = deletedEvents.find(e => e.id === id);
    const evtTitle = evt?.title || 'este evento';

    requestConfirm(
      '¿Eliminar evento definitivamente?',
      `¿Deseas borrar permanentemente "${evtTitle}"? Esta acción no se puede revertir.`,
      async () => {
        try {
          if (isMock) {
            const nextDeleted = deletedEvents.filter(e => e.id !== id);
            setDeletedEvents(nextDeleted);
            if (typeof window !== 'undefined') {
              localStorage.setItem('demo_deleted_events', JSON.stringify(nextDeleted));
            }
          } else {
            const { error } = await supabase
              .from('events')
              .delete()
              .eq('id', id);
            if (error) throw error;
            await loadDeletedItems();
          }
          showToast('Evento Eliminado', `"${evtTitle}" fue purgado definitivamente.`, 'info');
        } catch (e: any) {
          showToast('Error al eliminar', e.message, 'error');
        }
      },
      { confirmText: 'Eliminar Definitivamente', isDanger: true }
    );
  };

  const handleEmptyTrash = () => {
    requestConfirm(
      '¿Vaciar papelera de reciclaje?',
      'Se borrarán de forma permanente todos los productos y eventos de la papelera. Esta acción no se puede deshacer.',
      async () => {
        try {
          if (isMock) {
            setDeletedProducts([]);
            setDeletedEvents([]);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('demo_deleted_products');
              localStorage.removeItem('demo_deleted_events');
            }
          } else {
            const { error: prodErr } = await supabase
              .from('products')
              .delete()
              .not('deleted_at', 'is', null);

            const { error: evtErr } = await supabase
              .from('events')
              .delete()
              .not('deleted_at', 'is', null);

            if (prodErr) throw prodErr;
            if (evtErr) throw evtErr;
            await loadDeletedItems();
          }
          showToast('Papelera Vaciada', 'Todos los elementos eliminados fueron purgados exitosamente.', 'info');
        } catch (e: any) {
          showToast('Error al vaciar papelera', e.message, 'error');
        }
      },
      { confirmText: 'Vaciar Papelera', isDanger: true }
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadReservations();
      loadDeletedItems();
    }
  }, [isAuthenticated, isMock]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Verificar si está bloqueado temporalmente por seguridad
    if (lockoutTime && Date.now() < lockoutTime) {
      setAuthError(`Demasiados intentos fallidos. Acceso bloqueado. Inténtalo de nuevo en ${secondsRemaining} segundos.`);
      return;
    }

    setAuthLoading(true);

    const loginInput = email.trim().toLowerCase();

    if (isMock) {
      // En demo permitimos usuario corto para facilitar pruebas locales.
      let resolvedEmail = loginInput;
      if (!resolvedEmail.includes('@')) {
        resolvedEmail = `${resolvedEmail}@restaurante.com`;
      }

      const demoUsers = [
        { email: 'admin@restaurante.com', username: 'admin', password: 'admin123', role: 'Administrador Principal' },
        { email: 'manager@restaurante.com', username: 'manager', password: 'manager123', role: 'Gerente de Turno' },
      ];
      const eligibleUsers = [...demoUsers, ...mockUsers];

      // Buscar usuario en nuestra lista de cuentas mock
      const matchedUser = eligibleUsers.find(
        (u) => 
          (u.email.toLowerCase() === resolvedEmail || u.username.toLowerCase() === loginInput) && 
          u.password === password
      );

      if (matchedUser) {
        setIsAuthenticated(true);
        setCurrentUserEmail(matchedUser.email);
        localStorage.setItem('admin_session', matchedUser.email);
        setFailedAttempts(0);
        localStorage.removeItem('admin_lockout');
        localStorage.removeItem('kb_admin_lockout');
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        
        if (nextAttempts >= 5) {
          const lockTime = Date.now() + 180000; // Bloqueo de 3 minutos (180,000 ms)
          setLockoutTime(lockTime);
          setSecondsRemaining(180);
          localStorage.setItem('admin_lockout', String(lockTime));
          setAuthError('Tu cuenta ha sido bloqueada temporalmente por 3 minutos debido a 5 intentos fallidos de inicio de sesión.');
        } else {
          setAuthError(`Credenciales incorrectas. Intentos restantes antes de bloquear: ${5 - nextAttempts}.`);
        }
      }
      setAuthLoading(false);
    } else {
      // Real Supabase Auth Login
      let resolvedEmail = loginInput;
      if (!resolvedEmail.includes('@')) {
        resolvedEmail = `${resolvedEmail}@restaurante.com`;
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: resolvedEmail,
          password
        });
        
        if (error) {
          const nextAttempts = failedAttempts + 1;
          setFailedAttempts(nextAttempts);
          
          if (nextAttempts >= 5) {
            const lockTime = Date.now() + 180000; // Bloqueo de 3 minutos
            setLockoutTime(lockTime);
            setSecondsRemaining(180);
            localStorage.setItem('kb_admin_lockout', String(lockTime));
            setAuthError('Tu cuenta ha sido bloqueada temporalmente por 3 minutos debido a 5 intentos fallidos de inicio de sesión.');
          } else {
            let detail = error.message;
            if (error.message.toLowerCase().includes('invalid login credentials')) {
              detail = `Credenciales no válidas para "${resolvedEmail}". Recuerda que debes crear el usuario en Supabase (Authentication > Users o ejecutando el script supabase_admin_user.sql).`;
            } else if (error.message.toLowerCase().includes('email not confirmed')) {
              detail = `El correo "${resolvedEmail}" no ha sido confirmado en Supabase. En Supabase > Authentication > Users activa "Auto-confirm user".`;
            } else if (error.message.toLowerCase().includes('database error querying schema')) {
              detail = `Error de esquema en Supabase: campos de tokens en NULL. Ejecuta el script de corrección en supabase_admin_user.sql o elimina y vuelve a crear el usuario desde Authentication > Users.`;
            }
            setAuthError(`${detail} (Intentos restantes: ${5 - nextAttempts})`);
          }
        } else {
          setIsAuthenticated(true);
          const activeEmail = data.user?.email || resolvedEmail;
          setCurrentUserEmail(activeEmail);
          localStorage.setItem('kb_admin_session', activeEmail);
          setFailedAttempts(0);
          localStorage.removeItem('kb_admin_lockout');
        }
      } catch (err: any) {
        setAuthError(`Ocurrió un error de conexión con Supabase: ${err?.message || 'desconocido'}.`);
      } finally {
        setAuthLoading(false);
      }
    }
  };

  // Auto-login if session exists, check lockout, check session timeout/expiration
  useEffect(() => {
    // 1. Cargar sesión existente
    const session = localStorage.getItem('kb_admin_session');
    if (session) {
      setIsAuthenticated(true);
      setCurrentUserEmail(session);
    }

    // 2. Cargar estado de bloqueo por fuerza bruta
    const storedLockout = localStorage.getItem('kb_admin_lockout');
    if (storedLockout) {
      const parsed = Number(storedLockout);
      if (parsed > Date.now()) {
        setLockoutTime(parsed);
        setSecondsRemaining(Math.round((parsed - Date.now()) / 1000));
      } else {
        localStorage.removeItem('kb_admin_lockout');
      }
    }
  }, []);

  useEffect(() => {
    if (isMock) return;

    let isMounted = true;

    const syncSupabaseSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const activeEmail = data.session?.user.email;

      if (!isMounted) return;

      if (error || !activeEmail) {
        localStorage.removeItem('kb_admin_session');
        setIsAuthenticated(false);
        setCurrentUserEmail('');
      } else {
        setIsAuthenticated(true);
        setCurrentUserEmail(activeEmail);
        localStorage.setItem('kb_admin_session', activeEmail);
      }
    };

    syncSupabaseSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeEmail = session?.user.email;

      if (activeEmail) {
        setIsAuthenticated(true);
        setCurrentUserEmail(activeEmail);
        localStorage.setItem('kb_admin_session', activeEmail);
      } else {
        setIsAuthenticated(false);
        setCurrentUserEmail('');
        localStorage.removeItem('kb_admin_session');
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [isMock]);

  // Intervalo del contador del bloqueo
  useEffect(() => {
    if (lockoutTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.round((lockoutTime - Date.now()) / 1000));
        setSecondsRemaining(remaining);
        if (remaining === 0) {
          setLockoutTime(null);
          setFailedAttempts(0);
          localStorage.removeItem('kb_admin_lockout');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const handleLogout = () => {
    localStorage.removeItem('kb_admin_session');
    setIsAuthenticated(false);
    setCurrentUserEmail('');
    if (!isMock) {
      supabase.auth.signOut();
    }
  };

  // Helper formatting currencies
  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // ==========================================
  // PRODUCTS CRUD ACTIONS
  // ==========================================
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError('');

    const pPrice = Number(productForm.price);
    const pOrigPrice = productForm.original_price ? Number(productForm.original_price) : null;
    const pTags = productForm.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (!productForm.name.trim()) {
      setProductFormError('Por favor ingresa el nombre del platillo o bebida.');
      return;
    }

    if (!productForm.category_id) {
      setProductFormError('Debes seleccionar una categoría.');
      return;
    }

    if (isNaN(pPrice) || pPrice <= 0) {
      setProductFormError('Ingresa un precio de venta válido mayor a $0 COP.');
      return;
    }

    setProductSubmitting(true);

    try {
      const savedName = productForm.name.trim();
      const wasEditing = !!editingProduct;

      if (isMock) {
        let updatedProds: Product[] = [];
        if (editingProduct) {
          // Edit local mock state
          updatedProds = localProducts.map(p => p.id === editingProduct.id ? {
            ...p,
            name: savedName,
            description: productForm.description.trim(),
            price: pPrice,
            original_price: pOrigPrice || undefined,
            category_id: productForm.category_id,
            image_url: productForm.image_url.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
            tags: pTags,
            is_available: productForm.is_available,
            is_promotion: productForm.is_promotion
          } : p);
        } else {
          // Add local mock state
          const newProd: Product = {
            id: `prod-${Date.now()}`,
            category_id: productForm.category_id,
            name: savedName,
            description: productForm.description.trim(),
            price: pPrice,
            original_price: pOrigPrice || undefined,
            image_url: productForm.image_url.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
            tags: pTags,
            is_available: productForm.is_available,
            is_promotion: productForm.is_promotion,
            order_index: localProducts.length + 1
          };
          updatedProds = [...localProducts, newProd];
        }
        setLocalProducts(updatedProds);
        saveMockProducts(updatedProds);
      } else {
        // Supabase DB query
        if (editingProduct) {
          const { error } = await supabase
            .from('products')
            .update({
              name: savedName,
              description: productForm.description.trim(),
              price: pPrice,
              original_price: pOrigPrice,
              category_id: productForm.category_id,
              image_url: productForm.image_url.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
              tags: pTags,
              is_available: productForm.is_available,
              is_promotion: productForm.is_promotion
            })
            .eq('id', editingProduct.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('products')
            .insert([{
              name: savedName,
              description: productForm.description.trim(),
              price: pPrice,
              original_price: pOrigPrice,
              category_id: productForm.category_id,
              image_url: productForm.image_url.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
              tags: pTags,
              is_available: productForm.is_available,
              is_promotion: productForm.is_promotion,
              order_index: localProducts.length + 1
            }]);
          if (error) throw error;
        }
        await refreshData();
      }

      // Cerrar panel modal de inmediato
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({
        name: '', description: '', price: 0, original_price: '',
        category_id: '', image_url: '', tags: '', is_available: true, is_promotion: false
      });

      // Confirmación visual
      showToast(
        wasEditing ? '¡Producto Actualizado!' : '¡Producto Agregado!',
        wasEditing
          ? `Los cambios en "${savedName}" se guardaron correctamente.`
          : `"${savedName}" fue añadido exitosamente al catálogo.`,
        'success'
      );
    } catch (e: any) {
      setProductFormError('Error en base de datos: ' + e.message);
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormError('');
    setProductForm({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      original_price: prod.original_price ? String(prod.original_price) : '',
      category_id: prod.category_id,
      image_url: prod.image_url || '',
      tags: prod.tags ? prod.tags.join(', ') : '',
      is_available: prod.is_available,
      is_promotion: prod.is_promotion
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    const prod = localProducts.find(p => p.id === id);
    const prodName = prod?.name || 'este producto';

    requestConfirm(
      '¿Enviar producto a la papelera?',
      `¿Deseas mover "${prodName}" a la papelera de reciclaje? Podrás recuperarlo durante 30 días.`,
      async () => {
        try {
          if (isMock) {
            if (prod) {
              const softDeleted: Product = { ...prod, deleted_at: new Date().toISOString() };
              const nextDeleted = [softDeleted, ...deletedProducts];
              setDeletedProducts(nextDeleted);
              if (typeof window !== 'undefined') {
                localStorage.setItem('demo_deleted_products', JSON.stringify(nextDeleted));
              }
              const updatedProds = localProducts.filter(p => p.id !== id);
              setLocalProducts(updatedProds);
              saveMockProducts(updatedProds);
            }
          } else {
            const { error } = await supabase
              .from('products')
              .update({ deleted_at: new Date().toISOString() })
              .eq('id', id);
            if (error) throw error;
            await refreshData();
            await loadDeletedItems();
          }
          showToast('Producto en Papelera', `"${prodName}" fue trasladado a la papelera.`, 'info');
        } catch (e: any) {
          showToast('Error', e.message, 'error');
        }
      },
      { confirmText: 'Mover a Papelera', isDanger: true }
    );
  };

  const toggleAvailability = async (prod: Product) => {
    try {
      const nextAvail = !prod.is_available;
      if (isMock) {
        const updatedProds = localProducts.map(p => p.id === prod.id ? { ...p, is_available: nextAvail } : p);
        setLocalProducts(updatedProds);
        saveMockProducts(updatedProds);
      } else {
        const { error } = await supabase
          .from('products')
          .update({ is_available: nextAvail })
          .eq('id', prod.id);
        if (error) throw error;
        await refreshData();
      }
      showToast(
        nextAvail ? 'Producto Disponible' : 'Producto Marcado Agotado',
        `"${prod.name}" ahora está ${nextAvail ? 'disponible' : 'agotado'} en el menú.`,
        'info'
      );
    } catch (e: any) {
      showToast('Error', 'No se pudo cambiar la disponibilidad: ' + e.message, 'error');
    }
  };

  // ==========================================
  // CATEGORIES CRUD ACTIONS
  // ==========================================
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFormError('');

    if (!categoryForm.name.trim()) {
      setCategoryFormError('Por favor ingresa el nombre de la categoría.');
      return;
    }

    const catSlug = categoryForm.slug.trim() || categoryForm.name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    setCategorySubmitting(true);
    try {
      const savedName = categoryForm.name.trim();
      const wasEditing = !!editingCategory;

      if (isMock) {
        let updatedCats: Category[] = [];
        if (editingCategory) {
          updatedCats = localCategories.map(c => c.id === editingCategory.id ? {
            ...c,
            name: savedName,
            slug: catSlug,
            order_index: Number(categoryForm.order_index)
          } : c);
        } else {
          const newCat: Category = {
            id: `cat-${Date.now()}`,
            name: savedName,
            slug: catSlug,
            order_index: Number(categoryForm.order_index) || localCategories.length + 1,
            is_active: true
          };
          updatedCats = [...localCategories, newCat];
        }
        setLocalCategories(updatedCats);
        saveMockCategories(updatedCats);
      } else {
        if (editingCategory) {
          const { error } = await supabase
            .from('categories')
            .update({
              name: savedName,
              slug: catSlug,
              order_index: Number(categoryForm.order_index)
            })
            .eq('id', editingCategory.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('categories')
            .insert([{
              name: savedName,
              slug: catSlug,
              order_index: Number(categoryForm.order_index) || localCategories.length + 1
            }]);
          if (error) throw error;
        }
        await refreshData();
      }

      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', slug: '', order_index: 0 });

      showToast(
        wasEditing ? '¡Categoría Actualizada!' : '¡Categoría Creada!',
        `La categoría "${savedName}" se guardó exitosamente.`,
        'success'
      );
    } catch (e: any) {
      setCategoryFormError('Error: ' + e.message);
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFormError('');
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      order_index: cat.order_index
    });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    const cat = localCategories.find(c => c.id === id);
    const catName = cat?.name || 'esta categoría';

    requestConfirm(
      '¿Eliminar categoría?',
      `¿Deseas eliminar permanentemente "${catName}"? Los platillos pertenecientes a esta categoría permanecerán intactos.`,
      async () => {
        try {
          if (isMock) {
            const updatedCats = localCategories.filter(c => c.id !== id);
            setLocalCategories(updatedCats);
            saveMockCategories(updatedCats);
          } else {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            await refreshData();
          }
          showToast('Categoría Eliminada', `"${catName}" fue eliminada.`, 'info');
        } catch (e: any) {
          showToast('Error', e.message, 'error');
        }
      },
      { confirmText: 'Eliminar Categoría', isDanger: true }
    );
  };

  // ==========================================
  // RESERVATIONS ACTIONS
  // ==========================================
  const updateReservationStatus = async (id: string, nextStatus: 'confirmed' | 'cancelled') => {
    try {
      if (isMock) {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: nextStatus } : r));
      } else {
        const { error } = await supabase
          .from('reservations')
          .update({ status: nextStatus })
          .eq('id', id);
        if (error) throw error;
        await loadReservations();
      }
      showToast(
        'Reserva Actualizada',
        `La reserva fue ${nextStatus === 'confirmed' ? 'confirmada' : 'cancelada'} correctamente.`,
        'info'
      );
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  // ==========================================
  // EVENTS CRUD ACTIONS
  // ==========================================
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventFormError('');

    if (!eventForm.title.trim()) {
      setEventFormError('Por favor ingresa el título del evento.');
      return;
    }

    if (!eventForm.event_date) {
      setEventFormError('Debes seleccionar fecha y hora para el evento.');
      return;
    }

    setEventSubmitting(true);
    try {
      const savedTitle = eventForm.title.trim();
      const wasEditing = !!editingEvent;

      if (isMock) {
        let updatedEvts: Event[] = [];
        if (editingEvent) {
          updatedEvts = localEvents.map(evt => evt.id === editingEvent.id ? {
            ...evt,
            title: savedTitle,
            description: eventForm.description.trim(),
            event_date: eventForm.event_date,
            image_url: eventForm.image_url.trim() || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80',
            is_active: eventForm.is_active
          } : evt);
        } else {
          const newEvt: Event = {
            id: `evt-${Date.now()}`,
            title: savedTitle,
            description: eventForm.description.trim(),
            event_date: eventForm.event_date,
            image_url: eventForm.image_url.trim() || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80',
            is_active: eventForm.is_active
          };
          updatedEvts = [...localEvents, newEvt];
        }
        setLocalEvents(updatedEvts);
        saveMockEvents(updatedEvts);
      } else {
        if (editingEvent) {
          const { error } = await supabase
            .from('events')
            .update({
              title: savedTitle,
              description: eventForm.description.trim(),
              event_date: eventForm.event_date,
              image_url: eventForm.image_url.trim() || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80',
              is_active: eventForm.is_active
            })
            .eq('id', editingEvent.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('events')
            .insert([{
              title: savedTitle,
              description: eventForm.description.trim(),
              event_date: eventForm.event_date,
              image_url: eventForm.image_url.trim() || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80',
              is_active: eventForm.is_active
            }]);
          if (error) throw error;
        }
        await refreshData();
      }

      setIsEventModalOpen(false);
      setEditingEvent(null);
      setEventForm({ title: '', description: '', event_date: '', image_url: '', is_active: true });

      showToast(
        wasEditing ? '¡Evento Actualizado!' : '¡Evento Creado!',
        `El evento "${savedTitle}" fue guardado exitosamente.`,
        'success'
      );
    } catch (e: any) {
      setEventFormError('Error: ' + e.message);
    } finally {
      setEventSubmitting(false);
    }
  };

  const handleEditEvent = (evt: Event) => {
    setEditingEvent(evt);
    setEventFormError('');
    let formattedDate = '';
    try {
      const date = new Date(evt.event_date);
      formattedDate = date.toISOString().slice(0, 16);
    } catch (e) {
      formattedDate = evt.event_date;
    }
    setEventForm({
      title: evt.title,
      description: evt.description || '',
      event_date: formattedDate,
      image_url: evt.image_url || '',
      is_active: evt.is_active
    });
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    const evt = localEvents.find(e => e.id === id);
    const evtTitle = evt?.title || 'este evento';

    requestConfirm(
      '¿Enviar evento a la papelera?',
      `¿Deseas mover "${evtTitle}" a la papelera de reciclaje? Podrás recuperarlo en cualquier momento.`,
      async () => {
        try {
          if (isMock) {
            if (evt) {
              const softDeleted: Event = { ...evt, deleted_at: new Date().toISOString() };
              const nextDeleted = [softDeleted, ...deletedEvents];
              setDeletedEvents(nextDeleted);
              if (typeof window !== 'undefined') {
                localStorage.setItem('demo_deleted_events', JSON.stringify(nextDeleted));
              }
              const updatedEvts = localEvents.filter(e => e.id !== id);
              setLocalEvents(updatedEvts);
              saveMockEvents(updatedEvts);
            }
          } else {
            const { error } = await supabase
              .from('events')
              .update({ deleted_at: new Date().toISOString() })
              .eq('id', id);
            if (error) throw error;
            await refreshData();
            await loadDeletedItems();
          }
          showToast('Evento en Papelera', `"${evtTitle}" fue enviado a la papelera.`, 'info');
        } catch (e: any) {
          showToast('Error', e.message, 'error');
        }
      },
      { confirmText: 'Mover a Papelera', isDanger: true }
    );
  };

  const toggleEventActive = async (evt: Event) => {
    try {
      const nextActive = !evt.is_active;
      if (isMock) {
        const updatedEvts = localEvents.map(e => e.id === evt.id ? { ...e, is_active: nextActive } : e);
        setLocalEvents(updatedEvts);
        saveMockEvents(updatedEvts);
      } else {
        const { error } = await supabase
          .from('events')
          .update({ is_active: nextActive })
          .eq('id', evt.id);
        if (error) throw error;
        await refreshData();
      }
      showToast(
        nextActive ? 'Evento Publicado' : 'Evento Pausado',
        `"${evt.title}" ahora está ${nextActive ? 'visible' : 'oculto'} en la página principal.`,
        'info'
      );
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  // ==========================================
  // CONFIGURATION UPDATE ACTIONS
  // ==========================================
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    setSettingsSubmitting(true);
    try {
      if (isMock) {
        // Mock save
        saveMockProfile(settingsForm);
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
        showToast('¡Configuración Guardada!', 'Los datos del restaurante se actualizaron correctamente en el modo demo.', 'success');
      } else {
        // Supabase DB save
        const { error } = await supabase
          .from('business_profile')
          .update({
            name: settingsForm.name,
            slogan: settingsForm.slogan,
            logo_url: settingsForm.logo_url,
            address: settingsForm.address,
            whatsapp_number: settingsForm.whatsapp_number,
            google_maps_embed: settingsForm.google_maps_embed,
            about_text: settingsForm.about_text,
          })
          .eq('id', settingsForm.id);

        if (error) throw error;
        setSettingsSuccess(true);
        await refreshData();
        setTimeout(() => setSettingsSuccess(false), 3000);
        showToast('¡Configuración Guardada!', 'Los cambios en los datos del restaurante se aplicaron en la base de datos.', 'success');
      }
    } catch (e: any) {
      showToast('Error al guardar', e.message, 'error');
    } finally {
      setSettingsSubmitting(false);
    }
  };

  const handleSettingsFieldChange = (key: keyof BusinessProfile, val: any) => {
    setSettingsForm((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: val };
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    // Validar coincidencia de nueva contraseña
    if (newPassword !== confirmPassword) {
      setPassError('Las contraseñas nuevas no coinciden.');
      return;
    }

    // Validar contraseña fuerte
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      setPassError('La nueva contraseña debe tener al menos 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un carácter especial.');
      return;
    }

    setPassLoading(true);

    try {
      if (isMock) {
        // Encontrar al usuario actual en mockUsers
        const userIndex = mockUsers.findIndex(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
        if (userIndex === -1) {
          setPassError('No se encontró al usuario actual en la sesión.');
          setPassLoading(false);
          return;
        }

        // Validar contraseña actual
        if (mockUsers[userIndex].password !== currentPassword) {
          setPassError('La contraseña actual es incorrecta.');
          setPassLoading(false);
          return;
        }

        // Actualizar contraseña
        const updatedUsers = [...mockUsers];
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          password: newPassword
        };
        setMockUsers(updatedUsers);
        localStorage.setItem('kb_mock_users', JSON.stringify(updatedUsers));
        setPassSuccess('¡Contraseña actualizada con éxito!');
        showToast('¡Contraseña Actualizada!', 'Tu contraseña ha sido modificada con éxito.', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // Supabase Auth update password
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) {
          setPassError(error.message);
        } else {
          setPassSuccess('¡Contraseña actualizada con éxito en Supabase Auth!');
          showToast('¡Contraseña Actualizada!', 'Tu contraseña ha sido modificada con éxito.', 'success');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err: any) {
      setPassError('Ocurrió un error inesperado al actualizar las credenciales.');
    } finally {
      setPassLoading(false);
    }
  };

  // ==========================================
  // RENDER SECTIONS
  // ==========================================

  // 1. LOGIN GATE LAYOUT
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080E1E] flex flex-col justify-center items-center p-4">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FBBF24]/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FBBF24]/5 rounded-full blur-[100px] -z-10"></div>

        <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-white/5 border border-white/5 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#FBBF24]/10 border border-[#FBBF24]/40 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-[#FBBF24]" />
            </div>
            <h1 className="font-display text-white text-xl sm:text-2xl font-bold tracking-widest uppercase">
              Administración
            </h1>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              {isMock 
                ? 'Modo Demo Activo. Digita la contraseña "admin123" para ingresar.' 
                : 'Acceso seguro a base de datos Supabase.'}
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-xs mb-6 text-center space-y-2">
              <p>{authError}</p>
              {lockoutTime && (
                <button
                  type="button"
                  onClick={() => {
                    setLockoutTime(null);
                    setFailedAttempts(0);
                    setSecondsRemaining(0);
                    localStorage.removeItem('admin_lockout');
                    localStorage.removeItem('kb_admin_lockout');
                    setAuthError('');
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold transition-colors"
                >
                  Restablecer bloqueo de intentos
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                {isMock ? 'Usuario o correo' : 'Correo electrónico'}
              </label>
              <input
                type={isMock ? 'text' : 'email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isMock ? 'admin' : 'admin@restaurante.com'}
                className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Contraseña Administrativa
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 mt-3 rounded-full bg-[#FBBF24] hover:bg-amber-400 text-black font-black shadow-md font-display text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:shadow-lg active:scale-98 disabled:opacity-50 transition-all duration-300"
            >
              {authLoading ? 'Ingresando...' : 'Iniciar Sesión'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center mt-8">
            <a href="/" className="text-xs text-gray-500 hover:text-[#FBBF24] transition-colors font-display">
              ← Regresar al sitio principal
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD WORKSPACE
  return (
    <div className="min-h-screen bg-[#080E1E] flex flex-col md:flex-row text-gray-100">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#050507] border-b md:border-b-0 md:border-r border-slate-800 p-4 md:p-6 flex flex-col md:justify-between shrink-0 sticky top-0 z-30 md:static backdrop-blur-md md:backdrop-blur-none bg-[#050507]/95">
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between md:justify-start gap-2 mb-3 md:mb-10 pb-3 md:pb-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FBBF24]/10 border border-[#FBBF24]/40 flex items-center justify-center font-sans text-[#FBBF24] font-bold shrink-0">
                {profile.name ? profile.name.charAt(0) : 'R'}
              </div>
              <div>
                <h2 className="font-display text-white text-xs sm:text-sm font-bold uppercase tracking-wider leading-none">
                  {profile.name}
                </h2>
                <span className="text-[9px] text-[#FBBF24] tracking-widest font-sans font-bold uppercase">
                  {isMock ? 'PANEL DEMO' : 'SOCIOS SAAS'}
                </span>
              </div>
            </div>

            {/* Quick mobile links */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href="/"
                className="px-2.5 py-1.5 border border-white/10 hover:border-[#FBBF24]/40 rounded-lg text-[10px] tracking-wider uppercase font-display text-gray-300 hover:text-white transition-colors"
              >
                Web
              </a>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-900/40 touch-manipulation active:scale-90"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nav Nodes: Horizontal scrollable pill bar on mobile, vertical sidebar on desktop */}
          <nav className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0 scrollbar-none touch-pan-x">
            <button
              type="button"
              onClick={() => handleTabChange('summary')}
              className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer ${
                activeTab === 'summary' 
                  ? 'bg-[#FBBF24] text-black font-bold shadow-md' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white bg-white/[0.03] md:bg-transparent border border-white/5 md:border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span>Resumen</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('products')}
              className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer ${
                activeTab === 'products' 
                  ? 'bg-[#FBBF24] text-black font-bold shadow-md' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white bg-white/[0.03] md:bg-transparent border border-white/5 md:border-transparent'
              }`}
            >
              <Utensils className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span>Catálogo</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('categories')}
              className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer ${
                activeTab === 'categories' 
                  ? 'bg-[#FBBF24] text-black font-bold shadow-md' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white bg-white/[0.03] md:bg-transparent border border-white/5 md:border-transparent'
              }`}
            >
              <FolderHeart className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span>Categorías</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('reservations')}
              className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer ${
                activeTab === 'reservations' 
                  ? 'bg-[#FBBF24] text-black font-bold shadow-md' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white bg-white/[0.03] md:bg-transparent border border-white/5 md:border-transparent'
              }`}
            >
              <CalendarCheck className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span>Reservas</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('events')}
              className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer ${
                activeTab === 'events' 
                  ? 'bg-[#FBBF24] text-black font-bold shadow-md' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white bg-white/[0.03] md:bg-transparent border border-white/5 md:border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span>Eventos</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('recycle')}
              className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer ${
                activeTab === 'recycle' 
                  ? 'bg-[#FBBF24] text-black font-bold shadow-md' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white bg-white/[0.03] md:bg-transparent border border-white/5 md:border-transparent'
              }`}
            >
              <Trash2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span>Papelera</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('settings')}
              className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-[#FBBF24] text-black font-bold shadow-md' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white bg-white/[0.03] md:bg-transparent border border-white/5 md:border-transparent'
              }`}
            >
              <Settings className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span>Configurar</span>
            </button>
          </nav>
        </div>

        {/* Footer Area with Signout (desktop only, mobile has it in top header) */}
        <div className="hidden md:flex pt-6 border-t border-white/5 mt-6 flex-col gap-3">
          <a
            href="/"
            className="w-full text-center py-2 border border-white/10 hover:border-[#FBBF24]/30 rounded-xl text-xs tracking-wider uppercase font-display hover:text-[#FBBF24] transition-all"
          >
            Ver Sitio Web
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-950/20 text-red-400 border border-red-950/40 text-xs font-display uppercase tracking-widest font-bold hover:bg-red-900/20 transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Workspace content */}
      <main id="admin-main-view" className="flex-1 p-4 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* TAB 1: SUMMARY (DASHBOARD METRICS) */}
        {activeTab === 'summary' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
              <h1 className="font-display text-3xl font-bold tracking-wide text-white">Panel de Control</h1>
              <p className="text-gray-400 text-xs mt-1">Monitorea y configura las estadísticas esenciales de tu negocio.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Metric 1 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FBBF24]/5 rounded-full blur-xl"></div>
                <Utensils className="w-8 h-8 text-[#FBBF24] mb-3" />
                <span className="text-xs text-gray-500 font-sans uppercase tracking-widest font-semibold">Productos</span>
                <h3 className="text-3xl font-extrabold text-white font-display tracking-wider mt-1">{localProducts.length}</h3>
              </div>

              {/* Metric 2 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FBBF24]/5 rounded-full blur-xl"></div>
                <FolderHeart className="w-8 h-8 text-[#FBBF24] mb-3" />
                <span className="text-xs text-gray-500 font-sans uppercase tracking-widest font-semibold">Categorías</span>
                <h3 className="text-3xl font-extrabold text-white font-display tracking-wider mt-1">{localCategories.length}</h3>
              </div>

              {/* Metric 3 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FBBF24]/5 rounded-full blur-xl"></div>
                <CalendarCheck className="w-8 h-8 text-[#FBBF24] mb-3" />
                <span className="text-xs text-gray-500 font-sans uppercase tracking-widest font-semibold">Reservas Totales</span>
                <h3 className="text-3xl font-extrabold text-white font-display tracking-wider mt-1">{reservations.length}</h3>
              </div>

              {/* Metric 4 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FBBF24]/5 rounded-full blur-xl"></div>
                <TrendingUp className="w-8 h-8 text-[#FBBF24] mb-3" />
                <span className="text-xs text-gray-500 font-sans uppercase tracking-widest font-semibold">Descuentos</span>
                <h3 className="text-3xl font-extrabold text-white font-display tracking-wider mt-1">
                  {localProducts.filter(p => p.is_promotion).length}
                </h3>
              </div>

            </div>

            {/* Quick reservations summary list */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/5 shadow-xl">
              <h3 className="font-display text-white text-lg font-bold tracking-wide mb-6 flex items-center justify-between">
                <span>Últimas Solicitudes de Reservas</span>
                <button 
                  onClick={() => setActiveTab('reservations')} 
                  className="text-xs text-[#FBBF24] hover:underline font-sans uppercase tracking-wider"
                >
                  Ver Todo
                </button>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 font-sans uppercase tracking-widest text-[10px]">
                      <th className="py-3 pr-4">Cliente</th>
                      <th className="py-3 pr-4">Fecha & Hora</th>
                      <th className="py-3 pr-4 text-center">Invitados</th>
                      <th className="py-3 pr-4">Notas</th>
                      <th className="py-3 pr-4 text-center">Estado</th>
                      <th className="py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.slice(0, 5).map((res) => (
                      <tr key={res.id} className="border-b border-white/5 text-gray-300 hover:bg-white/5 transition-colors">
                        <td className="py-4 pr-4 font-semibold text-white">{res.customer_name}</td>
                        <td className="py-4 pr-4 font-sans text-xs">{res.reservation_date} • {res.reservation_time}</td>
                        <td className="py-4 pr-4 text-center font-bold text-white">{res.num_people}</td>
                        <td className="py-4 pr-4 text-xs italic max-w-xs truncate text-gray-500">{res.comments || 'Sin comentarios'}</td>
                        <td className="py-4 pr-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                            res.status === 'pending' ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20' :
                            res.status === 'confirmed' ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/20' :
                            'bg-red-950/20 text-red-400 border border-red-500/20'
                          }`}>
                            {res.status === 'pending' ? 'Pendiente' : res.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {res.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateReservationStatus(res.id!, 'confirmed')}
                                  className="p-1 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                                  title="Confirmar"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateReservationStatus(res.id!, 'cancelled')}
                                  className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reservations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-500 text-xs">No hay reservas cargadas en el sistema.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG (CRUD TABLE) */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Bar with add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-wide text-white">Catálogo de Productos</h1>
                <p className="text-gray-400 text-xs mt-1">Crea, edita o elimina platos, bebidas y promociones de tu menú digital.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProductFormError('');
                  setProductForm({
                    name: '',
                    description: '',
                    price: 0,
                    original_price: '',
                    category_id: localCategories[0]?.id || '',
                    image_url: '',
                    tags: '',
                    is_available: true,
                    is_promotion: false
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-5 py-3 rounded-full bg-[#FBBF24] hover:bg-amber-400 text-black font-black shadow-md font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:shadow-lg hover:scale-103 transition-all duration-300 touch-manipulation active:scale-95 cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Agregar Producto
              </button>
            </div>

            {/* Products Table Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 font-sans uppercase tracking-widest text-[10px]">
                      <th className="py-3 pr-4">Imagen</th>
                      <th className="py-3 pr-4">Nombre</th>
                      <th className="py-3 pr-4">Categoría</th>
                      <th className="py-3 pr-4">Precio</th>
                      <th className="py-3 pr-4 text-center">Disponible</th>
                      <th className="py-3 pr-4 text-center">Promoción</th>
                      <th className="py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localProducts.map((prod) => (
                      <tr key={prod.id} className="border-b border-white/5 text-gray-300 hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4">
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover border border-white/5 shadow"
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-white leading-snug">{prod.name}</div>
                          <div className="text-[10px] text-gray-500 max-w-xs truncate">{prod.description}</div>
                        </td>
                        <td className="py-3 pr-4 text-xs font-sans tracking-wide">
                          {localCategories.find(c => c.id === prod.category_id)?.name || 'Otros'}
                        </td>
                        <td className="py-3 pr-4 font-sans font-semibold text-[#FBBF24]">
                          {formatCOP(prod.price)}
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(prod)}
                            className={`inline-block px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold cursor-pointer transition-all touch-manipulation active:scale-95 ${
                              prod.is_available 
                                ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/20' 
                                : 'bg-red-950/20 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {prod.is_available ? 'Disponible' : 'Agotado'}
                          </button>
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-semibold border ${
                            prod.is_promotion 
                              ? 'bg-amber-600/20 text-amber-500 border-amber-500/20' 
                              : 'bg-transparent text-gray-600 border-gray-800'
                          }`}>
                            {prod.is_promotion ? 'SÍ' : 'NO'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => handleEditProduct(prod)}
                              className="p-2.5 rounded-lg text-gray-400 hover:text-[#FBBF24] hover:bg-white/5 transition-all touch-manipulation active:scale-90 cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="w-4.5 h-4.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white/5 transition-all touch-manipulation active:scale-90 cursor-pointer"
                              title="Borrar"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PRODUCT EDIT/CREATE DIALOG MODAL */}
            {isProductModalOpen && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
                <div className="w-full max-w-xl p-5 sm:p-8 rounded-2xl bg-[#0E172A] border border-[#FBBF24]/20 shadow-2xl relative max-h-[90dvh] overflow-y-auto overscroll-contain my-auto">
                  
                  {/* Modal Header with Title & Close button */}
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
                    <h3 className="font-display text-white text-lg sm:text-xl font-bold tracking-wide">
                      {editingProduct ? 'Editar Platillo / Bebida' : 'Agregar Platillo / Bebida'}
                    </h3>
                    <button
                      type="button"
                      disabled={productSubmitting}
                      onClick={() => {
                        setIsProductModalOpen(false);
                        setProductFormError('');
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors touch-manipulation cursor-pointer"
                      aria-label="Cerrar modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Inline Form Error Notification */}
                  {productFormError && (
                    <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-sans flex items-center gap-2.5 animate-fade-in">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-400" />
                      <span>{productFormError}</span>
                    </div>
                  )}

                  <form onSubmit={handleProductSubmit} className="space-y-4 text-sm">
                    {/* Nombre */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej. Hamburguesa Doble Queso BBQ"
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                      />
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Descripción Detallada
                      </label>
                      <textarea
                        rows={2}
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Ingredientes, preparación y detalles especiales..."
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2 text-white focus:outline-none text-base sm:text-sm resize-none"
                      />
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Categoría *
                      </label>
                      <select
                        value={productForm.category_id}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer text-base sm:text-sm"
                      >
                        {localCategories.map(c => (
                          <option key={c.id} value={c.id} className="bg-[#0E172A] text-white">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Precios Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                          Precio Venta (COP) *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="Ej. 28000"
                          value={productForm.price === 0 ? '' : productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value === '' ? 0 : Number(e.target.value) }))}
                          className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                          Precio Original (Opcional para ofertas)
                        </label>
                        <input
                          type="number"
                          value={productForm.original_price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, original_price: e.target.value }))}
                          placeholder="Ej. 35000"
                          className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Imagen URL */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        URL de Imagen del Producto
                      </label>
                      <input
                        type="text"
                        value={productForm.image_url}
                        onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                      />
                    </div>

                    {/* Etiquetas */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Etiquetas/Tags (Separados por coma)
                      </label>
                      <input
                        type="text"
                        value={productForm.tags}
                        onChange={(e) => setProductForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="Ej. Vegano, Popular, Picante"
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                      />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-6 border-t border-white/5 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={productForm.is_available}
                          onChange={(e) => setProductForm(prev => ({ ...prev, is_available: e.target.checked }))}
                          className="w-4 h-4 rounded text-[#FBBF24] focus:ring-gold bg-black border-white/10"
                        />
                        <span className="text-xs text-gray-300 font-semibold uppercase">Disponible</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={productForm.is_promotion}
                          onChange={(e) => setProductForm(prev => ({ ...prev, is_promotion: e.target.checked }))}
                          className="w-4 h-4 rounded text-[#FBBF24] focus:ring-gold bg-black border-white/10"
                        />
                        <span className="text-xs text-gray-300 font-semibold uppercase">Promoción/Oferta</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        disabled={productSubmitting}
                        onClick={() => {
                          setIsProductModalOpen(false);
                          setProductFormError('');
                        }}
                        className="px-5 py-3 rounded-full border border-white/10 hover:border-white text-xs font-sans uppercase tracking-widest transition-all touch-manipulation active:scale-95 min-h-[44px]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={productSubmitting}
                        className="px-6 py-3 rounded-full bg-[#FBBF24] hover:bg-amber-400 text-black font-black shadow-md font-display text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 touch-manipulation active:scale-95 disabled:opacity-60 cursor-pointer min-h-[44px]"
                      >
                        {productSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <span>{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: CATEGORIES CRUD */}
        {activeTab === 'categories' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Bar with add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-wide text-white">Categorías del Menú</h1>
                <p className="text-gray-400 text-xs mt-1">Administra las agrupaciones de productos del menú digital (ej. Bebidas, Entradas).</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryFormError('');
                  setCategoryForm({ name: '', slug: '', order_index: localCategories.length + 1 });
                  setIsCategoryModalOpen(true);
                }}
                className="px-5 py-3 rounded-full bg-[#FBBF24] hover:bg-amber-400 text-black font-black shadow-md font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:shadow-lg hover:scale-103 transition-all duration-300 touch-manipulation active:scale-95 cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Agregar Categoría
              </button>
            </div>

            {/* Categories list card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 shadow-xl max-w-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 font-sans uppercase tracking-widest text-[10px]">
                      <th className="py-3 pr-4">Orden</th>
                      <th className="py-3 pr-4">Nombre</th>
                      <th className="py-3 pr-4">Filtro / Slug</th>
                      <th className="py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localCategories.map((cat) => (
                      <tr key={cat.id} className="border-b border-white/5 text-gray-300 hover:bg-white/5 transition-colors">
                        <td className="py-4 pr-4 font-sans text-[#FBBF24] font-bold">{cat.order_index}</td>
                        <td className="py-4 pr-4 font-semibold text-white">{cat.name}</td>
                        <td className="py-4 pr-4 font-sans text-xs text-gray-500">{cat.slug}</td>
                        <td className="py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => handleEditCategory(cat)}
                              className="p-2.5 rounded-lg text-gray-400 hover:text-[#FBBF24] hover:bg-white/5 transition-colors touch-manipulation active:scale-90 cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="w-4.5 h-4.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white/5 transition-colors touch-manipulation active:scale-90 cursor-pointer"
                              title="Borrar"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY DIALOG FORM MODAL */}
            {isCategoryModalOpen && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
                <div className="w-full max-w-md p-5 sm:p-8 rounded-2xl bg-[#0E172A] border border-[#FBBF24]/20 shadow-2xl relative max-h-[90dvh] overflow-y-auto overscroll-contain my-auto">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
                    <h3 className="font-display text-white text-lg sm:text-xl font-bold tracking-wide">
                      {editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
                    </h3>
                    <button
                      type="button"
                      disabled={categorySubmitting}
                      onClick={() => {
                        setIsCategoryModalOpen(false);
                        setCategoryFormError('');
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors touch-manipulation cursor-pointer"
                      aria-label="Cerrar modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Inline Error Notification */}
                  {categoryFormError && (
                    <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-sans flex items-center gap-2.5 animate-fade-in">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-400" />
                      <span>{categoryFormError}</span>
                    </div>
                  )}

                  <form onSubmit={handleCategorySubmit} className="space-y-4 text-sm">
                    {/* Nombre */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Nombre de Categoría *
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryForm.name}
                        onChange={(e) => {
                          const n = e.target.value;
                          setCategoryForm(prev => ({
                            ...prev,
                            name: n,
                            slug: n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                          }));
                        }}
                        placeholder="Ej. Entradas Gourmet"
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Slug del Filtro (Automático)
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="ej-entradas-gourmet"
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-gray-400 text-base sm:text-sm"
                      />
                    </div>

                    {/* Orden Index */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Orden de Visualización
                      </label>
                      <input
                        type="number"
                        value={categoryForm.order_index}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, order_index: Number(e.target.value) }))}
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        disabled={categorySubmitting}
                        onClick={() => {
                          setIsCategoryModalOpen(false);
                          setCategoryFormError('');
                        }}
                        className="px-5 py-3 rounded-full border border-white/10 hover:border-white text-xs font-sans uppercase tracking-widest transition-all touch-manipulation active:scale-95 min-h-[44px]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={categorySubmitting}
                        className="px-6 py-3 rounded-full bg-[#FBBF24] hover:bg-amber-400 text-black font-black shadow-md font-display text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 touch-manipulation active:scale-95 disabled:opacity-60 cursor-pointer min-h-[44px]"
                      >
                        {categorySubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <span>{editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: RESERVATIONS FULL LEDGER */}
        {activeTab === 'reservations' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-wide text-white">Historial de Reservas</h1>
              <p className="text-gray-400 text-xs mt-1">Monitorea las solicitudes de mesa, confirma estados y haz control de aforo.</p>
            </div>

            {/* List */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 shadow-xl">
              {resLoading ? (
                <div className="text-center py-20">
                  <div className="loader-spinner mx-auto mb-4"></div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-sans">Sincronizando Reservas...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-500 font-sans uppercase tracking-widest text-[10px]">
                        <th className="py-3 pr-4">Cliente</th>
                        <th className="py-3 pr-4">Celular</th>
                        <th className="py-3 pr-4">Fecha de Cita</th>
                        <th className="py-3 pr-4">Hora</th>
                        <th className="py-3 pr-4 text-center">Personas</th>
                        <th className="py-3 pr-4">Requerimientos</th>
                        <th className="py-3 pr-4 text-center">Estado</th>
                        <th className="py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((res) => (
                        <tr key={res.id} className="border-b border-white/5 text-gray-300 hover:bg-white/5 transition-colors">
                          <td className="py-4 pr-4 font-semibold text-white">{res.customer_name}</td>
                          <td className="py-4 pr-4 font-sans text-xs">
                            <a href={`https://wa.me/${res.customer_phone.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline flex items-center gap-1 font-semibold">
                              <Phone className="w-3 h-3" />
                              {res.customer_phone}
                            </a>
                          </td>
                          <td className="py-4 pr-4 font-sans text-xs">{res.reservation_date}</td>
                          <td className="py-4 pr-4 font-sans text-xs font-bold text-white">{res.reservation_time}</td>
                          <td className="py-4 pr-4 text-center font-bold text-white">{res.num_people}</td>
                          <td className="py-4 pr-4 text-xs italic max-w-xs truncate text-gray-500" title={res.comments || ''}>
                            {res.comments || 'Ninguno'}
                          </td>
                          <td className="py-4 pr-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                              res.status === 'pending' ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20' :
                              res.status === 'confirmed' ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/20' :
                              'bg-red-950/20 text-red-400 border border-red-500/20'
                            }`}>
                              {res.status === 'pending' ? 'Pendiente' : res.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {res.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateReservationStatus(res.id!, 'confirmed')}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600/10 text-emerald-500 border border-emerald-500/10 hover:bg-emerald-500 hover:text-black font-sans text-[10px] uppercase font-bold tracking-wider transition-all"
                                  >
                                    Aprobar
                                  </button>
                                  <button
                                    onClick={() => updateReservationStatus(res.id!, 'cancelled')}
                                    className="px-3 py-1.5 rounded-lg bg-red-950/20 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-black font-sans text-[10px] uppercase font-bold tracking-wider transition-all"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {reservations.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center py-10 text-gray-500 text-xs">No hay reservas cargadas en el sistema.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: EVENTS AND EXPERIENCES */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-wide text-white">Eventos & Experiencias</h1>
                <p className="text-gray-400 text-xs mt-1">Administra las cenas especiales, shows en vivo y catas programadas en tu local.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setEventFormError('');
                  setEventForm({
                    title: '',
                    description: '',
                    event_date: '',
                    image_url: '',
                    is_active: true
                  });
                  setIsEventModalOpen(true);
                }}
                className="px-5 py-3 rounded-full bg-[#FBBF24] hover:bg-amber-400 text-black font-black shadow-md font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:shadow-lg hover:scale-103 transition-all duration-300 touch-manipulation active:scale-95 cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Agregar Evento
              </button>
            </div>

            {/* List */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 font-sans uppercase tracking-widest text-[10px]">
                      <th className="py-3 pr-4">Imagen</th>
                      <th className="py-3 pr-4">Título del Evento</th>
                      <th className="py-3 pr-4">Fecha y Hora</th>
                      <th className="py-3 pr-4">Descripción</th>
                      <th className="py-3 pr-4 text-center">Estado</th>
                      <th className="py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localEvents.map((evt) => (
                      <tr key={evt.id} className="border-b border-white/5 text-gray-300 hover:bg-white/5 transition-colors">
                        <td className="py-4 pr-4">
                          <img
                            src={evt.image_url}
                            alt={evt.title}
                            className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                        </td>
                        <td className="py-4 pr-4 font-semibold text-white">{evt.title}</td>
                        <td className="py-4 pr-4 font-sans text-xs text-[#FBBF24]">
                          {new Date(evt.event_date).toLocaleString('es-ES', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </td>
                        <td className="py-4 pr-4 text-xs text-gray-400 max-w-xs truncate" title={evt.description}>
                          {evt.description}
                        </td>
                        <td className="py-4 pr-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleEventActive(evt)}
                            className={`inline-block px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold cursor-pointer transition-all touch-manipulation active:scale-95 ${
                              evt.is_active 
                                ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/20' 
                                : 'bg-gray-800 text-gray-400 border border-gray-700'
                            }`}
                          >
                            {evt.is_active ? 'Publicado' : 'Oculto'}
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => handleEditEvent(evt)}
                              className="p-2.5 rounded-lg text-gray-400 hover:text-[#FBBF24] hover:bg-white/5 transition-colors touch-manipulation active:scale-90 cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="p-2.5 rounded-lg bg-red-950/10 border border-red-500/10 hover:bg-red-500 hover:text-black text-red-400 transition-all touch-manipulation active:scale-90 cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {localEvents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-500 text-xs">No hay eventos creados. Crea tu primer evento especial.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Event Form Modal */}
            {isEventModalOpen && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
                <div className="w-full max-w-lg bg-[#0E172A] border border-[#FBBF24]/20 rounded-2xl p-5 sm:p-8 shadow-2xl relative max-h-[90dvh] overflow-y-auto overscroll-contain my-auto">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
                    <h3 className="font-display text-white text-lg sm:text-xl font-bold tracking-wide uppercase">
                      {editingEvent ? 'Editar Evento' : 'Agregar Evento'}
                    </h3>
                    <button
                      type="button"
                      disabled={eventSubmitting}
                      onClick={() => {
                        setIsEventModalOpen(false);
                        setEventFormError('');
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors touch-manipulation cursor-pointer"
                      aria-label="Cerrar modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Inline Error Notification */}
                  {eventFormError && (
                    <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-sans flex items-center gap-2.5 animate-fade-in">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-400" />
                      <span>{eventFormError}</span>
                    </div>
                  )}

                  <form onSubmit={handleEventSubmit} className="space-y-4 text-sm">
                    {/* Title */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Título del Evento *
                      </label>
                      <input
                        type="text"
                        required
                        value={eventForm.title}
                        onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ej. Noche de Saxofón & Jazz"
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                      />
                    </div>

                    {/* Date and Time */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Fecha y Hora *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={eventForm.event_date}
                        onChange={(e) => setEventForm(prev => ({ ...prev, event_date: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        URL de la Imagen Promocional
                      </label>
                      <input
                        type="text"
                        value={eventForm.image_url}
                        onChange={(e) => setEventForm(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-base sm:text-sm"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Descripción del Evento
                      </label>
                      <textarea
                        rows={3}
                        value={eventForm.description}
                        onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Cuéntales a tus clientes de qué se tratará la velada..."
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2 text-white focus:outline-none text-base sm:text-sm resize-none"
                      />
                    </div>

                    {/* Is Active Toggle */}
                    <div className="flex items-center gap-3">
                      <input
                        id="event-active-check"
                        type="checkbox"
                        checked={eventForm.is_active}
                        onChange={(e) => setEventForm(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="w-4 h-4 accent-gold bg-black/40 border-white/10 rounded cursor-pointer touch-manipulation"
                      />
                      <label htmlFor="event-active-check" className="text-gray-300 text-xs font-medium cursor-pointer select-none">
                        Publicar evento inmediatamente (Visible en la Landing)
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        disabled={eventSubmitting}
                        onClick={() => {
                          setIsEventModalOpen(false);
                          setEventFormError('');
                        }}
                        className="px-5 py-3 rounded-full border border-white/10 hover:border-white text-xs font-sans uppercase tracking-widest transition-all touch-manipulation active:scale-95 min-h-[44px]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={eventSubmitting}
                        className="px-6 py-3 rounded-full bg-[#FBBF24] hover:bg-amber-400 text-black font-black shadow-md font-display text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 touch-manipulation active:scale-95 disabled:opacity-60 cursor-pointer min-h-[44px]"
                      >
                        {eventSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <span>{editingEvent ? 'Guardar Cambios' : 'Crear Evento'}</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: RECYCLE BIN (PAPELERA) */}
        {activeTab === 'recycle' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-wide text-white">Papelera de Reciclaje</h1>
                <p className="text-gray-400 text-xs mt-1">
                  Recupera productos y eventos eliminados. Los elementos permanecen aquí por un período máximo de 30 días antes de su eliminación permanente automática.
                </p>
              </div>
              {(deletedProducts.length > 0 || deletedEvents.length > 0) && (
                <button
                  onClick={handleEmptyTrash}
                  className="px-5 py-3 rounded-full bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-black font-display text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Vaciar Papelera
                </button>
              )}
            </div>

            {/* Content Container */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 shadow-xl space-y-8">
              {deletedProducts.length === 0 && deletedEvents.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="font-display text-white text-base font-bold mb-1">La papelera está vacía</h3>
                  <p className="text-xs">No hay productos o eventos eliminados recientemente.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-500 font-sans uppercase tracking-widest text-[10px]">
                        <th className="py-3 pr-4">Imagen</th>
                        <th className="py-3 pr-4">Nombre / Título</th>
                        <th className="py-3 pr-4">Tipo</th>
                        <th className="py-3 pr-4">Fecha de Eliminación</th>
                        <th className="py-3 pr-4">Retención</th>
                        <th className="py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Deleted Products List */}
                      {deletedProducts.map((prod) => {
                        const daysLeft = getRemainingDays(prod.deleted_at);
                        return (
                          <tr key={prod.id} className="border-b border-white/5 text-gray-300 hover:bg-white/5 transition-colors">
                            <td className="py-3 pr-4">
                              <img
                                src={prod.image_url}
                                alt={prod.name}
                                className="w-12 h-12 rounded-lg object-cover border border-white/5 shadow opacity-60"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <div className="font-semibold text-gray-400 leading-snug line-through">{prod.name}</div>
                              <div className="text-[10px] text-gray-600 max-w-xs truncate">{prod.description}</div>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-semibold bg-blue-950/20 text-blue-400 border border-blue-500/20">
                                Producto
                              </span>
                            </td>
                            <td className="py-3 pr-4 font-sans text-xs text-gray-500">
                              {prod.deleted_at ? new Date(prod.deleted_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              }) : 'Fecha desconocida'}
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                                daysLeft <= 5 
                                  ? 'bg-red-950/40 text-red-400 border border-red-500/30' 
                                  : 'bg-amber-950/30 text-amber-500 border border-amber-500/20'
                              }`}>
                                <AlertTriangle className="w-3 h-3" />
                                {daysLeft <= 1 ? 'Último día' : `Quedan ${daysLeft} días`}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleRestoreProduct(prod)}
                                  className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                                  title="Restaurar Producto"
                                >
                                  <RotateCcw className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={() => handlePermanentDeleteProduct(prod.id)}
                                  className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-black transition-all"
                                  title="Eliminar Definitivamente"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Deleted Events List */}
                      {deletedEvents.map((evt) => {
                        const daysLeft = getRemainingDays(evt.deleted_at);
                        return (
                          <tr key={evt.id} className="border-b border-white/5 text-gray-300 hover:bg-white/5 transition-colors">
                            <td className="py-3 pr-4">
                              <img
                                src={evt.image_url}
                                alt={evt.title}
                                className="w-12 h-12 rounded-lg object-cover border border-white/5 shadow opacity-60"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <div className="font-semibold text-gray-400 leading-snug line-through">{evt.title}</div>
                              <div className="text-[10px] text-gray-600 max-w-xs truncate">{evt.description}</div>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-semibold bg-purple-950/20 text-purple-400 border border-purple-500/20">
                                Evento
                              </span>
                            </td>
                            <td className="py-3 pr-4 font-sans text-xs text-gray-500">
                              {evt.deleted_at ? new Date(evt.deleted_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              }) : 'Fecha desconocida'}
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                                daysLeft <= 5 
                                  ? 'bg-red-950/40 text-red-400 border border-red-500/30' 
                                  : 'bg-amber-950/30 text-amber-500 border border-amber-500/20'
                              }`}>
                                <AlertTriangle className="w-3 h-3" />
                                {daysLeft <= 1 ? 'Último día' : `Quedan ${daysLeft} días`}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleRestoreEvent(evt)}
                                  className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                                  title="Restaurar Evento"
                                >
                                  <RotateCcw className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={() => handlePermanentDeleteEvent(evt.id)}
                                  className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-black transition-all"
                                  title="Eliminar Definitivamente"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: BUSINESS PROFILE SETTINGS */}
        {activeTab === 'settings' && settingsForm && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-wide text-white">Configuración del Negocio</h1>
              <p className="text-gray-400 text-xs mt-1">Personaliza el nombre, logo, eslogan, contacto y dirección. Cambios en tiempo real.</p>
            </div>

            {settingsSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex gap-3 text-emerald-400 text-sm items-center animate-fade-in">
                <Check className="w-5 h-5" />
                <span>¡Perfil del negocio actualizado correctamente en la base de datos!</span>
              </div>
            )}

            <form onSubmit={handleSettingsSubmit} className="space-y-6 bg-white/5 border border-white/5 p-6 sm:p-8 rounded-2xl shadow-xl">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                
                {/* Nombre Comercial */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    Nombre Comercial *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.name}
                    onChange={(e) => handleSettingsFieldChange('name', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>

                {/* Eslogan */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    Eslogan Comercial
                  </label>
                  <input
                    type="text"
                    value={settingsForm.slogan}
                    onChange={(e) => handleSettingsFieldChange('slogan', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    Número de WhatsApp * (Con código de país, ej. +573001234567)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsapp_number}
                    onChange={(e) => handleSettingsFieldChange('whatsapp_number', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    URL del Logo del Negocio
                  </label>
                  <input
                    type="text"
                    value={settingsForm.logo_url}
                    onChange={(e) => handleSettingsFieldChange('logo_url', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>

                {/* Dirección Física */}
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    Dirección Física *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.address}
                    onChange={(e) => handleSettingsFieldChange('address', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>

                {/* Google Maps Embed Link */}
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    Google Maps Iframe src URL (Solo la URL del atributo src)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.google_maps_embed}
                    onChange={(e) => handleSettingsFieldChange('google_maps_embed', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>

                {/* Nosotros Historia */}
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    Historia / Sección Nosotros
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.about_text}
                    onChange={(e) => handleSettingsFieldChange('about_text', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none resize-none"
                  />
                </div>

              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
                {isMock && (
                  <button
                    type="button"
                    onClick={() => {
                      requestConfirm(
                        '¿Restablecer datos de prueba?',
                        'Esta acción volverá a cargar todos los productos, categorías y eventos originales de la demostración.',
                        () => {
                          resetDemoData();
                          showToast('Demostración Restablecida', 'Los datos iniciales de prueba han sido restaurados con éxito.', 'success');
                        },
                        { confirmText: 'Restablecer Todo', isDanger: false }
                      );
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold uppercase tracking-wider transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer min-h-[44px]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restablecer Datos Demo
                  </button>
                )}
                <button
                  type="submit"
                  disabled={settingsSubmitting}
                  className="px-8 py-4 rounded-full bg-[#FBBF24] hover:bg-amber-400 text-black font-black shadow-md font-display text-xs uppercase tracking-widest font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300 sm:ml-auto touch-manipulation active:scale-95 disabled:opacity-60 cursor-pointer min-h-[44px] flex items-center gap-2"
                >
                  {settingsSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Cambios del Perfil</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* Custom Global Action Confirmation Modal (Mobile friendly) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0E172A] border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                confirmModal.isDanger ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-display text-white text-base sm:text-lg font-bold">
                {confirmModal.title}
              </h3>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              {confirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs uppercase tracking-wider font-semibold text-gray-300 hover:text-white transition-all touch-manipulation active:scale-95 min-h-[40px]"
              >
                {confirmModal.cancelText || 'Cancelar'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  await action();
                }}
                className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md transition-all touch-manipulation active:scale-95 cursor-pointer min-h-[40px] ${
                  confirmModal.isDanger 
                    ? 'bg-red-600 hover:bg-red-500 text-white' 
                    : 'bg-[#FBBF24] hover:bg-amber-400 text-black'
                }`}
              >
                {confirmModal.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Floating Toast / Action Confirmation Panel */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[110] animate-slide-down">
          <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3.5 ${
            toast.type === 'success'
              ? 'bg-[#0E172A]/95 border-emerald-500/40 text-white shadow-emerald-950/40'
              : toast.type === 'error'
              ? 'bg-[#0E172A]/95 border-red-500/40 text-white shadow-red-950/40'
              : 'bg-[#0E172A]/95 border-[#FBBF24]/40 text-white shadow-amber-950/40'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              toast.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : toast.type === 'error'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/30'
            }`}>
              {toast.type === 'success' && <CheckCircle2 className="w-4.5 h-4.5" />}
              {toast.type === 'error' && <AlertCircle className="w-4.5 h-4.5" />}
              {toast.type === 'info' && <Info className="w-4.5 h-4.5" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-display text-xs sm:text-sm font-bold text-white tracking-wide">
                {toast.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5 leading-relaxed font-sans">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 touch-manipulation cursor-pointer"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
