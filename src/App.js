import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/bible.json")
      .then(res => res.json())
      .then(json => {
        const start = new Date("2025-01-01");
        const today = new Date();
        const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const books = Object.keys(json);
        let count = 0;

        for (let i = 0; i < books.length; i++) {
          const chapters = json[books[i]];
          for (let j = 0; j < chapters.length; j++) {
            if (count === diff) {
              setData({ book: books[i], chapter: j, verses: chapters[j] });
              return;
            }
            count++;
          }
        }
      });
  }, []);

  if (!data) return <div className="p-4">불러오는 중...</div>;

  return (
    <main className="p-6 max-w-xl mx-auto text-lg leading-8">
      <h1 className="text-2xl font-bold mb-4">
        📖 오늘의 말씀 - {data.book} {data.chapter + 1}장
      </h1>
      <div className="space-y-2">
        {data.verses.map((v, i) => (
          <p key={i}>
            <strong>{i + 1}.</strong> {v}
          </p>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            navigator.clipboard.writeText(
              `오늘의 말씀: ${data.book} ${data.chapter + 1}장\nhttps://your-daily-bible.vercel.app/`
            );
            alert("공유 링크가 복사되었습니다!");
          }}
        >
          📤 카카오톡에 공유하기
        </button>
      </div>
    </main>
  );
}
