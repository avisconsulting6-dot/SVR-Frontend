/**
 * data/demoProducts.js — FRONTEND-ONLY demo catalogue for the shop.
 *
 * Used as a fallback by api.getProducts()/api.getProduct() while the shop
 * backend (orders sprint) is pending: if the API has no products (or the
 * endpoint doesn't exist yet), these render instead. The moment the backend
 * serves real products, they take over automatically — delete this file then.
 */
export const DEMO_PRODUCTS = [
  {
    id: 'demo-1', slug: 'handwoven-cotton-tote-bag',
    name: 'Handwoven Cotton Tote Bag', category: 'Handicrafts',
    price: 349, stock: 40,
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=70',
    description: 'Sturdy everyday tote handwoven by women artisans of our self-help groups in Visakhapatnam. Natural dyes, machine-washable.',
    story: 'Each bag gives a weaver from our women-empowerment programme a full day of fair-wage work.',
  },
  {
    id: 'demo-2', slug: 'terracotta-diya-set-pack-of-12',
    name: 'Terracotta Diya Set (Pack of 12)', category: 'Handicrafts',
    price: 249, stock: 60,
    image: 'https://images.unsplash.com/photo-1604423043492-41303788de08?auto=format&fit=crop&w=800&q=70',
    description: 'Hand-moulded clay diyas from rural potter families. Perfect for festivals and gifting.',
    story: 'Sourced directly from potter families in coastal Andhra villages — no middlemen.',
  },
  {
    id: 'demo-3', slug: 'organic-forest-honey-500g',
    name: 'Organic Forest Honey (500g)', category: 'Food & Organics',
    price: 425, stock: 30,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=70',
    description: 'Raw, unprocessed honey collected sustainably by tribal communities. Lab-tested for purity.',
    story: 'Proceeds support forest-conservation awareness drives with the harvesting communities.',
  },
  {
    id: 'demo-4', slug: 'notebook-set-recycled-paper-3-pcs',
    name: 'Notebook Set — Recycled Paper (3 pcs)', category: 'Stationery',
    price: 199, stock: 100,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=70',
    description: 'A5 notebooks made from 100% recycled paper, bound by youth in our skill-training centre.',
    story: 'Buying one set funds a school notebook kit for a child in our education programme.',
  },
  {
    id: 'demo-5', slug: 'kalamkari-hand-painted-cushion-cover',
    name: 'Kalamkari Hand-painted Cushion Cover', category: 'Home & Living',
    price: 549, stock: 25,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=70',
    description: 'Traditional Andhra Kalamkari art, hand-painted with natural dyes on cotton. 16"×16".',
    story: 'Keeps a 3,000-year-old art form alive while paying artists a dignified wage.',
  },
  {
    id: 'demo-6', slug: 'svr-supporter-t-shirt',
    name: 'SVR Supporter T-Shirt', category: 'Apparel',
    price: 399, stock: 80,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=70',
    description: 'Soft 100% cotton tee with the SVR mission print. Unisex sizes S–XXL.',
    story: 'Wear the mission — the full margin funds our child-education campaigns.',
  },
]