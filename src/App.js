
import React, { useEffect, useState } from 'react';
import bible from '../public/bible.json';

function App() {
  const [chapter, setChapter] = useState('');
  const today = new Date();
  const index = ((today.getMonth()) * 31 + today.getDate() - 1) % bible.length;

  useEffect(() => {
    const entry = bible[index];
    setChapter(`${entry.book} ${entry.chapter}\n\n${entry.text}`);
  }, []);

  return (
    <div style={{ padding: '2rem', lineHeight: '1.6', fontSize: '18px', maxWidth: '800px', margin: 'auto' }}>
      <pre>{chapter}</pre>
    </div>
  );
}

export default App;
