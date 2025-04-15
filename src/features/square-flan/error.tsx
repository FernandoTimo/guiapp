'use client'

export default function SquareFlanError({ error, reset }: { error: Error, reset: () => void }) {
	return (
		<div className="error">
			<h2>Ocurrió un error en square-flan</h2>
			<p>{error.message}</p>
			<button onClick={reset}>Reintentar</button>
		</div>
	);
}
