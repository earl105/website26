export default function Background() {
	return (
		<div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
			<div className="absolute inset-0 bg-[linear-gradient(180deg,_#1f1f1f_0%,_#1d1d1d_52%,_#1b1b1b_100%)]" />
			<div className="absolute inset-0 opacity-[0.06] bg-[image:linear-gradient(transparent_0,transparent_96%,rgba(255,255,255,0.18)_100%)] bg-[size:100%_12px] mix-blend-soft-light" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_64%,_rgba(0,0,0,0.16)_100%)]" />
		</div>
	);
}