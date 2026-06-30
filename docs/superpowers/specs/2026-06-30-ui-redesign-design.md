# UI Redesign: Dark Purple Theme with Glassmorphism

**Date:** 2026-06-30  
**Status:** Implemented

## Context

The app (Hedef Kumbarası — Stellar savings goals) had a functional but visually plain UI (white cards, gray background, indigo accents). The goal was to transform it into a visually compelling crypto-wallet aesthetic inspired by reference images showing dark purple/violet themes with glassmorphism card effects.

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Theme | Dark only | Reference images, consistent product identity |
| Layout | max-w-2xl centered (preserved) | Existing structure works; only visual layer changes |
| Card style | Glassmorphism (backdrop-blur + bg-white/5) | Matches reference images |
| WalletBar | Same card weight as GoalCard | User preference: no hero section |
| Palette | `#0F0A1E` background, `#7C5AE8` violet accent | Reference image 1 |
| Implementation | Tailwind v4 `@theme` tokens | Single-source color system |

## Color System

```
--color-bg:        #0F0A1E   (page background)
--color-surface:   #1A1035   (solid card fallback)
--color-violet:    #7C5AE8   (primary accent — buttons, active tabs, progress)
--color-blue-acc:  #5B8DEF   (gradient pair)
--color-text:      #F0EAFF   (primary text, warm white)
--color-muted:     #9B8EC4   (secondary text, labels)
--color-faint:     #6B5FA8   (placeholder, timestamps, disabled)
```

## Glassmorphism Card Formula

```
backdrop-blur-xl bg-white/5 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]
```

## ProgressBar

Gradient fill (violet → blue/green) with glow shadow, h-3, track bg-white/10.

## Security

No changes to business logic, Stellar SDK validation (`StrKey.isValidEd25519PublicKey`), form validation, or XSS protection. Only CSS classes changed.

## Files Modified

- `src/index.css` — @theme token block
- `src/components/ProgressBar.tsx`
- `src/components/WalletBar.tsx`
- `src/components/GoalCard.tsx`
- `src/components/GoalTabs.tsx`
- `src/components/CreateGoalModal.tsx`
- `src/components/SendModal.tsx`
- `src/components/TransactionHistory.tsx`
- `src/components/GoalAnalytics.tsx`
- `src/components/MilestoneOverlay.tsx`
- `src/components/PrivacySettings.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/GoalDetailPage.tsx`
- `src/pages/PublicGoalPage.tsx`
