'use client'

export default function popoaError({ error, reset }: { error: Error, reset: () => void }) {
	return (
		<div className="error">
			<h2>Ocurrió un error en popoa</h2>
			<p>{error.message}</p>
			<button onClick={reset}>Reintentar</button>
		</div>
	);
}
