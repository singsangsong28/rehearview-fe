// 서류 파일에서 텍스트를 뽑는다. 파일은 서버로 보내지 않고 브라우저 안에서만 처리한다.
// 무거운 파서는 파일을 고른 순간에만 불러온다 (dynamic import).
const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function extractText(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) throw new Error("파일이 너무 커요 (10MB 이하)");
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return extractPdf(file);
  if (name.endsWith(".docx")) return extractDocx(file);
  if (name.endsWith(".txt")) return file.text();
  throw new Error("PDF, DOCX, TXT 파일만 올릴 수 있어요");
}

async function extractPdf(file: File) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // 워커는 public/pdfjs 에 복사해 둔 파일을 쓴다. pdfjs-dist 버전을 올리면 이 파일도 같이 교체해야 한다
  // (cp node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs public/pdfjs/)
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    pages.push(content.items.map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "")).join(""));
  }
  return pages.join("\n\n");
}

async function extractDocx(file: File) {
  const mod = await import("mammoth/mammoth.browser");
  const mammoth = mod.default ?? mod;
  return (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
}
