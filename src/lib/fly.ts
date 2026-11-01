// the small moment when gear goes on the list: a strip of tape with the item's label
// flies from the button to the gear list count in the header, and the count gives a
// little bump when it lands. people who ask for less motion only get the bump.

const BUMP: Keyframe[] = [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }];

/** the gear list count that's on screen right now (the header is sticky, so usually that one) */
function findTarget(): HTMLElement | null {
    const targets = [...document.querySelectorAll<HTMLElement>('[data-list-target]')];
    return (
        targets.find((element) => {
            const box = element.getBoundingClientRect();
            return box.width > 0 && box.bottom > 0 && box.top < window.innerHeight;
        }) ?? null
    );
}

export function flyToList(from: Element | null, label: string) {
    if (typeof window === 'undefined') return;
    const target = findTarget();
    if (!target) return;

    const bump = () => target.animate(BUMP, { duration: 380, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
    if (!from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        bump();
        return;
    }

    const tape = document.createElement('span');
    tape.setAttribute('aria-hidden', 'true');
    tape.className = 'tape-shadow fly-tape';
    const strip = document.createElement('span');
    strip.className = 'tape block font-headline whitespace-nowrap px-2.5 pt-[0.32em] pb-[0.22em] text-base';
    strip.textContent = label;
    tape.append(strip);
    document.body.append(tape);

    const start = from.getBoundingClientRect();
    const end = target.getBoundingClientRect();
    const x = start.left + start.width / 2 - tape.offsetWidth / 2;
    const y = start.top + start.height / 2 - tape.offsetHeight / 2;
    const dx = end.left + end.width / 2 - tape.offsetWidth / 2 - x;
    const dy = end.top + end.height / 2 - tape.offsetHeight / 2 - y;
    tape.style.left = `${x}px`;
    tape.style.top = `${y}px`;

    // up and over in an arc, shrinking as it lands
    const flight = tape.animate(
        [
            { transform: 'translate(0, 0) rotate(-4deg) scale(1)', opacity: 1 },
            { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 70}px) rotate(3deg) scale(0.85)`, opacity: 1, offset: 0.5 },
            { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(0.3)`, opacity: 0.3 }
        ],
        { duration: 640, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' }
    );
    flight.onfinish = () => {
        tape.remove();
        bump();
    };
    flight.oncancel = () => tape.remove();
}
