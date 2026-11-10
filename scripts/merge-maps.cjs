const fs = require('fs')

const extract = (file) => {
  let s = fs.readFileSync(file, 'utf8')
  s = s.replace(/^[\s\S]*?<svg/i, '<svg')
  const openEnd = s.indexOf('>') + 1
  const openTag = s.slice(0, openEnd)
  const inner = s.slice(openEnd, s.lastIndexOf('</svg>'))
  // root attrs minus geometry/viewBox — keep xmlns declarations
  const attrs = ' ' + openTag.replace(/<\/?|>/g, '').replace(/^svg/, '')
    .replace(/\s(width|height|viewBox|preserveAspectRatio|x|y|id|style|class|version|baseProfile)="[^"]*"/g, '')
    .replace(/\sviewBox='[^']*'/g, '')
    .replace(/\sxmlns:\w+="&[^"]*"/g, '')
  return { inner, attrs }
}

const canada = extract('public/canada-provinces.svg') // viewBox 0 0 1084 920
const us = extract('public/us-states.svg')            // viewBox 0 0 501.001 329.964

const out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1084 1240">
  <svg${canada.attrs} x="0" y="0" width="1084" height="920" viewBox="0 0 1084 920">${canada.inner}</svg>
  <svg${us.attrs} x="160" y="850" width="760" height="500" viewBox="0 0 501.001 329.964">${us.inner}</svg>
</svg>
`
fs.writeFileSync('public/north-america-map.svg', out)
console.log('written', out.length, 'bytes')
