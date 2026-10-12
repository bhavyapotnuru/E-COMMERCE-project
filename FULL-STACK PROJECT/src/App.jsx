import { useMemo, useState } from 'react'
import './App.css'

const starterProducts = [
  { id: 1, name: 'The Everyday Tote', category: 'Accessories', price: 68, oldPrice: 84, rating: 4.9, reviews: 128, badge: 'Bestseller', color: 'Natural', stock: 18, image: 'photo-1544816155-12df9643f363' },
  { id: 2, name: 'Cloud Knit Sweater', category: 'Clothing', price: 124, rating: 4.8, reviews: 86, badge: 'New', color: 'Oat milk', stock: 12, image: 'photo-1576566588028-4147f3842f27' },
  { id: 3, name: 'Sunday Ceramic Set', category: 'Home', price: 48, rating: 4.9, reviews: 64, badge: '', color: 'Warm white', stock: 24, image: 'photo-1493106641515-6b5631de4bb9' },
  { id: 4, name: 'Studio Running Club', category: 'Clothing', price: 92, rating: 4.7, reviews: 52, badge: 'Almost gone', color: 'Forest', stock: 7, image: 'photo-1529139574466-a303027c1d8b' },
  { id: 5, name: 'Sculpted Glass Vase', category: 'Home', price: 56, rating: 4.8, reviews: 43, badge: '', color: 'Amber', stock: 15, image: 'photo-1578500494198-246f612d3b3d' },
  { id: 6, name: 'Weekend Market Bag', category: 'Accessories', price: 74, rating: 4.9, reviews: 91, badge: '', color: 'Terracotta', stock: 11, image: 'photo-1590874103328-eac38a683ce7' },
  { id: 7, name: 'Soft Form Tee', category: 'Clothing', price: 42, rating: 4.6, reviews: 38, badge: '', color: 'Chalk', stock: 20, image: 'photo-1521572163474-6864f9cf17ab' },
  { id: 8, name: 'Daily Ritual Candle', category: 'Home', price: 36, rating: 5.0, reviews: 76, badge: 'Loved', color: 'Cedar + fig', stock: 29, image: 'photo-1603006905003-be475563bc59' },
]

const imageUrl = (image, width = 700) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`
const money = (amount) => `$${Number(amount).toFixed(2)}`
const readStore = (key, fallback) => {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : fallback
}

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    package: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v9l9 5 9-5V8M12 13v9" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v1" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function App() {
  const [products, setProducts] = useState(() => readStore('atelier-products', starterProducts))
  const [cart, setCart] = useState(() => readStore('atelier-cart', []))
  const [orders, setOrders] = useState(() => readStore('atelier-orders', []))
  const [customers, setCustomers] = useState(() => readStore('atelier-customers', []))
  const [user, setUser] = useState(() => readStore('atelier-user', null))
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [view, setView] = useState('shop')
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [checkoutDone, setCheckoutDone] = useState(false)
  const [toast, setToast] = useState('')
  const [newProductOpen, setNewProductOpen] = useState(false)

  const save = (key, value, setter) => {
    setter(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const query = search.trim().toLowerCase()
      return matchesCategory && (!query || `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query))
    })
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sort === 'top-rated') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [products, category, search, sort])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id)
    if (existing && existing.quantity >= product.stock) return notify('That’s all we have in stock.')
    save('atelier-cart', existing
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }], setCart)
    notify(`${product.name} added to your bag`)
  }

  const updateQuantity = (id, change) => {
    const item = cart.find((entry) => entry.id === id)
    const product = products.find((entry) => entry.id === id)
    if (change > 0 && item.quantity >= (product?.stock ?? item.stock)) return notify('That’s all we have in stock.')
    save('atelier-cart', cart.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity + change } : entry).filter((entry) => entry.quantity > 0), setCart)
  }

  const placeOrder = () => {
    if (!cart.length) return
    const order = {
      id: `AT-${Date.now().toString().slice(-7)}`,
      date: new Date().toISOString(),
      status: 'Processing',
      customer: user?.name || 'Guest',
      email: user?.email || 'Guest checkout',
      total: subtotal,
      items: cart.map(({ id, name, price, quantity, image }) => ({ id, name, price, quantity, image })),
    }
    save('atelier-orders', [order, ...orders], setOrders)
    save('atelier-products', products.map((product) => {
      const ordered = cart.find((item) => item.id === product.id)
      return ordered ? { ...product, stock: Math.max(0, product.stock - ordered.quantity) } : product
    }), setProducts)
    save('atelier-cart', [], setCart)
    setCheckoutDone(true)
    setView('orders')
  }

  const handleAuth = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email')).trim().toLowerCase()
    const name = String(data.get('name') || email.split('@')[0]).trim()
    const nextUser = { name, email }
    const nextCustomers = customers.some((customer) => customer.email === email)
      ? customers
      : [{ ...nextUser, joined: new Date().toISOString(), orders: 0 }, ...customers]
    save('atelier-customers', nextCustomers, setCustomers)
    save('atelier-user', nextUser, setUser)
    setAccountOpen(false)
    notify(`Welcome${authMode === 'register' ? ', ' + name : ' back'}!`)
  }

  const openAdmin = () => {
    save('atelier-user', { name: 'Store Admin', email: 'admin@atelier.demo', role: 'admin' }, setUser)
    setAccountOpen(false)
    setView('admin')
  }

  const removeProduct = (id) => save('atelier-products', products.filter((product) => product.id !== id), setProducts)
  const updateStock = (id, amount) => save('atelier-products', products.map((product) => product.id === id ? { ...product, stock: Math.max(0, Number(amount) || 0) } : product), setProducts)
  const updateOrder = (id, status) => save('atelier-orders', orders.map((order) => order.id === id ? { ...order, status } : order), setOrders)
  const removeCustomer = (email) => save('atelier-customers', customers.filter((customer) => customer.email !== email), setCustomers)

  return (
    <div className="store-shell">
      <div className="announcement">A little something for you — complimentary shipping on orders over $100</div>
      <header className="site-header">
        <a className="wordmark" href="#" onClick={(event) => { event.preventDefault(); setView('shop') }}>atelier<span>.</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={view === 'shop' ? 'nav-link active' : 'nav-link'} onClick={() => setView('shop')}>Shop all</button>
          <button className="nav-link" onClick={() => { setCategory('Home'); setView('shop'); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Home goods</button>
          <button className="nav-link" onClick={() => { setCategory('Clothing'); setView('shop'); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Clothing</button>
          <button className="nav-link" onClick={() => { setCategory('Accessories'); setView('shop'); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Accessories</button>
        </nav>
        <div className="header-actions">
          <label className="search-box"><Icon name="search" size={18} /><input aria-label="Search products" value={search} onChange={(event) => { setSearch(event.target.value); setView('shop') }} placeholder="Search" /></label>
          <button className="icon-button account-button" aria-label="Account" onClick={() => setAccountOpen(true)}><Icon name="user" /><span className="desktop-account">{user ? user.name.split(' ')[0] : 'Account'}</span></button>
          <button className="icon-button bag-button" aria-label={`Shopping bag, ${cartCount} items`} onClick={() => { setCheckoutDone(false); setCartOpen(true) }}><Icon name="bag" /><span>Bag</span><span className="bag-count">{cartCount}</span></button>
        </div>
      </header>

      {view === 'shop' && <>
        <main>
          <section className="hero">
            <img className="hero-image" src={imageUrl('photo-1441986300917-64674bd600d8', 1900)} alt="Sunlit, thoughtfully curated clothing and home goods" />
            <div className="hero-shade" />
            <div className="hero-copy">
              <p className="eyebrow light-eyebrow">THE EVERYDAY EDIT · NO. 04</p>
              <h1>Little things.<br />Better days.</h1>
              <p>Thoughtful finds for your everyday rituals.</p>
              <button className="button button-light" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>Shop the collection <Icon name="arrow" size={17} /></button>
            </div>
            <div className="hero-note"><span>01 / 03</span><span>Made for the in-between moments</span></div>
          </section>

          <section className="promise-row" aria-label="Our promises">
            <div><span className="promise-icon">✳</span><span>Considered by design</span></div>
            <div><span className="promise-icon">↗</span><span>Made to live with</span></div>
            <div><span className="promise-icon">♡</span><span>A little lighter on earth</span></div>
            <div><span className="promise-icon">☼</span><span>Always a good gift</span></div>
          </section>

          <section className="collection section-wrap" id="collection">
            <div className="section-heading">
              <div><p className="eyebrow">GOOD THINGS, GATHERED</p><h2>Find your everyday favorite.</h2><p className="section-subtitle">Useful, lovely, and made to be kept.</p></div>
              <a href="#collection" className="text-link" onClick={() => { setCategory('All'); setSearch('') }}>View all <Icon name="arrow" size={16} /></a>
            </div>
            <div className="shop-controls">
              <div className="category-tabs" aria-label="Filter by category">
                {['All', 'Clothing', 'Home', 'Accessories'].map((item) => <button key={item} className={category === item ? 'category-tab selected' : 'category-tab'} onClick={() => setCategory(item)}>{item}</button>)}
              </div>
              <div className="sort-wrap"><span>{filteredProducts.length} pieces</span><label htmlFor="sort-products">Sort by</label><select id="sort-products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="top-rated">Top rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div>
            </div>
            {filteredProducts.length ? <div className="product-grid">
              {filteredProducts.map((product) => <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img className="product-image" src={imageUrl(product.image)} alt={product.name} loading="lazy" />
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <button className="quick-add" onClick={() => addToCart(product)} disabled={!product.stock}>{product.stock ? 'Add to bag' : 'Sold out'}<Icon name="plus" size={16} /></button>
                </div>
                <div className="product-details"><div><h3>{product.name}</h3><p>{product.color} · {product.category}</p></div><div className="product-price">{product.oldPrice && <del>{money(product.oldPrice)}</del>}{money(product.price)}</div></div>
                <div className="product-rating"><Icon name="star" size={13} /><span>{product.rating}</span><span className="review-count">({product.reviews})</span></div>
              </article>)}
            </div> : <div className="empty-search"><Icon name="search" size={26} /><h3>No little treasures found</h3><p>Try another search or category.</p><button className="text-link" onClick={() => { setSearch(''); setCategory('All') }}>Clear filters <Icon name="arrow" size={16} /></button></div>}
          </section>

          <section className="newsletter">
            <div className="newsletter-copy"><p className="eyebrow">LETTERS FROM ATELIER</p><h2>A little good in your inbox.</h2><p>New things, slow mornings, and 10% off your first order.</p></div>
            <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); notify('You’re on the list — see you in your inbox!') }}><input type="email" required aria-label="Email address for newsletter" placeholder="Your email address" /><button type="submit" aria-label="Subscribe"><Icon name="arrow" /></button></form>
          </section>
        </main>
        <Footer setView={setView} />
      </>}

      {view === 'orders' && <main className="account-page section-wrap">
        <div className="page-topline"><button className="back-link" onClick={() => { setView('shop'); setCheckoutDone(false) }}>← Back to shopping</button><span>YOUR ATELIER ACCOUNT</span></div>
        <div className="page-title-row"><div><p className="eyebrow">A LITTLE LOOK BACK</p><h1>{checkoutDone ? 'It’s on its way.' : 'Your orders.'}</h1><p>{checkoutDone ? 'Order placed successfully. We can’t wait for it to find you.' : 'All your good things, in one place.'}</p></div><button className="button button-dark" onClick={() => setView('shop')}>Keep browsing <Icon name="arrow" size={16} /></button></div>
        {orders.length ? <div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-heading"><div><span className="order-number">ORDER {order.id}</span><span className="order-date">{new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></div><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span></div><div className="order-body"><div className="order-items">{order.items.map((item) => <div className="order-item" key={item.id}><img src={imageUrl(item.image, 180)} alt="" /><span>{item.name}</span><span>× {item.quantity}</span></div>)}</div><div className="order-total"><span>Total</span><strong>{money(order.total)}</strong></div></div></article>)}</div> : <div className="empty-state"><span className="empty-state-icon"><Icon name="package" size={30} /></span><h2>No orders just yet.</h2><p>Your next favorite thing is waiting to be found.</p><button className="button button-dark" onClick={() => setView('shop')}>Explore the collection <Icon name="arrow" size={16} /></button></div>}
      </main>}

      {view === 'admin' && <main className="admin-page section-wrap">
        <div className="admin-topline"><div><p className="eyebrow">ATELIER · STORE TOOLS</p><h1>Good morning, admin.</h1><p>Everything behind the good things, in one place.</p></div><button className="button button-outline" onClick={() => setView('shop')}>Back to storefront <Icon name="arrow" size={16} /></button></div>
        <div className="admin-stats"><Stat label="Total revenue" value={money(orders.reduce((sum, order) => sum + order.total, 0))} detail="From all orders" /><Stat label="Orders" value={orders.length} detail="All time" /><Stat label="Products" value={products.length} detail={`${products.reduce((sum, product) => sum + product.stock, 0)} units in stock`} /><Stat label="Customers" value={customers.length} detail="Registered accounts" /></div>
        <div className="admin-tabs"><button className="active">Overview</button><span>PRODUCTS & INVENTORY</span></div>
        <section className="admin-section"><div className="admin-section-title"><div><p className="eyebrow">YOUR COLLECTION</p><h2>Products & inventory</h2></div><button className="button button-dark" onClick={() => setNewProductOpen(true)}><Icon name="plus" size={16} /> Add a product</button></div>
          <div className="table-scroll"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Inventory</th><th>Availability</th><th aria-label="Actions" /></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="table-product"><img src={imageUrl(product.image, 120)} alt="" /><span>{product.name}</span></div></td><td>{product.category}</td><td>{money(product.price)}</td><td><input className="stock-input" aria-label={`${product.name} inventory`} type="number" min="0" value={product.stock} onChange={(event) => updateStock(product.id, event.target.value)} /></td><td><span className={product.stock ? 'inventory-status in-stock' : 'inventory-status out-stock'}><i />{product.stock ? 'In stock' : 'Sold out'}</span></td><td><button className="table-action" aria-label={`Remove ${product.name}`} onClick={() => removeProduct(product.id)}><Icon name="trash" size={17} /></button></td></tr>)}</tbody></table></div>
        </section>
        <section className="admin-section"><div className="admin-section-title"><div><p className="eyebrow">THE LATEST</p><h2>Recent orders</h2></div><span className="small-muted">{orders.length} total</span></div>
          {orders.length ? <div className="table-scroll"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td className="order-number">{order.id}</td><td>{order.customer}<span className="table-subtext">{order.email}</span></td><td>{new Date(order.date).toLocaleDateString()}</td><td>{money(order.total)}</td><td><select className="status-select" aria-label={`Update status for ${order.id}`} value={order.status} onChange={(event) => updateOrder(order.id, event.target.value)}>{['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div> : <p className="admin-empty">Orders will appear here when customers check out.</p>}
        </section>
        <section className="admin-section"><div className="admin-section-title"><div><p className="eyebrow">OUR COMMUNITY</p><h2>Customers</h2></div><span className="small-muted">{customers.length} accounts</span></div>
          {customers.length ? <div className="table-scroll"><table className="admin-table"><thead><tr><th>Customer</th><th>Email</th><th>Joined</th><th>Orders</th><th aria-label="Actions" /></tr></thead><tbody>{customers.map((customer) => <tr key={customer.email}><td>{customer.name}</td><td>{customer.email}</td><td>{new Date(customer.joined).toLocaleDateString()}</td><td>{customer.orders || 0}</td><td><button className="table-action" aria-label={`Remove ${customer.name}`} onClick={() => removeCustomer(customer.email)}><Icon name="trash" size={17} /></button></td></tr>)}</tbody></table></div> : <p className="admin-empty">Customer accounts will appear here after they sign up.</p>}
        </section>
        <p className="demo-disclaimer">Demo dashboard — data is saved only in this browser and is not connected to a real payment, shipping, or inventory system.</p>
      </main>}
      {view !== 'shop' && <Footer setView={setView} />}

      {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" aria-label="Shopping bag"><div className="drawer-header"><div><p className="eyebrow">YOUR GOOD THINGS</p><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" aria-label="Close bag" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>
        {checkoutDone ? <div className="checkout-success"><span className="success-icon"><Icon name="check" size={25} /></span><h3>All yours.</h3><p>Your order was placed successfully. Thanks for choosing good things.</p><button className="button button-dark" onClick={() => { setCartOpen(false); setView('orders') }}>View your orders</button></div> : cart.length ? <>
          <div className="shipping-message">{subtotal >= 100 ? 'You’ve unlocked complimentary shipping!' : `You’re ${money(100 - subtotal)} away from complimentary shipping.`}<div className="shipping-track"><span style={{ width: `${Math.min(100, subtotal / 100 * 100)}%` }} /></div></div>
          <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={imageUrl(item.image, 250)} alt={item.name} /><div className="cart-item-copy"><h3>{item.name}</h3><p>{item.color}</p><strong>{money(item.price)}</strong><div className="quantity-control"><button aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(item.id, -1)}><Icon name="minus" size={14} /></button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(item.id, 1)}><Icon name="plus" size={14} /></button></div></div><button className="remove-item" aria-label={`Remove ${item.name}`} onClick={() => save('atelier-cart', cart.filter((entry) => entry.id !== item.id), setCart)}><Icon name="trash" size={17} /></button></div>)}</div>
          <div className="cart-bottom"><div className="subtotal-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="button button-dark checkout-button" onClick={placeOrder}>Place demo order <Icon name="arrow" size={17} /></button><span className="checkout-note">Demo checkout · no payment is collected</span></div>
        </> : <div className="empty-cart"><span className="empty-state-icon"><Icon name="bag" size={28} /></span><h3>A little space for something lovely.</h3><p>Your bag is waiting for its first good thing.</p><button className="button button-dark" onClick={() => { setCartOpen(false); setView('shop') }}>Find your favorite</button></div>}
      </aside></div>}

      {accountOpen && <div className="overlay modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setAccountOpen(false) }}><section className="account-modal" aria-label="Account"><button className="modal-close icon-button" aria-label="Close account" onClick={() => setAccountOpen(false)}><Icon name="close" /></button>{user ? <><p className="eyebrow">YOUR LITTLE CORNER</p><h2>Hello, {user.name}.</h2><p className="account-email">{user.email}</p><div className="account-menu"><button onClick={() => { setAccountOpen(false); setView('orders') }}><span><Icon name="package" size={18} />Your orders</span><Icon name="arrow" size={17} /></button>{user.role === 'admin' && <button onClick={() => { setAccountOpen(false); setView('admin') }}><span><Icon name="grid" size={18} />Store dashboard</span><Icon name="arrow" size={17} /></button>}<button onClick={() => { localStorage.removeItem('atelier-user'); setUser(null); setAccountOpen(false); notify('You’ve signed out.') }}><span><Icon name="user" size={18} />Sign out</span><Icon name="arrow" size={17} /></button></div><button className="admin-demo-link" onClick={openAdmin}>Switch to admin demo</button></> : <><p className="eyebrow">{authMode === 'login' ? 'WELCOME BACK' : 'A GOOD THING STARTS HERE'}</p><h2>{authMode === 'login' ? 'Come on in.' : 'Make yourself at home.'}</h2><p className="account-description">Sign in to keep all your favorite things together.</p><form className="auth-form" onSubmit={handleAuth}>{authMode === 'register' && <label>Your name<input name="name" type="text" placeholder="First and last name" required autoComplete="name" /></label>}<label>Email address<input name="email" type="email" placeholder="you@example.com" required autoComplete="email" /></label><label>Password<input name="password" type="password" placeholder="At least 6 characters" required minLength="6" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} /></label><p className="demo-disclaimer">Demo account only. Your password is not stored or verified.</p><button className="button button-dark" type="submit">{authMode === 'login' ? 'Sign in' : 'Create account'} <Icon name="arrow" size={16} /></button></form><p className="auth-switch">{authMode === 'login' ? 'New around here?' : 'Already have an account?'} <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>{authMode === 'login' ? 'Create an account' : 'Sign in'}</button></p><button className="admin-demo-link" onClick={openAdmin}>Explore the admin demo →</button></>}</section></div>}

      {newProductOpen && <div className="overlay modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setNewProductOpen(false) }}><section className="account-modal product-modal"><button className="modal-close icon-button" aria-label="Close form" onClick={() => setNewProductOpen(false)}><Icon name="close" /></button><p className="eyebrow">MAKE ROOM FOR SOMETHING GOOD</p><h2>Add a product.</h2><form className="auth-form" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const product = { id: Date.now(), name: String(data.get('name')).trim(), category: String(data.get('category')), price: Number(data.get('price')), color: String(data.get('color') || 'Natural'), stock: Number(data.get('stock')), rating: 5, reviews: 0, badge: 'New', image: 'photo-1544816155-12df9643f363' }; save('atelier-products', [product, ...products], setProducts); setNewProductOpen(false); notify('Your new product is live.') }}><label>Product name<input name="name" required placeholder="The Everyday Tote" /></label><div className="form-row"><label>Category<select name="category"><option>Accessories</option><option>Clothing</option><option>Home</option></select></label><label>Price<input name="price" type="number" min="0.01" step="0.01" required placeholder="48.00" /></label></div><div className="form-row"><label>Color<input name="color" placeholder="Natural" /></label><label>Initial stock<input name="stock" type="number" min="0" required placeholder="10" /></label></div><button className="button button-dark" type="submit">Add to collection <Icon name="arrow" size={16} /></button></form></section></div>}

      {toast && <div className="toast" role="status"><span><Icon name="check" size={17} /></span>{toast}</div>}
    </div>
  )
}

function Stat({ label, value, detail }) {
  return <article className="stat-card"><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>
}

function Footer({ setView }) {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a className="wordmark" href="#" onClick={(event) => { event.preventDefault(); setView('shop') }}>atelier<span>.</span></a><p>Thoughtful finds for your everyday rituals.</p></div><div className="footer-links"><div><span>EXPLORE</span><button onClick={() => setView('shop')}>Shop all</button><button onClick={() => setView('orders')}>Your orders</button></div><div><span>THE LITTLE DETAILS</span><a href="#collection">Our story</a><a href="#collection">Shipping & returns</a></div><div><span>NEED A HAND?</span><a href="mailto:hello@atelier.example">Get in touch</a><span className="footer-contact">hello@atelier.example</span></div></div></div><div className="footer-bottom"><span>© 2026 atelier. Made for everyday.</span><span>Thoughtfully made. Happily found.</span></div></footer>
}

export default App
