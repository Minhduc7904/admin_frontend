import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const seoMediaApi = {
  // Slots
  createSlot(data) {
    return axiosClient.post(API_ENDPOINTS.SEO_MEDIA.SLOTS.CREATE, data);
  },

  getSlots(params = {}) {
    return axiosClient.get(API_ENDPOINTS.SEO_MEDIA.SLOTS.LIST, { params });
  },

  getSlotsByCode(code, params = {}) {
    return axiosClient.get(API_ENDPOINTS.SEO_MEDIA.SLOTS.BY_CODE(code), { params });
  },

  getSlotById(slotId, params = {}) {
    return axiosClient.get(API_ENDPOINTS.SEO_MEDIA.SLOTS.DETAIL(slotId), { params });
  },

  updateSlot(slotId, data) {
    return axiosClient.put(API_ENDPOINTS.SEO_MEDIA.SLOTS.UPDATE(slotId), data);
  },

  deleteSlot(slotId) {
    return axiosClient.delete(API_ENDPOINTS.SEO_MEDIA.SLOTS.DELETE(slotId));
  },

  // Items
  createItem(data) {
    return axiosClient.post(API_ENDPOINTS.SEO_MEDIA.ITEMS.CREATE, data);
  },

  getItemsBySlot(slotId, params = {}) {
    return axiosClient.get(API_ENDPOINTS.SEO_MEDIA.ITEMS.BY_SLOT(slotId), { params });
  },

  updateItem(itemId, data) {
    return axiosClient.put(API_ENDPOINTS.SEO_MEDIA.ITEMS.UPDATE(itemId), data);
  },

  reorderItems(slotId, data) {
    return axiosClient.put(API_ENDPOINTS.SEO_MEDIA.SLOTS.REORDER_ITEMS(slotId), data);
  },

  deleteItem(itemId) {
    return axiosClient.delete(API_ENDPOINTS.SEO_MEDIA.ITEMS.DELETE(itemId));
  },

  // Upload image (multipart/form-data)
  uploadImage(formData) {
    return axiosClient.post(API_ENDPOINTS.SEO_MEDIA.UPLOAD_IMAGE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default seoMediaApi;


/*
SEO MEDIA API DOCUMENTATION

1) Create SEO media slot
- Purpose: create a slot for SEO page media.
- Endpoint: POST /seo-media/slots
- Request body:
{
  "code": "home_hero",
  "name": "Home Hero",
  "description": "Top banner",
  "isActive": true
}
- Response:
{
  "success": true,
  "message": "SEO media slot created successfully",
  "data": {
    "slotId": 1,
    "code": "home_hero",
    "name": "Home Hero",
    "description": "Top banner",
    "isActive": true,
    "createdAt": "2026-05-06T10:00:00.000Z",
    "updatedAt": "2026-05-06T10:00:00.000Z"
  }
}

2) Get SEO media slot list (pagination)
- Purpose: list slots with filter and pagination.
- Endpoint: GET /seo-media/slots?page=1&limit=10&isActive=true&includeItems=false
- Request: query params (`page`, `limit`, `isActive`, `includeItems`)
- Response:
{
  "success": true,
  "message": "Lay danh sach SEO media slots thanh cong",
  "data": [
    {
      "slotId": 1,
      "code": "home_hero",
      "name": "Home Hero",
      "description": "Top banner",
      "isActive": true,
      "createdAt": "2026-05-06T10:00:00.000Z",
      "updatedAt": "2026-05-06T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasPrevious": false,
    "hasNext": false
  }
}

3) Get SEO media slot by code (pagination)
- Purpose: search slot by code and return paginated list format.
- Endpoint: GET /seo-media/slots/code/:code?page=1&limit=10&includeItems=true
- Request:
  - Path param: `code`
  - Query params: `page`, `limit`, `includeItems`
- Response:
{
  "success": true,
  "message": "Lay danh sach SEO media slots thanh cong",
  "data": [
    {
      "slotId": 1,
      "code": "home_hero",
      "name": "Home Hero",
      "description": "Top banner",
      "isActive": true,
      "createdAt": "2026-05-06T10:00:00.000Z",
      "updatedAt": "2026-05-06T10:00:00.000Z",
      "items": []
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasPrevious": false,
    "hasNext": false
  }
}

4) Get SEO media slot by id (no pagination)
- Purpose: get one slot detail by id.
- Endpoint: GET /seo-media/slots/:slotId?includeItems=true
- Request:
  - Path param: `slotId`
  - Query params: `includeItems`
- Response:
{
  "success": true,
  "message": "SEO media slot retrieved successfully",
  "data": {
    "slotId": 1,
    "code": "home_hero",
    "name": "Home Hero",
    "description": "Top banner",
    "isActive": true,
    "createdAt": "2026-05-06T10:00:00.000Z",
    "updatedAt": "2026-05-06T10:00:00.000Z",
    "items": []
  }
}

5) Update SEO media slot
- Purpose: update slot information.
- Endpoint: PUT /seo-media/slots/:slotId
- Request body:
{
  "name": "Home Hero Updated",
  "description": "New description",
  "isActive": true
}
- Response:
{
  "success": true,
  "message": "SEO media slot updated successfully",
  "data": {
    "slotId": 1,
    "code": "home_hero",
    "name": "Home Hero Updated",
    "description": "New description",
    "isActive": true,
    "createdAt": "2026-05-06T10:00:00.000Z",
    "updatedAt": "2026-05-06T10:30:00.000Z"
  }
}

6) Delete SEO media slot
- Purpose: delete slot (items are removed by cascade relation).
- Endpoint: DELETE /seo-media/slots/:slotId
- Request: path param `slotId`
- Response:
{
  "success": true,
  "message": "SEO media slot deleted successfully",
  "data": {
    "deleted": true,
    "message": "SEO media slot deleted successfully"
  }
}

7) Create SEO media item (independent from media table)
- Purpose: add one image item into slot using upload metadata.
- Endpoint: POST /seo-media/items
- Request body:
{
  "slotId": 1,
  "bucketName": "seo-media",
  "objectKey": "seo-media/2026/05/uuid.jpg",
  "publicUrl": "/seo-media/2026/05/uuid.jpg",
  "originalName": "banner_home.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 345678,
  "width": 1920,
  "height": 1080,
  "sortOrder": 0,
  "alt": "Hero image",
  "linkUrl": "https://example.com"
}
- Response:
{
  "success": true,
  "message": "SEO media item created successfully",
  "data": {
    "itemId": 1,
    "slotId": 1,
    "bucketName": "seo-media",
    "objectKey": "seo-media/2026/05/uuid.jpg",
    "publicUrl": "/seo-media/2026/05/uuid.jpg",
    "originalName": "banner_home.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 345678,
    "width": 1920,
    "height": 1080,
    "sortOrder": 0,
    "alt": "Hero image",
    "linkUrl": "https://example.com",
    "createdAt": "2026-05-06T10:00:00.000Z",
    "updatedAt": "2026-05-06T10:00:00.000Z"
  }
}

8) Get SEO media items by slot (pagination)
- Purpose: list items in a slot.
- Endpoint: GET /seo-media/slots/:slotId/items?page=1&limit=10&includeSlot=false
- Request:
  - Path param: `slotId`
  - Query params: `page`, `limit`, `includeSlot`
- Response:
{
  "success": true,
  "message": "Lay danh sach SEO media items thanh cong",
  "data": [
    {
      "itemId": 1,
      "slotId": 1,
      "bucketName": "seo-media",
      "objectKey": "seo-media/2026/05/uuid.jpg",
      "publicUrl": "/seo-media/2026/05/uuid.jpg",
      "originalName": "banner_home.jpg",
      "mimeType": "image/jpeg",
      "fileSize": 345678,
      "width": 1920,
      "height": 1080,
      "sortOrder": 0,
      "alt": "Hero image",
      "linkUrl": "https://example.com",
      "createdAt": "2026-05-06T10:00:00.000Z",
      "updatedAt": "2026-05-06T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasPrevious": false,
    "hasNext": false
  }
}

9) Update SEO media item
- Purpose: update slot/image metadata/order/alt/link for one item.
- Endpoint: PUT /seo-media/items/:itemId
- Request body:
{
  "sortOrder": 2,
  "alt": "New alt",
  "linkUrl": "https://example.com/new-link"
}
- Response:
{
  "success": true,
  "message": "SEO media item updated successfully",
  "data": {
    "itemId": 1,
    "slotId": 1,
    "bucketName": "seo-media",
    "objectKey": "seo-media/2026/05/uuid.jpg",
    "publicUrl": "/seo-media/2026/05/uuid.jpg",
    "originalName": "banner_home.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 345678,
    "width": 1920,
    "height": 1080,
    "sortOrder": 2,
    "alt": "New alt",
    "linkUrl": "https://example.com/new-link",
    "createdAt": "2026-05-06T10:00:00.000Z",
    "updatedAt": "2026-05-06T10:40:00.000Z"
  }
}

10) Reorder SEO media items in slot
- Purpose: batch update item sort order inside one slot.
- Endpoint: PUT /seo-media/slots/:slotId/items/reorder
- Request body:
{
  "items": [
    { "itemId": 10, "sortOrder": 0 },
    { "itemId": 11, "sortOrder": 1 }
  ]
}
- Response:
{
  "success": true,
  "message": "SEO media items reordered successfully",
  "data": {
    "data": [
      {
        "itemId": 10,
        "slotId": 1,
        "bucketName": "seo-media",
        "objectKey": "seo-media/2026/05/uuid-10.jpg",
        "publicUrl": "/seo-media/2026/05/uuid-10.jpg",
        "originalName": "banner_1.jpg",
        "mimeType": "image/jpeg",
        "fileSize": 320000,
        "width": 1920,
        "height": 1080,
        "sortOrder": 0,
        "alt": null,
        "linkUrl": null,
        "createdAt": "2026-05-06T10:00:00.000Z",
        "updatedAt": "2026-05-06T10:45:00.000Z"
      }
    ],
    "total": 2
  }
}

11) Delete SEO media item
- Purpose: remove one item from slot.
- Endpoint: DELETE /seo-media/items/:itemId
- Request: path param `itemId`
- Response:
{
  "success": true,
  "message": "SEO media item deleted successfully",
  "data": {
    "deleted": true,
    "message": "SEO media item deleted successfully"
  }
}

12) Upload SEO image to public MinIO bucket
- Purpose: upload image to public `seo-media` bucket and return metadata for API #7.
- Endpoint: POST /seo-media/upload-image
- Content-Type: multipart/form-data
- Request:
  - file: binary (required, image only)
- Response:
{
  "success": true,
  "message": "SEO image uploaded successfully",
  "data": {
    "bucketName": "seo-media",
    "objectKey": "seo-media/2026/05/uuid.jpg",
    "publicUrl": "/seo-media/2026/05/uuid.jpg",
    "originalName": "banner_home.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 345678,
    "width": 1920,
    "height": 1080
  }
}
*/
