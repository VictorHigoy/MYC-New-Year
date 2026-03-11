Overview

A promotional single-page app for BP9's New Year campaign featuring a scroll-locked hero section, an interactive slot machine, and win/registration modals.

Layout & Responsive Approach

All sections use min-h-screen with bg-cover backgrounds and a max-w wrapper to cap content on large screens. Images scale using w-full h-auto or percentage-based widths so everything shrinks proportionally without breakpoints. The slot machine reels are sized dynamically via ResizeObserver so they always match the machine's rendered dimensions at any viewport. Form inputs use clamp() for font size and padding to scale fluidly inside the fixed-size modal. The pop-in entrance animation is defined in globals.css and reused across both modals.

State & Navigation

All shared state (spinning, showModal, openForm, unlocked) lives in page.tsx and is passed down as props, avoiding the overhead of Context or a state library for a single-page app. On initial load, document.body.style.overflow = "hidden" locks the page. Clicking the hero CTA unlocks scroll, persists the state to localStorage (so refresh doesn't re-lock), and smooth-scrolls to #slot-machine-section.

Assumptions & Tradeoffs

requestAnimationFrame is used instead of CSS transitions for the reel animation to allow frame-accurate control over easing and the "almost miss" overshoot effect on reel 3. STOP_INDICES are fixed so the wheel always lands on a jackpot, intentional for the promotional context. The form submission uses a setTimeout mock in place of a real API endpoint, which is project-specific and should be replaced.
