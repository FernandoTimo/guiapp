/* 'use client' obligatorio en error.tsx */
'use client'

export default function ala mielError({ error, reset }: { error: Error, reset: () => void }) {
	return (
		<div className="error">
			<h2>Ocurrió un error en ala-miel</h2>
			<p>{error.message}</p>
			<button onClick={reset}>Reintentar</button>
		</div>
	);
}
