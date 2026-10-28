// 랜딩 섹션 공통 틀: 앵커 id, 제목, 부제
export default function Section({
  id,
  title,
  subtitle,
  tinted = false,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-16 py-20 ${tinted ? "bg-neutral-50 dark:bg-white/[0.03]" : ""}`}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-center text-neutral-600 dark:text-neutral-300">{subtitle}</p>}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
