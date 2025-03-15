// src/components/SEO.jsx
import React, { useEffect } from 'react';

const SEO = ({ title, description, canonical, ogType, ogImage, ogUrl, twitterTitle, twitterDescription, twitterImage }) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Set canonical URL
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonical);
    }

    // Open Graph tags
    if (ogType) {
      updateMetaTag('og:type', ogType);
    }
    if (ogImage) {
      updateMetaTag('og:image', ogImage);
    }
    if (title) {
      updateMetaTag('og:title', title);
    }
    if (description) {
      updateMetaTag('og:description', description);
    }
    if (ogUrl) {
      updateMetaTag('og:url', ogUrl);
    }

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    if (twitterTitle || title) {
      updateMetaTag('twitter:title', twitterTitle || title);
    }
    if (twitterDescription || description) {
      updateMetaTag('twitter:description', twitterDescription || description);
    }
    if (twitterImage || ogImage) {
      updateMetaTag('twitter:image', twitterImage || ogImage);
    }

    // Helper function to update or create meta tags
    function updateMetaTag(property, content) {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    }

    // Cleanup when component unmounts
    return () => {
      // If needed, you can reset meta tags here
      // Note: Usually we don't remove them to avoid flickering between page transitions
    };
  }, [title, description, canonical, ogType, ogImage, ogUrl, twitterTitle, twitterDescription, twitterImage]);

  // This component doesn't render anything
  return null;
};

export default SEO;