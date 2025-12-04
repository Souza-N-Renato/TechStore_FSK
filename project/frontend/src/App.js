import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- 1. CONFIGURAÇÃO DA API (Axios) ---
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// --- 2. DADOS MOCK ---
const MOCK_PRODUCTS = [
  { _id: "1", name: "Estudante Essencial", category: "Estudante", price: 2200.00, cpu: "AMD Ryzen 3 3200G", ram: "8GB DDR4", storage: "SSD NVMe 256GB", description: "Eficiência energética e baixo custo." },
  { _id: "2", name: "Terminal de Vendas", category: "Comércio", price: 2800.00, cpu: "Intel Core i3-12100", ram: "16GB DDR4", storage: "SSD NVMe 512GB", description: "Confiabilidade para sistemas de gestão." },
  { _id: "3", name: "Profissional Gerência", category: "Gerência", price: 4500.00, cpu: "Ryzen 5 5600X", ram: "32GB DDR4", storage: "SSD NVMe 1TB", description: "Para análise de dados e multitarefas." },
  { _id: "4", name: "Científico Essencial", category: "Científico", price: 5800.00, cpu: "Ryzen 5 5600X", ram: "32GB DDR4", storage: "SSD NVMe 1TB", description: "Com GPU dedicada para aceleração." },
  { _id: "5", name: "Gamer Especial", category: "Gamer", price: 7500.00, cpu: "Ryzen 5 5700X", ram: "16GB DDR4", storage: "SSD NVMe 1TB", description: "Focado em 1440p com alto desempenho." },
  { _id: "6", name: "Gamer Pro", category: "Gamer", price: 15000.00, cpu: "Ryzen 7 7700X", ram: "32GB DDR5", storage: "SSD NVMe 2TB", description: "Para 4K, Streaming e performance máxima." }
];

// --- PALETA DE CORES NOVA (DARK NEON GAMER) ---
const colors = {
  primary: '#7c3aed', // Roxo Violeta Sóbrio (Moderno e Profissional)
  primaryHover: '#6d28d9', // Roxo um pouco mais escuro para hover
  secondary: '#1e1b4b', // Índigo muito escuro
  background: '#121212', // Cinza Quase Preto (Padrão Dark Mode)
  cardBackground: '#1e1e1e', // Cinza ligeiramente mais claro
  textLight: '#f3f4f6', // Branco suave (não cansa a vista)
  textGray: '#9ca3af', // Cinza médio para descrições
  success: '#10b981', // Verde Esmeralda (Fosco)
  error: '#ef4444', // Vermelho Fosco
  borderColor: '#2e2e2e' // Bordas discretas
};
//
// --- 3. COMPONENTES INTERNOS ---

  // === ProductCard ===
const ProductCard = ({ product, onAdd }) => {
  const getCategoryColor = (category) => ({ 
    'Gamer': colors.primary, 
    'Estudante': '#eab308', // Amarelo Ouro Fosco
    'Comércio': '#f97316', // Laranja Fosco
    'Gerência': '#64748b', // Azul Acinzentado
    'Científico': '#06b6d4' // Ciano Fosco
  }[category] || '#9ca3af');

  return (
    <div style={pcStyles.card}>
      <span style={{ ...pcStyles.badge, backgroundColor: getCategoryColor(product.category), boxShadow: `0 0 10px ${getCategoryColor(product.category)}` }}>
        {product.category}
      </span>
      <h3 style={pcStyles.title}>{product.name}</h3>
      <p style={pcStyles.desc}>{product.description}</p>
      <div style={pcStyles.specs}>
        <div>🧠 <strong>CPU:</strong> {product.cpu}</div>
        <div>💾 <strong>RAM:</strong> {product.ram}</div>
      </div>
      <div style={pcStyles.footer}>
        <span style={pcStyles.price}>
          R$ {parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
        <button onClick={() => onAdd(product)} style={pcStyles.btn}>+ Carrinho</button>
      </div>
    </div>
  );
};

const pcStyles = {
  card: { backgroundColor: colors.cardBackground, color: colors.textLight, borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative', border: `1px solid ${colors.borderColor}` },
  badge: { position: 'absolute', top: '15px', right: '15px', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' },
  title: { margin: '25px 0 10px 0', color: colors.textLight, fontSize: '1.1rem' },
  desc: { fontSize: '0.85rem', color: colors.textGray },
  specs: { backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '8px', margin: '15px 0', fontSize: '0.8rem', color: colors.textLight },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' },
  price: { fontSize: '1.2rem', fontWeight: '800', color: colors.success, textShadow: `0 0 5px ${colors.success}44` },
  btn: { padding: '10px 15px', backgroundColor: colors.primary, color: colors.textLight, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', boxShadow: `0 0 10px ${colors.primary}66` }
};

// === Cart ===
const Cart = ({ cart, user, onUpdateQty, onCheckout, checkoutMsg }) => {
  const calculateTotal = () => cart.reduce((total, item) => total + (parseFloat(item.price) * item.qty), 0);

  return (
    <div style={cartStyles.container}>
      <h2 style={cartStyles.header}>🛒 Seu Pedido</h2>
      
      {checkoutMsg && (
        <div style={cartStyles.successMsg}>
          {checkoutMsg}
        </div>
      )}

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: colors.textGray }}>
          <p>Seu carrinho está vazio.</p>
        </div>
      ) : (
        <>
          <div style={cartStyles.list}>
            {cart.map(item => (
              <div key={item._id} style={cartStyles.item}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{item.name}</strong>
                  <small style={{color: colors.success}}>R$ {item.price.toLocaleString('pt-BR')}</small>
                </div>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <button onClick={() => onUpdateQty(item._id, item.qty - 1)} style={cartStyles.miniBtn}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => onUpdateQty(item._id, item.qty + 1)} style={cartStyles.miniBtn}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={cartStyles.footer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.1rem' }}>
              <strong>Total:</strong>
              <strong style={{ color: colors.success, textShadow: `0 0 5px ${colors.success}` }}>R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            </div>
            {user ? (
              <button onClick={onCheckout} style={cartStyles.checkoutBtn}>Finalizar Compra</button>
            ) : (
              <div style={cartStyles.warning}>Faça login para finalizar.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const cartStyles = {
  container: { backgroundColor: colors.cardBackground, color: colors.textLight, padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'sticky', top: '20px', border: `1px solid ${colors.borderColor}` },
  header: { marginTop: 0, color: colors.primary, borderBottom: `1px solid ${colors.borderColor}`, paddingBottom: '15px', fontSize: '1.3rem', textShadow: `0 0 10px ${colors.primary}44` },
  list: { maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' },
  item: { borderBottom: `1px solid ${colors.borderColor}`, padding: '15px 0', display: 'flex', justifyContent: 'space-between' },
  miniBtn: { width: '24px', height: '24px', borderRadius: '4px', border: `1px solid ${colors.borderColor}`, backgroundColor: '#333', color: colors.textLight, cursor: 'pointer' },
  footer: { borderTop: `2px solid ${colors.borderColor}`, paddingTop: '20px', marginTop: '20px' },
  checkoutBtn: { width: '100%', padding: '10px', backgroundColor: colors.primary, color: colors.textLight, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', boxShadow: `0 0 15px ${colors.primary}66` },
  warning: { fontSize: '0.9rem', textAlign: 'center', backgroundColor: '#ffb74d', padding: '10px', borderRadius: '6px', color: colors.background, fontWeight: 'bold' },
  successMsg: { marginBottom: '15px', padding: '10px', backgroundColor: `${colors.success}22`, color: colors.success, border: `1px solid ${colors.success}`, borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }
};

// === AuthForm ===
const AuthForm = ({ user, onLoginSuccess, onLogout }) => {
  const [authMode, setAuthMode] = useState('login'); 
  const [authMsg, setAuthMsg] = useState({ type: '', text: '' }); 
  const [formData, setFormData] = useState({ name: '', password: '', document: '', address: '', card: '' });

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await api.post('/login', { name: formData.name, password: formData.password });
      onLoginSuccess(res.data.user); 
      setAuthMsg({ type: '', text: '' });
      setFormData({ name: '', password: '', document: '', address: '', card: '' });
    } catch (err) {
      setAuthMsg({ type: 'error', text: 'Nome ou senha incorretos.' });
    }
  };

  const handleRegister = async () => {
    if (formData.password.length < 6) return setAuthMsg({ type: 'error', text: 'Senha curta demais.' });
    
    try {
      await api.post('/register', formData);
      setAuthMsg({ type: 'success', text: 'Cadastro realizado! Faça login.' });
      setAuthMode('login');
      setFormData({ name: '', password: '', document: '', address: '', card: '' });
    } catch (err) {
      setAuthMsg({ type: 'error', text: err.response?.data?.error || 'Erro no cadastro.' });
    }
  };

  if (user) {
    return (
      <div style={authStyles.container}>
        <h2 style={authStyles.title}>🔐 Área do Cliente</h2>
        <div style={{textAlign: 'center'}}>
          <p>Olá, <strong>{user.name}</strong>!</p>
          <button onClick={onLogout} style={{...authStyles.btn, backgroundColor: colors.error, boxShadow: `0 0 10px ${colors.error}66`}}>Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div style={authStyles.container}>
      <h2 style={authStyles.title}>🔐 Área do Cliente</h2>
      
      {authMsg.text && (
        <div style={{ ...authStyles.msg, backgroundColor: authMsg.type === 'error' ? `${colors.error}22` : `${colors.success}22`, color: authMsg.type === 'error' ? colors.error : colors.success, border: `1px solid ${authMsg.type === 'error' ? colors.error : colors.success}` }}>
          {authMsg.text}
        </div>
      )}

      {authMode === 'login' ? (
        <>
          <input name="name" placeholder="Nome" value={formData.name} onChange={handleInput} style={authStyles.input} />
          <input name="password" type="password" placeholder="Senha" value={formData.password} onChange={handleInput} style={authStyles.input} />
          <button onClick={handleLogin} style={authStyles.btn}>Entrar</button>
          <div style={authStyles.link} onClick={() => setAuthMode('register')}>Criar conta</div>
        </>
      ) : (
        <>
          <input name="name" placeholder="Nome completo" value={formData.name} onChange={handleInput} style={authStyles.input} />
          <input name="password" type="password" placeholder="Senha" value={formData.password} onChange={handleInput} style={authStyles.input} />
          <input name="document" placeholder="Documento (CPF)" value={formData.document} onChange={handleInput} style={authStyles.input} />
          <input name="address" placeholder="Endereço" value={formData.address} onChange={handleInput} style={authStyles.input} />
          <input name="card" placeholder="Cartão" value={formData.card} onChange={handleInput} style={authStyles.input} />
          <button onClick={handleRegister} style={{...authStyles.btn, backgroundColor: colors.success, boxShadow: `0 0 10px ${colors.success}66`}}>Cadastrar</button>
          <div style={authStyles.link} onClick={() => setAuthMode('login')}>Voltar para Login</div>
        </>
      )}
    </div>
  );
};

const authStyles = {
  container: { backgroundColor: colors.cardBackground, color: colors.textLight, padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', marginBottom: '20px', borderTop: `3px solid ${colors.primary}`, borderBottom: `1px solid ${colors.borderColor}` },
  title: { marginTop: 0, color: colors.primary, fontSize: '1.3rem', marginBottom: '15px', textShadow: `0 0 10px ${colors.primary}44` },
  input: { width: '100%', padding: '10px', marginBottom: '10px', border: `1px solid ${colors.borderColor}`, borderRadius: '6px', boxSizing: 'border-box', backgroundColor: '#2a2a2a', color: colors.textLight },
  btn: { width: '100%', padding: '10px', backgroundColor: colors.primary, color: colors.textLight, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px', boxShadow: `0 0 10px ${colors.primary}66` },
  msg: { padding: '10px', borderRadius: '6px', marginBottom: '15px' },
  link: { textAlign: 'center', fontSize: '0.9rem', color: colors.primary, cursor: 'pointer', textDecoration: 'underline' }
};

// --- 4. APP PRINCIPAL ---

function App() {
  const [products, setProducts] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [checkoutMsg, setCheckoutMsg] = useState('');
  
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('techstore_cart')) || []);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('techstore_user')) || null);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        setProducts(res.data);
        setBackendStatus('online');
      })
      .catch(() => {
        setProducts(MOCK_PRODUCTS);
        setBackendStatus('offline');
      });
  }, []);

  useEffect(() => localStorage.setItem('techstore_cart', JSON.stringify(cart)), [cart]);

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);
    if (exists) updateQty(product._id, exists.qty + 1);
    else setCart([...cart, { ...product, qty: 1 }]);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) setCart(cart.filter(item => item._id !== id));
    else setCart(cart.map(item => item._id === id ? { ...item, qty } : item));
  };

  // --- LÓGICA DE CHECKOUT CORRIGIDA ---
  const handleCheckout = () => {
    if (!user) return;

    let lastFour = user.card || "XXXX"; 
    
    // Segurança: Se o cartão vier completo ou maior que 4 digitos, limpamos para pegar só o final
    // Isso garante que a string final seja sempre xxxxxxxxxxxx + 4 digitos
    if (lastFour.length > 4) {
      lastFour = lastFour.slice(-4);
    }
    
    // Formata a mensagem com 12 'x' seguidos dos últimos 4 dígitos
    const maskedCard = `xxxxxxxxxxxx${lastFour}`;
    const msg = `Compra efetuada com sucesso no cartão ${maskedCard}`;
    
    setCheckoutMsg(msg);
    setCart([]); // Limpa o carrinho

    // Limpa a mensagem após 5 segundos
    setTimeout(() => setCheckoutMsg(''), 5000);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('techstore_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('techstore_user');
    setCheckoutMsg(''); // Limpa msg se deslogar
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Roboto, Arial, sans-serif', backgroundColor: colors.background, color: colors.textLight, minHeight: '100vh' }}>
      
      {/* HEADER ESCURO */}
      <header style={{ backgroundColor: colors.secondary, background: `linear-gradient(to right, ${colors.secondary}, #000000)`, color: colors.textLight, padding: '20px', boxShadow: `0 4px 15px ${colors.primary}33`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${colors.primary}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', textShadow: `0 0 10px ${colors.primary}` }}>TechStore</h1>
          </div>
          {backendStatus === 'offline' && <span style={{ backgroundColor: colors.error, color: colors.textLight, padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' }}> Modo Offline</span>}
        </div>
      </header>

      {/* BANNER HERO */}
      <div style={{ 
        backgroundImage: `linear-gradient(to bottom, ${colors.secondary}AA, ${colors.background}DD), url('https://pngtree.com/freebackground/computer-of-a-programmer-with-lines-code-of-software_15533605.html')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 20px',
        textAlign: 'left',
        color: colors.textLight,
        boxShadow: `inset 0 0 50px ${colors.background}`,
        borderBottom: `1px solid ${colors.borderColor}`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3.5rem', margin: '0 0 15px 0', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>
            <span style={{ color: colors.primary, textShadow: `0 0 15px ${colors.primary}` }}>Performance</span> para Todos os Perfis
          </h2>
          <p style={{ fontSize: '1.4rem', margin: '0 0 30px 0', maxWidth: '700px', color: colors.textGray }}>
            Do estudante ao gamer profissional, encontre a máquina ideal para o seu objetivo com máxima eficiência.
          </p>
          <button style={{
            padding: '15px 40px', 
            backgroundColor: colors.primary, 
            color: colors.textLight, 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontWeight: '700', 
            fontSize: '1.1rem',
            boxShadow: `0 0 20px ${colors.primary}88`,
            textTransform: 'uppercase'
          }}>
            Escolha seu Setup
          </button>
        </div>
      </div>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap' }}>
        
        {/* Catálogo */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h2 style={{ color: colors.textLight, borderBottom: `2px solid ${colors.primary}`, paddingBottom: '10px', marginTop: 0, textShadow: `0 0 5px ${colors.primary}44` }}>Catálogo para alto desempenho</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </div>

        {/* Barra Lateral */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <AuthForm 
            user={user} 
            onLoginSuccess={handleLoginSuccess} 
            onLogout={handleLogout} 
          />
          <Cart 
            cart={cart} 
            user={user} 
            onUpdateQty={updateQty}
            onCheckout={handleCheckout}
            checkoutMsg={checkoutMsg}
          />
        </div>
      </div>
    </div>
  );
}

export default App;