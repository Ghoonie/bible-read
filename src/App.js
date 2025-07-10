import React, { useEffect, useState } from 'react';

function App() {
  const [chapter, setChapter] = useState('');

  useEffect(() => {
    const today = new Date();
    const index = (today.getMonth() * 31 + today.getDate() - 1);

    fetch('/bible.json')
      .then((res) => res.json())
      .then((data) => {
        const entry = data[index % data.length];
        setChapter(`${entry.book} ${entry.chapter}\n\n${entry.text}`);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', lineHeight: '1.6', fontSize: '18px', maxWidth: '800px', margin: 'auto' }}>
      <pre>{chapter}</pre>
    </div>
  );
}

export default App;
