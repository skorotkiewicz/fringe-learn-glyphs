if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/fringe-learn-glyphs/sw.js', { scope: '/fringe-learn-glyphs/' })})}