"use client"

import { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { CheckCircle2, XCircle, RotateCcw, Gamepad2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { completeGameAction } from "@/lib/actions/games"
import type { GameQuestion } from "@/lib/db/games"
import type { GameMode } from "@/lib/types"

interface GameSessionProps {
  questions: GameQuestion[]
  mode: GameMode
  modeLabel: string
}

function QuestionPrompt({ question }: { question: GameQuestion }) {
  const { prompt } = question

  if (prompt.type === "flashcard") {
    return (
      <div className="text-center space-y-4">
        {prompt.imageUrl && (
          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
            <img src={prompt.imageUrl} alt={prompt.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">What is the base spirit?</p>
          <h2 className="font-display text-2xl font-bold">{prompt.name}</h2>
        </div>
      </div>
    )
  }

  if (prompt.type === "ingredient_challenge") {
    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider text-center">Which cocktail uses these ingredients?</p>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          {prompt.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="size-1.5 rounded-full bg-primary shrink-0" />
              {ing}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider text-center">Name this cocktail</p>
      <div className="rounded-xl border border-border bg-card p-5 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Spirit</p>
          <p className="font-semibold text-sm">{prompt.spirit}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Method</p>
          <p className="font-semibold text-sm">{prompt.method}</p>
        </div>
        {prompt.glassware && (
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground mb-0.5">Glass</p>
            <p className="font-semibold text-sm">{prompt.glassware}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function GameResults({
  correct,
  total,
  xp,
  newBadges,
  mode,
}: {
  correct: number
  total: number
  xp: number
  newBadges: { name: string; icon: string }[]
  mode: GameMode
}) {
  const pct = Math.round((correct / total) * 100)

  const { emoji, headline, sub } =
    pct === 100 ? { emoji: "🏆", headline: "Flawless!", sub: "Perfect score. You know your stuff." } :
    pct >= 80  ? { emoji: "🎯", headline: "Nice one!", sub: "Sharp knowledge. Nearly flawless." } :
    pct >= 60  ? { emoji: "🍸", headline: "Solid!", sub: "Good shout. Keep mixing it up." } :
    pct >= 40  ? { emoji: "📚", headline: "Getting there!", sub: "A bit more practice and you'll ace it." } :
                 { emoji: "💪", headline: "Keep at it!", sub: "Every round you learn something new." }

  return (
    <div className="space-y-6">
      {/* Score hero */}
      <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
        <span className="text-5xl">{emoji}</span>
        <div>
          <h2 className="font-display text-3xl font-bold">{headline}</h2>
          <p className="text-muted-foreground text-sm mt-1">{sub}</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="font-display text-4xl font-bold">{correct}<span className="text-muted-foreground text-2xl">/{total}</span></span>
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{pct}% accuracy</span>
        </div>
      </div>

      {/* XP */}
      {xp > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="font-semibold text-sm text-primary">+{xp} XP earned</p>
            <p className="text-xs text-muted-foreground">Added to your profile</p>
          </div>
        </div>
      )}

      {/* New badges */}
      {newBadges.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
            Badge{newBadges.length > 1 ? "s" : ""} unlocked 🎉
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {newBadges.map((b) => (
              <div key={b.name} className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1.5">
                <span>{b.icon}</span>
                <span className="text-xs font-semibold text-primary">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/games/${mode}`}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all text-sm font-bold"
        >
          <RotateCcw className="size-4" /> Play again
        </Link>
        <Link
          href="/games"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors text-sm font-medium"
        >
          <Gamepad2 className="size-4" /> All games
        </Link>
      </div>
    </div>
  )
}

export function GameSession({ questions, mode, modeLabel }: GameSessionProps) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<{ xp: number; newBadges: { name: string; icon: string }[] } | null>(null)
  const [isPending, startTransition] = useTransition()

  const question = questions[index]
  const total = questions.length
  const progress = (index / total) * 100

  function handleSelect(option: string) {
    if (selected !== null || isPending) return

    const isCorrect = option === question.correctAnswer
    const newScore = isCorrect ? score + 1 : score
    setSelected(option)
    if (isCorrect) setScore(newScore)

    setTimeout(() => {
      if (index + 1 >= total) {
        startTransition(async () => {
          const res = await completeGameAction(mode, newScore, total)
          res.newBadges.forEach((b) => toast.success(`${b.icon} Badge unlocked: ${b.name}`))
          setResults(res)
        })
      } else {
        setIndex((i) => i + 1)
        setSelected(null)
      }
    }, 900)
  }

  if (results) {
    return <GameResults correct={score} total={total} xp={results.xp} newBadges={results.newBadges} mode={mode} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{modeLabel}</span>
          <span>{index + 1} / {total}</span>
        </div>
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Prompt */}
      <QuestionPrompt question={question} />

      {/* Options */}
      <div className="grid grid-cols-2 gap-2.5">
        {question.options.map((option) => {
          const isSelected = selected === option
          const isCorrect = option === question.correctAnswer
          const showResult = selected !== null

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={cn(
                "p-3.5 rounded-xl border text-sm font-medium text-left transition-all leading-snug",
                !showResult && "border-border bg-card hover:border-primary/40 hover:bg-primary/5 active:scale-[0.97]",
                showResult && isCorrect && "border-emerald-500/60 bg-emerald-500/10 text-emerald-400",
                showResult && isSelected && !isCorrect && "border-rose-500/60 bg-rose-500/10 text-rose-400",
                showResult && !isSelected && !isCorrect && "border-border bg-card opacity-35",
              )}
            >
              <span className="flex items-center gap-2">
                {showResult && isCorrect && <CheckCircle2 className="size-3.5 shrink-0" />}
                {showResult && isSelected && !isCorrect && <XCircle className="size-3.5 shrink-0" />}
                {option}
              </span>
            </button>
          )
        })}
      </div>

      <Link
        href="/games"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
      >
        <X className="size-3.5" /> Quit game
      </Link>
    </div>
  )
}
