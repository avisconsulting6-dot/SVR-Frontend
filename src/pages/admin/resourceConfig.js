/**
 * Column + form definitions for ResourceManager, aligned with the backend
 * models exactly (field names match what the API stores and returns).
 */
export const RESOURCE_CONFIG = {
  causes: {
    singular: 'cause',
    titleField: 'title',
    columns: [
      { key: 'image', label: '', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category', type: 'badge' },
      { key: 'raisedAmount', label: 'Raised', type: 'money' },
      { key: 'goalAmount', label: 'Goal', type: 'money' },
      { key: 'isActive', label: 'Active', type: 'bool' },
    ],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'category', label: 'Category', type: 'select', options: ['Medical', 'Education', 'Devotional', 'Awareness', 'Service'], required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'goalAmount', label: 'Goal (₹)', type: 'number', default: 100000, required: true },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'isActive', label: 'Active (visible on site)', type: 'bool', default: true },
    ],
  },
  products: {
    singular: 'product',
    titleField: 'name',
    columns: [
      { key: 'image', label: '', type: 'image' },
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'price', label: 'Price', type: 'money' },
      { key: 'stock', label: 'Stock' },
      { key: 'commissionPercent', label: 'Comm %' },
      { key: 'isActive', label: 'Active', type: 'bool' },
    ],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'category', label: 'Category', default: 'Handicrafts' },
      { key: 'price', label: 'Price (₹)', type: 'number', required: true, default: 0 },
      { key: 'stock', label: 'Stock', type: 'number', default: 50 },
      { key: 'commissionPercent', label: 'Volunteer commission (%)', type: 'number', default: 0 },
      { key: 'description', label: 'Short description', type: 'textarea' },
      { key: 'story', label: 'The story behind it', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'isActive', label: 'Active (visible in shop)', type: 'bool', default: true },
    ],
  },
  blogs: {
    singular: 'blog post',
    titleField: 'title',
    columns: [
      { key: 'image', label: '', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author' },
      { key: 'published', label: 'Published', type: 'bool' },
      { key: 'createdAt', label: 'Date', type: 'date' },
    ],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'excerpt', label: 'Excerpt (max 300 chars)', required: true },
      { key: 'content', label: 'Body', type: 'textarea', required: true },
      { key: 'author', label: 'Author', default: 'SVR Educational Society' },
      { key: 'image', label: 'Cover image', type: 'image' },
      { key: 'published', label: 'Published', type: 'bool', default: true },
    ],
  },
  events: {
    singular: 'fundraising event',
    titleField: 'title',
    columns: [
      { key: 'image', label: '', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category', type: 'badge' },
      { key: 'raisedAmount', label: 'Raised', type: 'money' },
      { key: 'targetAmount', label: 'Target', type: 'money' },
      { key: 'percent', label: 'Progress', type: 'percent' },
      { key: 'published', label: 'Live', type: 'bool' },
    ],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'category', label: 'Category', type: 'select', options: ['accident-relief', 'medical', 'orphanage', 'education', 'disaster-relief', 'general'], default: 'general' },
      { key: 'description', label: 'Description / story', type: 'textarea' },
      { key: 'targetAmount', label: 'Target (₹) — leave empty for open-ended', type: 'number' },
      { key: 'date', label: 'Event date (optional)', type: 'date' },
      { key: 'location', label: 'Location' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'published', label: 'Published (accepting donations)', type: 'bool', default: true },
    ],
  },
  gallery: {
    singular: 'photo',
    titleField: 'caption',
    columns: [
      { key: 'image', label: '', type: 'image' },
      { key: 'caption', label: 'Caption' },
      { key: 'album', label: 'Album', type: 'badge' },
      { key: 'createdAt', label: 'Added', type: 'date' },
    ],
    fields: [
      { key: 'image', label: 'Image', type: 'image', required: true },
      { key: 'caption', label: 'Caption' },
      { key: 'album', label: 'Album', type: 'select', options: ['events', 'camps', 'education', 'healthcare', 'environment'], default: 'events' },
    ],
  },
}