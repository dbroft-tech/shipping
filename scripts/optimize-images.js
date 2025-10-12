#!/usr/bin/env node

/**
 * Image Optimization Script for RGR Logistics Website
 * Optimizes images and generates WebP versions with fallbacks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  inputDir: './resources',
  outputDir: './assets/images',
  quality: 85,
  webpQuality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  thumbnailSize: 300,
};

// Supported image formats
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];

// Image metadata for proper naming and alt texts
const imageMetadata = {
  'vhjhkjl.jpg': {
    name: 'rgr-logistics-logo',
    alt: 'RGR Logistics Ltd company logo',
    description: 'Official logo of RGR Logistics Ltd'
  },
  '12344.jpg': {
    name: 'warehouse-facility-1',
    alt: 'Modern bonded warehouse facility',
    description: 'Professional bonded warehouse storage facility'
  },
  '234567.jpg': {
    name: 'logistics-operations',
    alt: 'Logistics operations in progress',
    description: 'Active logistics and cargo handling operations'
  },
  'bkjjjbkhj.jpg': {
    name: 'cargo-handling',
    alt: 'Professional cargo handling services',
    description: 'Expert cargo handling and management'
  },
  'gjkjk.jpg': {
    name: 'transportation-fleet',
    alt: 'RGR Logistics transportation fleet',
    description: 'Modern transportation and delivery fleet'
  },
  'gyyjhyiol.jpg': {
    name: 'customs-clearance',
    alt: 'Customs clearance documentation',
    description: 'Professional customs clearance services'
  },
  'jgjk.jpg': {
    name: 'depot-services',
    alt: 'Depot management and storage',
    description: 'Comprehensive depot management services'
  },
  'jhkjhllj.jpg': {
    name: 'freight-forwarding',
    alt: 'International freight forwarding',
    description: 'Global freight forwarding operations'
  },
  'kjhkjjhk.jpg': {
    name: 'warehouse-interior',
    alt: 'Interior view of bonded warehouse',
    description: 'Spacious and organized warehouse interior'
  },
  'uytuy.jpg': {
    name: 'team-operations',
    alt: 'RGR Logistics team at work',
    description: 'Professional logistics team in action'
  }
};

/**
 * Create output directory if it doesn't exist
 */
function createOutputDir() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
    console.log(`✅ Created output directory: ${config.outputDir}`);
  }
}

/**
 * Get all image files from input directory
 */
function getImageFiles() {
  if (!fs.existsSync(config.inputDir)) {
    console.error(`❌ Input directory not found: ${config.inputDir}`);
    return [];
  }

  const files = fs.readdirSync(config.inputDir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return supportedFormats.includes(ext);
  });
}

/**
 * Optimize a single image
 */
function optimizeImage(inputFile) {
  const inputPath = path.join(config.inputDir, inputFile);
  const metadata = imageMetadata[inputFile] || {
    name: path.parse(inputFile).name,
    alt: 'RGR Logistics image',
    description: 'Professional logistics services image'
  };
  
  const outputName = metadata.name;
  const outputPath = path.join(config.outputDir, `${outputName}.jpg`);
  const webpPath = path.join(config.outputDir, `${outputName}.webp`);
  const thumbnailPath = path.join(config.outputDir, `${outputName}-thumb.jpg`);

  try {
    console.log(`🔄 Processing: ${inputFile} -> ${outputName}`);

    // Check if ImageMagick is available
    try {
      execSync('magick -version', { stdio: 'ignore' });
    } catch (error) {
      console.warn('⚠️  ImageMagick not found. Using simple file copy.');
      fs.copyFileSync(inputPath, outputPath);
      return;
    }

    // Optimize JPEG version
    const jpegCommand = `magick "${inputPath}" -quality ${config.quality} -resize ${config.maxWidth}x${config.maxHeight}> -strip "${outputPath}"`;
    execSync(jpegCommand);
    console.log(`  ✅ Created optimized JPEG: ${outputName}.jpg`);

    // Create WebP version
    const webpCommand = `magick "${inputPath}" -quality ${config.webpQuality} -resize ${config.maxWidth}x${config.maxHeight}> -strip "${webpPath}"`;
    execSync(webpCommand);
    console.log(`  ✅ Created WebP version: ${outputName}.webp`);

    // Create thumbnail
    const thumbCommand = `magick "${inputPath}" -quality ${config.quality} -resize ${config.thumbnailSize}x${config.thumbnailSize}^ -gravity center -extent ${config.thumbnailSize}x${config.thumbnailSize} -strip "${thumbnailPath}"`;
    execSync(thumbCommand);
    console.log(`  ✅ Created thumbnail: ${outputName}-thumb.jpg`);

    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    const webpSavings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

    console.log(`  📊 Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`  📊 Optimized JPEG: ${(optimizedSize / 1024).toFixed(1)}KB (${savings}% smaller)`);
    console.log(`  📊 WebP: ${(webpSize / 1024).toFixed(1)}KB (${webpSavings}% smaller)`);

  } catch (error) {
    console.error(`❌ Error processing ${inputFile}:`, error.message);
  }
}

/**
 * Generate image manifest with metadata
 */
function generateImageManifest() {
  const manifestPath = path.join(config.outputDir, 'manifest.json');
  const manifest = {
    generated: new Date().toISOString(),
    images: {}
  };

  Object.entries(imageMetadata).forEach(([originalFile, metadata]) => {
    const outputName = metadata.name;
    manifest.images[outputName] = {
      ...metadata,
      originalFile,
      formats: {
        jpeg: `${outputName}.jpg`,
        webp: `${outputName}.webp`,
        thumbnail: `${outputName}-thumb.jpg`
      }
    };
  });

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Generated image manifest: ${manifestPath}`);
}

/**
 * Generate CSS for responsive images
 */
function generateResponsiveCSS() {
  const cssPath = path.join(config.outputDir, 'responsive-images.css');
  let css = '/* Responsive Images CSS - Auto-generated */\n\n';

  css += '.responsive-image {\n';
  css += '  max-width: 100%;\n';
  css += '  height: auto;\n';
  css += '  display: block;\n';
  css += '}\n\n';

  css += '.lazy-image {\n';
  css += '  opacity: 0;\n';
  css += '  transition: opacity 0.3s ease;\n';
  css += '}\n\n';

  css += '.lazy-image.loaded {\n';
  css += '  opacity: 1;\n';
  css += '}\n\n';

  Object.entries(imageMetadata).forEach(([originalFile, metadata]) => {
    const outputName = metadata.name;
    css += `.bg-${outputName} {\n`;
    css += `  background-image: url('${outputName}.webp');\n`;
    css += '  background-size: cover;\n';
    css += '  background-position: center;\n';
    css += '  background-repeat: no-repeat;\n';
    css += '}\n\n';

    css += `@supports not (background-image: url('test.webp')) {\n`;
    css += `  .bg-${outputName} {\n`;
    css += `    background-image: url('${outputName}.jpg');\n`;
    css += '  }\n';
    css += '}\n\n';
  });

  fs.writeFileSync(cssPath, css);
  console.log(`✅ Generated responsive CSS: ${cssPath}`);
}

/**
 * Generate HTML snippets for images
 */
function generateHTMLSnippets() {
  const htmlPath = path.join(config.outputDir, 'image-snippets.html');
  let html = '<!-- Image HTML Snippets - Auto-generated -->\n\n';

  Object.entries(imageMetadata).forEach(([originalFile, metadata]) => {
    const outputName = metadata.name;
    
    html += `<!-- ${metadata.description} -->\n`;
    html += '<picture class="responsive-image">\n';
    html += `  <source srcset="assets/images/${outputName}.webp" type="image/webp">\n`;
    html += `  <img src="assets/images/${outputName}.jpg" alt="${metadata.alt}" loading="lazy" width="800" height="600">\n`;
    html += '</picture>\n\n';
  });

  fs.writeFileSync(htmlPath, html);
  console.log(`✅ Generated HTML snippets: ${htmlPath}`);
}

/**
 * Main optimization function
 */
function main() {
  console.log('🚀 Starting image optimization for RGR Logistics...\n');

  createOutputDir();
  
  const imageFiles = getImageFiles();
  if (imageFiles.length === 0) {
    console.log('ℹ️  No images found to optimize.');
    return;
  }

  console.log(`📸 Found ${imageFiles.length} images to optimize\n`);

  // Process each image
  imageFiles.forEach(optimizeImage);

  // Generate additional files
  generateImageManifest();
  generateResponsiveCSS();
  generateHTMLSnippets();

  console.log('\n✨ Image optimization completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update HTML files to use optimized images');
  console.log('2. Include responsive-images.css in your stylesheets');
  console.log('3. Test WebP support and fallbacks');
  console.log('4. Verify lazy loading implementation');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  optimizeImage,
  generateImageManifest,
  generateResponsiveCSS,
  generateHTMLSnippets,
  config,
  imageMetadata
};
