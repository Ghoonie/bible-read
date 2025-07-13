import React, { useEffect, useState } from 'react';
import { books } from './full_books_with_verses';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function App() {
  const startDate = new Date('2025-07-14');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [dayNumber, setDayNumber] = useState(0);
  const [progress, setProgress] = useState(0);
  const totalChapters = books.reduce((sum, book) => sum + book.chapters.length, 0);
  

  useEffect(() => {
    const selDate = new Date(selectedDate);
    const sDate = new Date(startDate);
    selDate.setHours(0, 0, 0, 0);
    sDate.setHours(0, 0, 0, 0);
  
    const diffDays = Math.floor((selDate - sDate) / (1000 * 60 * 60 * 24));
    setDayNumber(diffDays + 1);

    const readChapters = Math.min(diffDays + 1, totalChapters);
    const percent = (readChapters / totalChapters) * 100;
    setProgress(percent);
  
    let count = diffDays;
    for (let book of books) {
      for (let i = 0; i < book.chapters.length; i++) {
        if (count === 0) {
          const chapter = i + 1;
          const verses = book.chapters[i];
          const verseURL = `https://ibibles.net/quote.php?kor-${book.code}/${chapter}:1-${verses}`;
          setUrl(verseURL);
          setLabel(`${book.name} ${chapter}장`);
          return;
        }
        count--;
      }
    }
  
    setUrl('');
    setLabel('통독 범위를 벗어났습니다');
  }, [selectedDate]);
  

  return (
    <div style={{ padding: '2rem', lineHeight: '1.6', fontSize: '18px', maxWidth: '800px', margin: 'auto' }}>
      <h2>📖 오늘의 말씀</h2>
      <h3>{label}</h3>
      {url ? (
        <iframe title="오늘의 성경" src={url} width="100%" height="300" style={{ border: 'none', marginTop: '1rem' }} />
      ) : (
        <p>{label}</p>
      )}

      <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
  오늘은 통독 <strong>{dayNumber}</strong>일째입니다.
  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <div style={{ flexGrow: 1, height: '12px', backgroundColor: '#ddd', borderRadius: '6px' }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        backgroundColor: '#4caf50',
        borderRadius: '6px',
        transition: 'width 0.4s ease'
      }}></div>
    </div>
    <span style={{ minWidth: '50px' }}>{progress.toFixed(1)}%</span>
  </div>
</div>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        maxDate={new Date()}
        minDate={startDate}
        locale="ko-KR"
      />
    </div>
  );
}

export default App;
