const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const cleanAttributes = (attrs = {}) => Object.entries(attrs).reduce((result, [key, value]) => {
    if (key !== 'src' && key !== 'viewUrl' && value !== undefined) result[key] = value;
    return result;
}, {});

export const sanitizeNewsContentJson = (node) => {
    if (!node || typeof node !== 'object') return node;
    const sanitized = { ...node };
    if (node.attrs) sanitized.attrs = cleanAttributes(node.attrs);
    if (Array.isArray(node.content)) sanitized.content = node.content.map(sanitizeNewsContentJson);
    return sanitized;
};

const renderNode = (node) => {
    if (!node) return '';
    const content = (node.content || []).map(renderNode).join('');
    const attrs = node.attrs || {};

    switch (node.type) {
        case 'doc': return content;
        case 'paragraph': return `<p>${content}</p>`;
        case 'text': {
            let text = escapeHtml(node.text || '');
            if (node.marks?.some((mark) => mark.type === 'bold')) text = `<strong>${text}</strong>`;
            if (node.marks?.some((mark) => mark.type === 'italic')) text = `<em>${text}</em>`;
            if (node.marks?.some((mark) => mark.type === 'strike')) text = `<s>${text}</s>`;
            const link = node.marks?.find((mark) => mark.type === 'link');
            return link ? `<a href="${escapeHtml(link.attrs?.href || '')}" target="_blank" rel="noopener noreferrer">${text}</a>` : text;
        }
        case 'hardBreak': return '<br>';
        case 'heading': return `<h${attrs.level || 2}>${content}</h${attrs.level || 2}>`;
        case 'bulletList': return `<ul>${content}</ul>`;
        case 'orderedList': return `<ol>${content}</ol>`;
        case 'listItem': return `<li>${content}</li>`;
        case 'blockquote': return `<blockquote>${content}</blockquote>`;
        case 'codeBlock': return `<pre><code>${content}</code></pre>`;
        case 'image': return `<img src="media:${attrs.mediaId}" alt="${escapeHtml(attrs.alt || '')}">`;
        case 'video': return `<video controls src="media:${attrs.mediaId}"></video>`;
        default: return content;
    }
};

export const newsContentToHtml = (contentJson) => renderNode(sanitizeNewsContentJson(contentJson));

export const getNewsContentText = (node) => {
    if (!node || typeof node !== 'object') return '';
    return [node.text || '', ...(node.content || []).map(getNewsContentText)].join('');
};

export const toDateTimeLocal = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
