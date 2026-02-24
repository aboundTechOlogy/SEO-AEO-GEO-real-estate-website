/**
 * SVG icon set matching Chad Carroll's sf-icon-* icon font.
 * Each icon is a React component that accepts className for sizing/color.
 */

interface IconProps {
  className?: string;
}

function I({ className = "w-4 h-4", children, viewBox = "0 0 24 24", fill }: IconProps & { children: React.ReactNode; viewBox?: string; fill?: boolean }) {
  return fill ? (
    <svg className={className} viewBox={viewBox} fill="currentColor">
      {children}
    </svg>
  ) : (
    <svg className={className} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/* ---- Search bar / filter icons ---- */

export function IconFilter({ className }: IconProps) {
  return (
    <I className={className}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </I>
  );
}

export function IconGridFlat({ className }: IconProps) {
  return (
    <I className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </I>
  );
}

export function IconMapFlat({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
    </I>
  );
}

export function IconListFlat({ className }: IconProps) {
  return (
    <I className={className}>
      <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2.5" />
      <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2.5" />
      <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2.5" />
      <line x1="7" y1="6" x2="21" y2="6" />
      <line x1="7" y1="12" x2="21" y2="12" />
      <line x1="7" y1="18" x2="21" y2="18" />
    </I>
  );
}

export function IconDisketteFlat({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </I>
  );
}

export function IconSearchFlat({ className }: IconProps) {
  return (
    <I className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </I>
  );
}

/* ---- Property card icons ---- */

export function IconBed({ className }: IconProps) {
  return (
    <I className={className} viewBox="0 0 24 24">
      <path d="M3 7v11" />
      <path d="M21 7v11" />
      <path d="M3 18h18" />
      <path d="M3 11h18" />
      <path d="M3 7h4a2 2 0 0 1 2 2v2H3V7Z" />
      <path d="M15 7h4a2 2 0 0 1 2 2v2h-6V7Z" />
    </I>
  );
}

export function IconBath({ className }: IconProps) {
  return (
    <I className={className} viewBox="0 0 24 24">
      <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1Z" />
      <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
      <path d="M4 21l1-1.5" />
      <path d="M20 21l-1-1.5" />
    </I>
  );
}

export function IconRuler({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </I>
  );
}

/* ---- Detail panel actions ---- */

export function IconClose({ className }: IconProps) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="m256-168-88-88 224-224-224-224 88-88 224 224 224-224 88 88-224 224 224 224-88 88-224-224-224 224Z" />
    </svg>
  );
}

export function IconLove({ className, active }: IconProps & { active?: boolean }) {
  return active ? (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="m479-74-81-73q-105-94-173.5-163t-108-124Q77-489 61-536t-16-98q0-109 72.5-182T299-889q51 0 97 18t83 53q37-35 83-53t97-18q109 0 182.5 73T915-634q0 50-15.5 97T844-435.5q-40 54.5-109 124T560-147l-81 73Z" />
    </svg>
  ) : (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="m479-74-81-73q-105-94-173.5-163t-108-124Q77-489 61-536t-16-98q0-108.95 72.74-181.98Q190.47-889 299-889q50.93 0 96.97 18Q442-853 479-818q37-35 83.03-53 46.04-18 96.97-18 109.38 0 182.69 73.02Q915-742.95 915-634q0 50-15.5 97T844-435.5q-40 54.5-109 124T560-147l-81 73Zm0-169q94-86 154.5-145t95-103q34.5-44 47.5-77.15 13-33.15 13-65.83 0-56.02-37.01-92.52-37-36.5-92.51-36.5Q616-763 578-736.5 540-710 525-669h-91q-14.53-41-53.26-67.5Q342-763 299.27-763q-54.54 0-90.91 36.5Q172-690 172-634q0 33.76 13.44 67.99 13.44 34.24 48 78.13Q268-444 327.5-385.5 387-327 479-243Zm2-260Z" />
    </svg>
  );
}

export function IconShared({ className }: IconProps) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="M719.94-49Q657-49 613-93.04T569-200q0-7.95 1-16.48 1-8.52 3-16.52L340-369q-20 19-45.85 29.5Q268.31-329 240-329q-62.92 0-106.96-44.06Q89-417.12 89-480.06T133.04-587q44.04-44 106.96-44 28.31 0 54.15 10.5Q320-610 340-591l233-136q-2-8-3-16.52-1-8.53-1-16.48 0-62.92 44.06-106.96 44.06-44.04 107-44.04T827-866.94q44 44.06 44 107T826.96-653Q782.92-609 720-609q-28.31 0-54.15-9.5Q640-628 620-647L387-513q2 8 3 16.52 1 8.53 1 16.48 0 7.95-1 16.48-1 8.52-3 16.52l233 134q20-19 45.85-28.5Q691.69-351 720-351q62.92 0 106.96 44.06 44.04 44.06 44.04 107T826.94-93q-44.06 44-107 44Z" />
    </svg>
  );
}

export function IconOpen({ className }: IconProps) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="M212-86q-53 0-89.5-36.5T86-212v-536q0-53 36.5-89.5T212-874h268v126H212v536h536v-268h126v268q0 53-36.5 89.5T748-86H212Zm207-246-87-87 329-329H560v-126h314v314H748v-101L419-332Z" />
    </svg>
  );
}

export function IconExpand({ className }: IconProps) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="M86-86v-260h126v134h134v126H86Zm529 0v-126h133v-134h126v260H615ZM86-615v-259h260v126H212v133H86Zm662 0v-133H615v-126h259v259H748Z" />
    </svg>
  );
}

export function IconFullscreen({ className }: IconProps) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="M86-86v-260h126v134h134v126H86Zm529 0v-126h133v-134h126v260H615ZM86-615v-259h260v126H212v133H86Zm662 0v-133H615v-126h259v259H748Z" />
    </svg>
  );
}

export function IconFullscreenExit({ className }: IconProps) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="M220-86v-134H86v-126h260v260H220Zm395 0v-260h259v126H741v134H615ZM86-615v-126h134v-133h126v259H86Zm529 0v-259h126v133h133v126H615Z" />
    </svg>
  );
}

/* ---- Detail panel data icons ---- */

export function IconHouseSale({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M2.25 12l8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </I>
  );
}

export function IconDetailInfo({ className }: IconProps) {
  return (
    <I className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5v5.25" />
      <path d="M12 7.5h.01" strokeWidth="2.5" />
    </I>
  );
}

export function IconDetailDepartment({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M3.75 21h16.5" />
      <path d="M4.5 3h15" />
      <path d="M5.25 3v18m13.5-18v18" />
      <path d="M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15" />
      <path d="M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </I>
  );
}

export function IconDetailTool({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877" />
      <path d="m11.42 15.17 2.496-3.03c.317-.384.74-.626 1.208-.766" />
      <path d="m11.42 15.17-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63" />
      <path d="M15.124 11.374c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
    </I>
  );
}

export function IconDetailCounty({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M9 6.75V15m6-6v8.25" />
      <path d="m15.503 20.748 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </I>
  );
}

export function IconDollar({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </I>
  );
}

export function IconTimeClock({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </I>
  );
}

export function IconCalendar({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </I>
  );
}

export function IconBuild({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
    </I>
  );
}

export function IconLocation({ className }: IconProps) {
  return (
    <I className={className} fill>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2.25c-4.556 0-8.25 3.694-8.25 8.25 0 7.142 7.5 11.25 7.5 11.25s7.5-4.108 7.5-11.25c0-4.556-3.694-8.25-8.25-8.25Zm0 11.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </I>
  );
}

/* ---- Media/gallery icons ---- */

export function IconCamera({ className }: IconProps) {
  return (
    <I className={className} fill>
      <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.055.77.113 1.152.176A2.678 2.678 0 0 1 22.5 9.574V18a2.75 2.75 0 0 1-2.75 2.75h-15A2.75 2.75 0 0 1 2 18V9.574c0-1.312.924-2.45 2.199-2.688.382-.063.766-.121 1.152-.176a1.81 1.81 0 0 0 1.11-.71l.822-1.316A2.692 2.692 0 0 1 9.344 3.07ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" />
    </I>
  );
}

export function IconStreetView({ className }: IconProps) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.56-.89-1.68-1.25-2.65-.84L6 8.3V13h2V9.6l1.8-.7" />
    </svg>
  );
}

export function IconVirtual360({ className }: IconProps) {
  return (
    <I className={className} fill>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 1.545a8.264 8.264 0 0 0-7.467 5.455h3.832c.252-2.166.874-4.04 1.8-5.178a8.228 8.228 0 0 1 1.835-.277Zm1.06 0c.64.063 1.262.148 1.835.277.926 1.138 1.548 3.012 1.8 5.178h3.832a8.264 8.264 0 0 0-7.467-5.455ZM10.58 9.25c.235-1.826.76-3.33 1.42-4.26.66.93 1.185 2.434 1.42 4.26h-2.84Zm-1.513 0H5.503a8.226 8.226 0 0 0-.75 2.75 8.226 8.226 0 0 0 .75 2.75h3.564c-.15-.87-.234-1.793-.234-2.75s.084-1.88.234-2.75Zm1.357 0c-.162.868-.257 1.792-.257 2.75s.095 1.882.257 2.75h2.152c.162-.868.257-1.792.257-2.75s-.095-1.882-.257-2.75h-2.152Zm3.509 0c.15.87.234 1.793.234 2.75s-.084 1.88-.234 2.75h3.564a8.226 8.226 0 0 0 .75-2.75 8.226 8.226 0 0 0-.75-2.75h-3.564ZM11.47 20.205a8.264 8.264 0 0 1-7.467-5.455h3.832c.252 2.166.874 4.04 1.8 5.178a8.228 8.228 0 0 0 1.835.277Zm1.06 0a8.228 8.228 0 0 0 1.835-.277c.926-1.138 1.548-3.012 1.8-5.178h3.832a8.264 8.264 0 0 1-7.467 5.455ZM13.42 14.75c-.235 1.826-.76 3.33-1.42 4.26-.66-.93-1.185-2.434-1.42-4.26h2.84Z" />
    </I>
  );
}

/* ---- Map tool icons ---- */

export function IconDraw({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
      <path d="M19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </I>
  );
}

export function IconSatellite({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
      <path d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </I>
  );
}

/* ---- Navigation arrows ---- */

export function IconChevronLeft({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M15.75 19.5L8.25 12l7.5-7.5" />
    </I>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </I>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </I>
  );
}

/* ---- Contact ---- */

export function IconPhone({ className }: IconProps) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="M800-86q-131 0-259-57T307-305Q201-411 144-539.5T87-799q0-32 21-53.5t53-21.5h161q37 0 60 18t31 52l25 119q6 31-.5 53T411-593l-103 90q16 26 37.5 52.5T396-396q26 26 50 45.5t48 33.5l101-98q20-19 44.5-25.5t53.5-.5l111 25q35 10 52.5 31t17.5 55v169q0 32-21.5 53.5T800-86Z" />
    </svg>
  );
}

export function IconEnvelope({ className }: IconProps) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 -960 960 960" fill="currentColor">
      <path d="M172-126q-53 0-89.5-36.5T46-252v-456q0-53 36.5-89.5T172-834h616q53 0 89.5 36.5T914-708v456q0 53-36.5 89.5T788-126H172Zm308-271 308-200v-111L480-508 172-708v111l308 200Z" />
    </svg>
  );
}
