"use client";

export default function AnimationControls({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  dict,
}: {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  dict: { previous: string; next: string; step: string; of: string };
}) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              i === currentStep
                ? "bg-emerald-500 scale-125"
                : i < currentStep
                ? "bg-emerald-300 dark:bg-emerald-700"
                : "bg-zinc-300 dark:bg-zinc-600"
            }`}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-lg font-medium text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {dict.previous}
        </button>

        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {currentStep + 1} / {totalSteps}
        </span>

        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {dict.next}
        </button>
      </div>
    </div>
  );
}
