import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function App() {
  const startDate = new Date('2025-07-14');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bibleData, setBibleData] = useState([]);
  const [bibleVersion, setBibleVersion] = useState('ko_mod.json');
  const [dayNumber, setDayNumber] = useState(0);
  const [progress, setProgress] = useState(0);
  const [chapterTitle, setChapterTitle] = useState('');
  const [verses, setVerses] = useState([]);

  useEffect(() => {
    fetch(`/${bibleVersion}`)
      .then((res) => res.json())
      .then((data) => setBibleData(data))
      .catch((err) => console.error('Failed to load Bible:', err));
  }, [bibleVersion]);

  useEffect(() => {
    if (bibleData.length === 0) return;

    const selDate = new Date(selectedDate);
    const sDate = new Date(startDate);
    selDate.setHours(0, 0, 0, 0);
    sDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((selDate - sDate) / (1000 * 60 * 60 * 24));
    const todayIndex = diffDays;
    setDayNumber(diffDays + 1);

    const flatChapters = [];
    for (const book of bibleData) {
      for (let i = 0; i < book.chapters.length; i++) {
        flatChapters.push({
          bookName: book.name,
          abbrev: book.abbrev,
          chapterIndex: i + 1,
          verses: book.chapters[i]
        });
      }
    }

    if (todayIndex >= 0 && todayIndex < flatChapters.length) {
      const chapter = flatChapters[todayIndex];
      setVerses(chapter.verses);
      setChapterTitle(`${chapter.bookName} ${chapter.chapterIndex}장`);

      const progressPercent = ((todayIndex + 1) / flatChapters.length) * 100;
      setProgress(progressPercent);
    } else {
      setVerses([]);
      setChapterTitle('통독 범위를 벗어났습니다');
      setProgress(100);
    }
  }, [selectedDate, bibleData]);

  return (
    <div style={{ padding: '2rem', fontSize: '18px', maxWidth: '800px', margin: 'auto' }}>
      <h2>📖 오늘의 말씀</h2>
      <h3>{chapterTitle}</h3>

      {/* 버튼: 성경 버전 전환 */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setBibleVersion('ko_rev.json')}
          style={{ marginRight: '10px', padding: '0.5rem 1rem' }}
        >
          개역개정 성경
        </button>
        <button
          onClick={() => setBibleVersion('ko_mod.json')}
          style={{ padding: '0.5rem 1rem' }}
        >
          현대인의 성경
        </button>
      </div>

      {/* 말씀 내용 렌더링 */}
      <div style={{ marginBottom: '1rem' }}>
        {verses.length > 0 ? (() => {
          let verseNumber = 1;
          const elements = [];

          for (let i = 0; i < verses.length; i++) {
            let text = verses[i].trim();

            // 제목과 본문이 같은 줄에 있는 경우
            const titleMatch = text.match(/^<([^>]+)>\s*(.*)/);
            if (titleMatch) {
              const title = titleMatch[1];
              const remainingText = titleMatch[2];

              // 제목 출력
              elements.push(
                <p key={`title-${i}`} style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  marginTop: '1.5em',
                  color: '#2c3e50'
                }}>
                  {title}
                </p>
              );

              if (remainingText) {
                elements.push(
                  <p key={`verse-${i}`}>
                    <strong>{verseNumber}</strong>. {remainingText}
                  </p>
                );
                verseNumber++;
              }
            } else if (/^<.*>$/.test(text)) {
              // 제목만 있는 줄
              elements.push(
                <p key={`title-${i}`} style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  marginTop: '1.5em',
                  color: '#2c3e50'
                }}>
                  {text.replace(/[<>]/g, '')}
                </p>
              );
            } else {
              // 일반 본문
              elements.push(
                <p key={`verse-${i}`}>
                  <strong>{verseNumber}</strong>. {text}
                </p>
              );
              verseNumber++;
            }
          }

          return elements;
        })() : (
          <p>{chapterTitle}</p>
        )}
      </div>

      {/* 진행도 표시 */}
      <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
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

      {/* 달력 */}
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
