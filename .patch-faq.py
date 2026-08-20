import pathlib

p = pathlib.Path("src/components/marketing/FaqBrowser.tsx")
s = p.read_text(encoding="utf-8")

reps = [
    # Search box: 44px tall on mobile, per the design.
    (
        '''      <div className="mt-[28px] flex items-center gap-[12px] rounded-[14px] border border-border bg-white px-[16px]">''',
        '''      <div className="mt-[16px] flex h-[44px] items-center gap-[10px] rounded-[12px] border border-[#D6DADC] bg-white px-[14px] md:mt-[28px] md:h-auto md:gap-[12px] md:rounded-[14px] md:border-border md:px-[16px]">''',
    ),
    (
        '''          className="flex-1 border-none bg-transparent py-[14px] text-14 font-semibold text-body outline-none placeholder:text-muted-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"''',
        '''          className="min-w-0 flex-1 border-none bg-transparent text-14 font-semibold text-body outline-none placeholder:text-muted-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link md:py-[14px]"''',
    ),
    (
        '''            className="inline-flex h-[24px] w-[24px] shrink-0 cursor-pointer items-center justify-center rounded-pill bg-surface-alt text-12 text-muted"''',
        '''            className="inline-flex h-[28px] w-[28px] shrink-0 cursor-pointer items-center justify-center rounded-pill bg-[#F1F3F2] text-13 text-muted md:h-[24px] md:w-[24px] md:text-12"''',
    ),
    # Categories: a scrolling chip row on mobile, the sticky rail from md up.
    (
        '''      <div className="mt-[44px] flex flex-wrap items-start gap-[clamp(28px,4vw,64px)]">
        <div className="flex-[1_1_200px] self-stretch">
          <nav className="sticky top-[72px] flex flex-col">
            <div className="pb-[12px] text-11 font-bold tracking-[0.14em] text-muted-3">
              CATEGORIES
            </div>''',
        '''      <div className="mt-[16px] flex flex-wrap items-start gap-[clamp(28px,4vw,64px)] md:mt-[44px]">
        <div className="-mx-[20px] w-[calc(100%+40px)] md:mx-0 md:w-auto md:flex-[1_1_200px] md:self-stretch">
          <nav className="flex gap-[8px] overflow-x-auto px-[20px] pb-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:sticky md:top-[72px] md:flex-col md:gap-0 md:overflow-visible md:px-0">
            <div className="hidden pb-[12px] text-11 font-bold tracking-[0.14em] text-muted-3 md:block">
              CATEGORIES
            </div>''',
    ),
    (
        '''                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="flex items-baseline justify-between gap-[12px] border-l-2 border-border py-[11px] pl-[14px] text-14 font-semibold text-muted hover:text-ink"
                >
                  {g.label}
                  <span className="text-12 font-bold text-muted-3">{count}</span>
                </a>''',
        '''                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-[7px] whitespace-nowrap rounded-pill border border-border bg-white px-[16px] text-13 font-bold text-muted hover:text-ink md:min-h-0 md:justify-between md:gap-[12px] md:rounded-none md:border-0 md:border-l-2 md:bg-transparent md:px-0 md:py-[11px] md:pl-[14px] md:text-14 md:font-semibold"
                >
                  {g.label}
                  <span className="text-12 font-bold text-muted-3">{count}</span>
                </a>''',
    ),
    (
        '''            <p className="mt-[24px] pl-[14px] text-12 leading-[1.65] text-muted-3">''',
        '''            <p className="hidden pl-[14px] text-12 leading-[1.65] text-muted-3 md:mt-[24px] md:block">''',
    ),
    # Question list rhythm.
    (
        '''            <div key={g.id} id={g.id} className="scroll-mt-[96px] pb-[36px]">
              <h2 className="mb-[4px] text-13 font-bold uppercase tracking-[0.12em] text-muted-3">''',
        '''            <div key={g.id} id={g.id} className="scroll-mt-[96px] pb-[24px] md:pb-[36px]">
              <h2 className="mb-[4px] text-12 font-bold uppercase tracking-[0.12em] text-muted-3 md:text-13">''',
    ),
    (
        '''                        className="flex w-full cursor-pointer items-center justify-between gap-[16px] py-[20px] text-left text-15_5 font-bold text-body"''',
        '''                        className="flex w-full cursor-pointer items-center justify-between gap-[16px] py-[16px] text-left text-15 font-bold text-body md:py-[20px] md:text-15_5"''',
    ),
    (
        '''                          className="flex flex-col gap-[12px] pb-[22px] pr-[40px]"''',
        '''                          className="flex flex-col gap-[12px] pb-[18px] pr-0 md:pb-[22px] md:pr-[40px]"''',
    ),
    (
        '''                          <p className="text-14 leading-[1.75] text-muted">{f.a}</p>''',
        '''                          <p className="text-13_5 leading-[1.7] text-muted md:text-14 md:leading-[1.75]">
                            {f.a}
                          </p>''',
    ),
    # The results line sits between the search box and the chips.
    (
        '''        <p className="mt-[10px] text-12_5 font-bold text-muted" aria-live="polite">''',
        '''        <p className="mt-[8px] text-12 font-bold text-muted md:mt-[10px] md:text-12_5" aria-live="polite">''',
    ),
]

for old, new in reps:
    assert old in s, old[:80]
    s = s.replace(old, new, 1)

p.write_text(s, encoding="utf-8")
print("FaqBrowser mobile done")
