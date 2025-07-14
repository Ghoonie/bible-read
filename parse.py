import json

# Book abbreviations and Korean names (1-based index)
book_meta = [
    ("", ""),  # dummy at index 0
    ("gen", "창세기"), ("exo", "출애굽기"), ("lev", "레위기"), ("num", "민수기"), ("deu", "신명기"),
    ("jos", "여호수아"), ("jdg", "사사기"), ("rut", "룻기"), ("1sa", "사무엘상"), ("2sa", "사무엘하"),
    ("1ki", "열왕기상"), ("2ki", "열왕기하"), ("1ch", "역대상"), ("2ch", "역대하"), ("ezr", "에스라"),
    ("neh", "느헤미야"), ("est", "에스더"), ("job", "욥기"), ("psa", "시편"), ("pro", "잠언"),
    ("ecc", "전도서"), ("sng", "아가"), ("isa", "이사야"), ("jer", "예레미야"), ("lam", "예레미야애가"),
    ("ezk", "에스겔"), ("dan", "다니엘"), ("hos", "호세아"), ("jol", "요엘"), ("amo", "아모스"),
    ("oba", "오바댜"), ("jon", "요나"), ("mic", "미가"), ("nam", "나훔"), ("hab", "하박국"),
    ("zep", "스바냐"), ("hag", "학개"), ("zec", "스가랴"), ("mal", "말라기"), ("mat", "마태복음"),
    ("mrk", "마가복음"), ("luk", "누가복음"), ("jhn", "요한복음"), ("act", "사도행전"), ("rom", "로마서"),
    ("1co", "고린도전서"), ("2co", "고린도후서"), ("gal", "갈라디아서"), ("eph", "에베소서"),
    ("php", "빌립보서"), ("col", "골로새서"), ("1th", "데살로니가전서"), ("2th", "데살로니가후서"),
    ("1ti", "디모데전서"), ("2ti", "디모데후서"), ("tit", "디도서"), ("phm", "빌레몬서"),
    ("heb", "히브리서"), ("jas", "야고보서"), ("1pe", "베드로전서"), ("2pe", "베드로후서"),
    ("1jn", "요한일서"), ("2jn", "요한이서"), ("3jn", "요한삼서"), ("jud", "유다서"), ("rev", "요한계시록")
]

# 1. 초기화: 66권의 성경 책 객체 생성
bible_data = [
    {"abbrev": abbrev, "name": name, "chapters": []}
    for abbrev, name in book_meta[1:]
]

# 2. 텍스트 파일 파싱
with open("현대인의_성경.txt", "r", encoding="cp949") as f:  # ← 한글 윈도우에서 인코딩 주의
    for line in f:
        line = line.strip()
        if not line:
            continue

        try:
            book_num_str, rest = line.split(" ", 1)
            if ":" not in rest or rest.startswith("0:0"):
                continue
            book_num = int(book_num_str)
            if not (1 <= book_num <= 66):
                continue  # 유효한 책 번호만 처리

            chapter_verse, verse_text = rest.split(" ", 1)
            chapter_str, verse_str = chapter_verse.split(":")
            chapter = int(chapter_str)
            verse = int(verse_str)

            # 올바른 책 접근
            book = bible_data[book_num - 1]

            # 필요한 만큼 챕터 리스트 확장
            while len(book["chapters"]) < chapter:
                book["chapters"].append([])

            verses = book["chapters"][chapter - 1]

            # 필요한 만큼 절 리스트 확장
            while len(verses) < verse:
                verses.append("")

            # 해당 절에 텍스트 저장
            verses[verse - 1] = verse_text

        except Exception as e:
            print(f"⚠️ 오류 발생: {line} → {e}")
            continue  # 잘못된 줄 무시

# 3. JSON 파일로 저장
with open("bible_ko_formatted.json", "w", encoding="utf-8") as out:
    json.dump(bible_data, out, ensure_ascii=False, indent=2)

print("✅ 변환 완료! → bible_ko_formatted.json 생성됨")
