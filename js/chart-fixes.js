
// Chart Distortion Fixes - Applied by Pipedream
(function() {
  'use strict';

  // Global chart configuration
  const CHART_CONFIG = {
    fixedWidth: 800,
    fixedHeight: 400,
    maintainAspectRatio: false,
    responsive: false
  };

  // Chart.js fixes
  if (typeof Chart !== 'undefined') {
    Chart.defaults.global.maintainAspectRatio = false;
    Chart.defaults.global.responsive = false;
    
    // Override Chart.js resize behavior
    const originalResize = Chart.prototype.resize;
    Chart.prototype.resize = function() {
      this.canvas.width = CHART_CONFIG.fixedWidth;
      this.canvas.height = CHART_CONFIG.fixedHeight;
      this.canvas.style.width = CHART_CONFIG.fixedWidth + 'px';
      this.canvas.style.height = CHART_CONFIG.fixedHeight + 'px';
      return this;
    };
  }

  // D3.js fixes
  if (typeof d3 !== 'undefined') {
    const originalSelectAll = d3.selectAll;
    d3.selectAll = function(selector) {
      const selection = originalSelectAll.call(this, selector);
      if (selector.includes('chart') || selector.includes('svg')) {
        selection
          .attr('width', CHART_CONFIG.fixedWidth)
          .attr('height', CHART_CONFIG.fixedHeight)
          .style('width', CHART_CONFIG.fixedWidth + 'px')
          .style('height', CHART_CONFIG.fixedHeight + 'px');
      }
      return selection;
    };
  }

  // Generic chart fixing function
  function fixChartDimensions() {
    const chartSelectors = '.chart-container, .production-chart, .monthly-chart'.split(',');
    
    chartSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector.trim());
      elements.forEach(element => {
        element.style.width = CHART_CONFIG.fixedWidth + 'px';
        element.style.height = CHART_CONFIG.fixedHeight + 'px';
        element.style.maxWidth = CHART_CONFIG.fixedWidth + 'px';
        element.style.maxHeight = CHART_CONFIG.fixedHeight + 'px';
        element.style.minWidth = CHART_CONFIG.fixedWidth + 'px';
        element.style.minHeight = CHART_CONFIG.fixedHeight + 'px';
        
        // Fix canvas and SVG children
        const canvases = element.querySelectorAll('canvas');
        const svgs = element.querySelectorAll('svg');
        
        [...canvases, ...svgs].forEach(child => {
          child.width = CHART_CONFIG.fixedWidth;
          child.height = CHART_CONFIG.fixedHeight;
          child.style.width = CHART_CONFIG.fixedWidth + 'px';
          child.style.height = CHART_CONFIG.fixedHeight + 'px';
        });
      });
    });
  }

  // Apply fixes on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixChartDimensions);
  } else {
    fixChartDimensions();
  }

  // Apply fixes on window load
  window.addEventListener('load', fixChartDimensions);

  // Prevent window resize from affecting charts
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(fixChartDimensions, 100);
  });

  // MutationObserver to fix dynamically added charts
  const observer = new MutationObserver(function(mutations) {
    let shouldFix = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && (
            node.classList.contains('chart-container') ||
            node.classList.contains('production-chart') ||
            node.classList.contains('monthly-chart') ||
            node.querySelector && node.querySelector('canvas, svg')
          )) {
            shouldFix = true;
          }
        });
      }
    });
    if (shouldFix) {
      setTimeout(fixChartDimensions, 50);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Export fix function globally
  window.fixChartDimensions = fixChartDimensions;

})();
