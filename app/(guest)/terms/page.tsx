import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection, Ul } from "@/components/legal/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "이용약관 | Rehearview" };

// 이 문서의 내용은 실제 구현과 맞아야 한다. 하루 이용 한도 등을 바꾸면 이 문서도 함께 고친다.
export default function TermsPage() {
  return (
    <LegalPage title="이용약관">
      <LegalSection id="purpose" title="제1조 (목적)">
        <p>
          이 약관은 {LEGAL.operator}(이하 &quot;운영자&quot;)가 제공하는 {LEGAL.serviceName}(이하 &quot;서비스&quot;)의 이용과 관련하여 운영자와 이용자의 권리, 의무 및 책임 사항을 정하는 것을 목적으로
          합니다.
        </p>
      </LegalSection>

      <LegalSection id="definitions" title="제2조 (용어의 뜻)">
        <Ul>
          <li>&quot;서비스&quot;란 이용자가 서류와 채용 공고를 바탕으로 AI 면접관과 모의면접을 연습하고 리포트를 받을 수 있게 하는 웹 서비스를 말합니다.</li>
          <li>&quot;이용자&quot;란 이 약관에 따라 서비스를 이용하는 회원을 말합니다.</li>
          <li>&quot;콘텐츠&quot;란 이용자가 서비스에 올리거나 입력한 서류, 채용 공고, 답변 등의 내용을 말합니다.</li>
        </Ul>
      </LegalSection>

      <LegalSection id="effect" title="제3조 (약관의 효력과 변경)">
        <p>
          이 약관은 서비스 화면에 게시함으로써 효력이 생깁니다. 운영자는 필요한 경우 관련 법령을 해치지 않는 범위에서 약관을 바꿀 수 있으며, 바꾸는 경우 시행 7일 전에(이용자에게 불리한 변경은
          30일 전에) 서비스 안에서 알립니다. 이용자가 변경된 약관에 동의하지 않으면 서비스 이용을 멈추고 계정을 삭제할 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection id="account" title="제4조 (가입과 계정)">
        <Ul>
          <li>만 14세 이상이면 이메일 또는 소셜 로그인(GitHub, Google, 카카오, 네이버)으로 가입할 수 있습니다.</li>
          <li>가입할 때(소셜 로그인은 처음 로그인한 직후) 이용약관, 개인정보 수집·이용(외부 AI 서비스 전송 포함), 만 14세 이상 확인에 동의해야 서비스를 이용할 수 있습니다. 동의한 문서의 버전과 시각은 기록되며, 문서가 바뀌면 다시 동의를 받을 수 있습니다.</li>
          <li>이용자는 본인의 정보로 가입해야 하며, 계정과 비밀번호를 안전하게 관리할 책임이 있습니다.</li>
          <li>계정이 도용되었거나 도용이 의심되면 지체 없이 비밀번호를 바꾸고 운영자에게 알려야 합니다.</li>
        </Ul>
      </LegalSection>

      <LegalSection id="service" title="제5조 (서비스의 내용)">
        <Ul>
          <li>서류와 채용 공고 분석, 분석 결과(면접 준비 브리프) 확인과 수정</li>
          <li>AI 면접관의 질문과 꼬리질문, 음성 또는 글자 답변</li>
          <li>면접 리포트(점수와 총평)와 면접 기록 보관</li>
        </Ul>
      </LegalSection>

      <LegalSection id="beta" title="제6조 (무료 베타와 이용 제한)">
        <p>
          서비스는 현재 <b>무료 베타</b>로 제공됩니다. 서비스의 안정과 공정한 이용을 위해 하루 이용 횟수를 제한할 수 있습니다. (현재 기준: 면접 시작 하루 5회, 서류 분석 하루 20회, 공고 주소
          불러오기 하루 30회이며 운영 상황에 따라 바뀔 수 있습니다.)
        </p>
        <p>
          운영자는 서비스의 전부 또는 일부를 바꾸거나 중단할 수 있으며, 이용자에게 중대한 영향이 있는 경우에는 미리 서비스 안에서 알립니다. 외부 AI 서비스의 장애나 한도 초과로 서비스가 일시적으로
          느려지거나 이용할 수 없을 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection id="duty" title="제7조 (이용자의 의무)">
        <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
        <Ul>
          <li>다른 사람의 개인정보나 비밀 정보를 동의 없이 서류·공고·답변으로 입력하는 행위</li>
          <li>타인의 저작권 등 권리를 침해하거나 법령에 어긋나는 내용을 입력하는 행위</li>
          <li>자동화 도구 등으로 이용 한도를 우회하거나 서비스에 과도한 부담을 주는 행위</li>
          <li>공고 주소 불러오기 기능으로 내부 시스템이나 허용되지 않은 대상에 접근하려는 행위</li>
          <li>서비스의 운영을 방해하거나 다른 이용자의 이용을 해치는 행위</li>
        </Ul>
      </LegalSection>

      <LegalSection id="content" title="제8조 (콘텐츠의 권리와 처리)">
        <Ul>
          <li>이용자가 입력한 콘텐츠의 권리는 이용자에게 있습니다.</li>
          <li>
            운영자는 서비스를 제공하는 데 필요한 범위에서만 콘텐츠를 처리하며, 서류와 채용 공고의 원문은 서버에 저장하지 않습니다. 질문·답변·리포트는 이용자가 다시 볼 수 있도록 저장하며
            이용자가 언제든 삭제할 수 있습니다.
          </li>
          <li>
            서류와 공고 내용은 분석과 질문 생성을 위해 외부 AI 서비스로 전송됩니다. 무료 AI 서비스를 이용하는 동안에는 AI 제공사가 입력된 내용을 서비스 개선에 사용할 수 있으므로 민감한 정보는
            제외하고 입력해 주세요. 자세한 내용은 <Link href="/privacy" className="text-violet-600 underline dark:text-violet-300">개인정보처리방침</Link>을 확인해 주세요.
          </li>
        </Ul>
      </LegalSection>

      <LegalSection id="ai" title="제9조 (AI 결과에 관한 안내)">
        <Ul>
          <li>질문, 분석, 점수, 총평은 AI가 만든 것으로 사실과 다르거나 부정확할 수 있으며, 연습과 참고를 위한 것입니다.</li>
          <li>서비스의 결과는 실제 면접이나 채용 결과를 예측하거나 보장하지 않으며, 법률·인사·진로에 대한 전문적인 조언이 아닙니다.</li>
          <li>AI가 정리한 면접 준비 브리프의 내용이 사실과 다르면 이용자가 직접 확인하고 고쳐야 합니다.</li>
        </Ul>
      </LegalSection>

      <LegalSection id="external" title="제10조 (외부 서비스)">
        <p>
          서비스는 AI 제공사, 소셜 로그인 제공사, 브라우저의 음성 기능 등 외부 서비스를 이용합니다. 외부 서비스에는 해당 서비스의 약관과 정책이 적용되며, 외부 서비스의 장애나 정책 변경으로 서비스의
          일부가 제한될 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="제11조 (계정 삭제와 이용 제한)">
        <Ul>
          <li>이용자는 언제든지 <Link href="/account" className="text-violet-600 underline dark:text-violet-300">내 계정</Link> 화면에서 계정을 삭제할 수 있으며, 삭제하면 모든 정보가 즉시 지워지고 되돌릴 수 없습니다. 다만 장애에 대비한 백업에는 최대 14일 남을 수 있습니다.</li>
          <li>운영자는 이용자가 제7조를 어기거나 서비스 운영을 심각하게 방해하는 경우 사전 안내 후 이용을 제한하거나 계정을 정지할 수 있습니다. 긴급한 경우에는 먼저 제한하고 이유를 알립니다.</li>
        </Ul>
      </LegalSection>

      <LegalSection id="ip" title="제12조 (지식재산권)">
        <p>서비스 자체(화면, 로고, 프로그램 등)에 대한 권리는 운영자에게 있습니다. 이용자는 운영자의 사전 동의 없이 이를 복제, 배포, 변경하여 이용할 수 없습니다.</p>
      </LegalSection>

      <LegalSection id="liability" title="제13조 (책임의 제한)">
        <Ul>
          <li>무료 베타로 제공되는 서비스는 현재 상태 그대로 제공되며, 운영자는 서비스가 중단 없이 오류 없이 제공될 것을 보장하지 않습니다.</li>
          <li>천재지변, 외부 서비스 장애 등 운영자가 통제할 수 없는 사유로 생긴 손해에 대해 운영자는 책임을 지지 않습니다.</li>
          <li>이용자가 입력한 콘텐츠의 내용과 그 이용 결과에 대한 책임은 이용자에게 있습니다.</li>
          <li>위 내용은 운영자의 고의 또는 중대한 과실로 생긴 손해에는 적용되지 않으며, 관련 법령이 허용하는 범위에서만 효력이 있습니다.</li>
        </Ul>
      </LegalSection>

      <LegalSection id="law" title="제14조 (준거법과 관할)">
        <p>이 약관은 대한민국 법령에 따라 해석되며, 서비스와 관련한 분쟁은 민사소송법에 따른 관할 법원에서 해결합니다.</p>
      </LegalSection>

      <LegalSection id="contact" title="문의">
        <p>서비스에 관한 문의는 {LEGAL.contactEmail} 로 보내 주세요.</p>
      </LegalSection>
    </LegalPage>
  );
}
