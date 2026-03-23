export interface ParsedPoem {
  title: string | null;
  body: string;
  titlePosition: 'top' | 'bottom' | null;
}

/**
 * 시에서 제목과 본문을 파싱합니다.
 *
 * 제목 인식 패턴:
 * 상단 제목:
 * 1. 첫 줄이 짧고(30자 이하) 두 번째 줄이 빈 줄인 경우
 * 2. 첫 줄이 <제목> 또는 [제목] 형식인 경우
 * 3. 첫 줄이 "제목:" 으로 시작하는 경우
 *
 * 하단 제목 (SNS 스타일):
 * 1. 마지막 줄이 짧고(30자 이하) 그 위에 빈 줄이 있는 경우
 */
export const parsePoem = (rawPoem: string): ParsedPoem => {
  if (!rawPoem || rawPoem.trim() === '') {
    return { title: null, body: '', titlePosition: null };
  }

  const lines = rawPoem.trim().split('\n');

  if (lines.length === 0) {
    return { title: null, body: '', titlePosition: null };
  }

  const firstLine = lines[0].trim();
  const lastLine = lines[lines.length - 1].trim();

  // 상단 제목 패턴 1: <제목> 또는 [제목] 형식
  const bracketMatch = firstLine.match(/^[<\[「『](.+)[>\]」』]$/);
  if (bracketMatch) {
    const title = bracketMatch[1].trim();
    const body = lines.slice(1).join('\n').trim();
    return { title, body, titlePosition: 'top' };
  }

  // 상단 제목 패턴 2: "제목:" 또는 "Title:" 으로 시작
  const colonMatch = firstLine.match(/^(?:제목|Title|題目)\s*[:：]\s*(.+)$/i);
  if (colonMatch) {
    const title = colonMatch[1].trim();
    const body = lines.slice(1).join('\n').trim();
    return { title, body, titlePosition: 'top' };
  }

  // 하단 제목 패턴: 마지막 줄이 짧고, 그 위에 빈 줄이 있는 경우 (SNS 스타일)
  if (lines.length >= 3) {
    const secondLastLine = lines[lines.length - 2].trim();
    const isSecondLastEmpty = secondLastLine === '';
    const isSecondLastSeparator = /^[-─—=_]{2,}$/.test(secondLastLine);

    if (lastLine.length <= 30 && (isSecondLastEmpty || isSecondLastSeparator)) {
      // 마지막 줄에 동사 어미가 없으면 제목으로 간주
      const hasVerbEnding = /[다요죠네]$/.test(lastLine);
      if (!hasVerbEnding) {
        const title = lastLine;
        const endIndex = isSecondLastSeparator ? lines.length - 2 : lines.length - 2;
        const body = lines.slice(0, endIndex).join('\n').trim();
        return { title, body, titlePosition: 'bottom' };
      }
    }
  }

  // 상단 제목 패턴 3: 첫 줄이 짧고(30자 이하), 다음 줄이 빈 줄이거나 구분선인 경우
  if (lines.length >= 2) {
    const secondLine = lines[1].trim();
    const isSecondLineEmpty = secondLine === '';
    const isSecondLineSeparator = /^[-─—=_]{2,}$/.test(secondLine);

    if (firstLine.length <= 30 && (isSecondLineEmpty || isSecondLineSeparator)) {
      // 첫 줄에 동사나 조사가 많으면 제목이 아닐 가능성이 높음
      const hasVerbEnding = /[다요죠네]$/.test(firstLine);
      if (!hasVerbEnding) {
        const title = firstLine;
        const startIndex = isSecondLineSeparator ? 2 : (isSecondLineEmpty ? 2 : 1);
        const body = lines.slice(startIndex).join('\n').trim();
        return { title, body, titlePosition: 'top' };
      }
    }
  }

  // 제목을 찾지 못한 경우
  return { title: null, body: rawPoem.trim(), titlePosition: null };
};

/**
 * 시 본문에서 빈 줄을 기준으로 연(stanza)을 분리합니다.
 */
export const splitIntoStanzas = (body: string): string[] => {
  return body.split(/\n\s*\n/).filter(stanza => stanza.trim() !== '');
};
