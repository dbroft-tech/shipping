// RGR Logistics Service Worker
// Provides offline functionality and caching

const CACHE_NAME = 'rgr-logistics-v1.0.0';
const STATIC_CACHE = 'rgr-static-v1.0.0';
const DYNAMIC_CACHE = 'rgr-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/services.html',
  '/about.html',
  '/locations.html',
  '/contact.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Check if response is valid
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Cache dynamic content
            if (shouldCacheDynamically(request.url)) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            // Return offline image for image requests
            if (request.destination === 'image') {
              return caches.match('/assets/icons/offline-image.png');
            }
          });
      })
  );
});

// Determine if content should be cached dynamically
function shouldCacheDynamically(url) {
  const dynamicCachePatterns = [
    /\.(js|css|png|jpg|jpeg|gif|svg|webp|ico)$/,
    /\/api\//,
    /googleapis\.com/,
    /cdnjs\.cloudflare\.com/,
    /cdn\.jsdelivr\.net/
  ];
  
  return dynamicCachePatterns.some(pattern => pattern.test(url));
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
  
  if (event.tag === 'quote-form-sync') {
    event.waitUntil(syncQuoteForms());
  }
});

// Sync contact form submissions
async function syncContactForms() {
  try {
    const db = await openIndexedDB();
    const forms = await getStoredForms(db, 'contact-forms');
    
    for (const form of forms) {
      try {
        await submitForm('/api/contact', form.data);
        await deleteStoredForm(db, 'contact-forms', form.id);
        console.log('Contact form synced successfully');
      } catch (error) {
        console.error('Failed to sync contact form:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync quote form submissions
async function syncQuoteForms() {
  try {
    const db = await openIndexedDB();
    const forms = await getStoredForms(db, 'quote-forms');
    
    for (const form of forms) {
      try {
        await submitForm('/api/quote', form.data);
        await deleteStoredForm(db, 'quote-forms', form.id);
        console.log('Quote form synced successfully');
      } catch (error) {
        console.error('Failed to sync quote form:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helpers
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RGRLogisticsDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('contact-forms')) {
        db.createObjectStore('contact-forms', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('quote-forms')) {
        db.createObjectStore('quote-forms', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getStoredForms(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteStoredForm(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function submitForm(endpoint, data) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update from RGR Logistics',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open Website',
        icon: '/assets/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('RGR Logistics', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Script loaded successfully');
