/**
 * Merges styles/components.css + styles/utilities.css into styles/globals.css.
 * Next.js/webpack compiles @import targets as separate modules, which breaks
 * @layer without @tailwind — so we compose one entry file instead.
 */
const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, '..', 'styles');

function extractLayerBody(filename, layerName) {
  const content = fs.readFileSync(path.join(stylesDir, filename), 'utf8');
  const match = content.match(new RegExp(`@layer ${layerName}\\s*\\{([\\s\\S]*)\\}\\s*$`));
  if (!match) {
    throw new Error(`Could not parse @layer ${layerName} in ${filename}`);
  }
  return match[1].trimEnd();
}

const components = extractLayerBody('components.css', 'components');
const animations = extractLayerBody('animations.css', 'components');
const utilities = extractLayerBody('utilities.css', 'utilities');

const globals = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Composed from styles/components.css + animations.css — edit those files, then: npm run styles */
@layer components {
${components}

${animations}
}

/* Composed from styles/utilities.css */
@layer utilities {
${utilities}
}

:root {
  color-scheme: light;
}

body {
  @apply bg-canvas font-sans text-ink antialiased;
}
`;

fs.writeFileSync(path.join(stylesDir, 'globals.css'), globals);
console.log('Composed styles/globals.css from components.css + animations.css + utilities.css');
