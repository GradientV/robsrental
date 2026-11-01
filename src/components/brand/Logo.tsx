// stand-in logo: "ROB'S RENTALS" on a strip of camera tape, after the
// tape-and-navy labels in Rob's own photos. swap for his real logo file when we get it
import TapeLabel from './TapeLabel';

export default function Logo({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' }) {
    return (
        <TapeLabel size={size} tilt={-1.5}>
            Rob’s Rentals
        </TapeLabel>
    );
}
