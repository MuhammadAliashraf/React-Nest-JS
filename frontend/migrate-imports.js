const fs = require('fs');

const files = [
  'src/pages/home/Home.jsx',
  'src/pages/home/MensHome.jsx',
  'src/pages/home/WomensHome.jsx',
  'src/pages/product/ProductDetail.jsx',
  'src/pages/category/ProductList.jsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/\.\.\/components/g, '../../components');
    content = content.replace(/\.\.\/services/g, '../../services');
    content = content.replace(/\.\.\/context/g, '../../context');
    fs.writeFileSync(f, content);
    console.log('Fixed imports for', f);
  } else {
    console.log('File not found:', f);
  }
});
