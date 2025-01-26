import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	const { error, stack } = await request.json();

	const discordWebhook = process.env.DISCORD_WEBHOOK!;

	if (!discordWebhook) {
		return new Response(
			JSON.stringify({ success: true, message: 'missing webhook' }),
		);
	}

	const message = {
		content:
			`:rotating_light: **Erro capturado no App** :rotating_light:\n\n**Erro:** ${error}\n\n**Stack:**\n\`\`\`${stack.substring(0, 1000)}\`\`\``.substring(
				0,
				2000,
			),
	};

	const result = await fetch(discordWebhook, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(message),
	});

	if (!result.ok) {
		console.error('Discord webhook failed', await result.text());
		return new Response(JSON.stringify({ message: 'Not sent' }), {
			status: result.status,
		});
	}

	console.log('Webhook Sent', result);

	return new Response(JSON.stringify({ success: true }), { status: 200 });
}
