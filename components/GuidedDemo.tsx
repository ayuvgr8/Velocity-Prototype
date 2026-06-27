"use client";

export type DemoStep = { title: string; body: string };

export function GuidedDemo({
  step,
  total,
  content,
  onPrev,
  onNext,
  onExit,
}: {
  step: number;
  total: number;
  content: DemoStep;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  const atEnd = step === total - 1;
  const progress = Math.round(((step + 1) / total) * 100);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-[22px]">
      <div className="pointer-events-auto w-[min(760px,94vw)] overflow-hidden rounded-[16px] bg-dark text-cream shadow-[0_26px_70px_-20px_rgba(0,0,0,0.65)]">
        <div className="h-[3px] bg-[#2a2620]">
          <div
            className="h-full bg-orange transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-[15px] px-[18px] py-[15px]">
          <div className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-[11px] bg-purple font-display text-[16px] font-semibold text-panel">
            {step + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-[9px]">
              <span className="font-mono text-[9.5px] tracking-[0.14em] text-[#B5ABF5]">
                GUIDED DEMO · {step + 1}/{total}
              </span>
              <span className="font-display text-[14.5px] font-semibold text-cream">
                {content.title}
              </span>
            </div>
            <div className="mt-1 text-[12.5px] leading-[1.45] text-[#C6C0B4]">
              {content.body}
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-[7px]">
            <button
              onClick={onPrev}
              disabled={step === 0}
              className="rounded-[9px] border border-[#3a352c] bg-transparent px-3 py-2 font-sans text-[12.5px] text-[#C6C0B4] transition hover:bg-white/5 disabled:opacity-40"
            >
              ← Back
            </button>
            {atEnd ? (
              <button
                onClick={onExit}
                className="rounded-[9px] border-none bg-orange px-4 py-[9px] font-display text-[12.5px] font-semibold text-dark"
              >
                Finish ✓
              </button>
            ) : (
              <button
                onClick={onNext}
                className="rounded-[9px] border-none bg-purple px-4 py-[9px] font-display text-[12.5px] font-semibold text-panel"
              >
                Next →
              </button>
            )}
            <button
              onClick={onExit}
              className="px-1.5 py-1 text-[15px] leading-none text-[#8a8475]"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
