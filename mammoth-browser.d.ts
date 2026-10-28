// mammoth의 브라우저 번들은 타입 선언이 없어서 쓰는 부분만 선언한다
declare module "mammoth/mammoth.browser" {
  type Mammoth = { extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<{ value: string }> };
  const mammoth: Mammoth;
  export default mammoth;
  export const extractRawText: Mammoth["extractRawText"];
}
