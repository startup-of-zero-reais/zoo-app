import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { NextRequest, NextResponse } from 'next/server';
import { Taxonomy } from '@/lib/openai/schemas/species.response';

const openai = new OpenAI();

export async function POST(request: NextRequest) {
	const body = await request.formData();
	const commonName = body.get('commonName');

	if (!commonName) {
		return NextResponse.json(null, { status: 400 });
	}

	const completition = await openai.beta.chat.completions.parse({
		model: 'gpt-4o-mini-2024-07-18',
		messages: [
			{
				role: 'system',
				content:
					'Te informarei o nome popular de uma espécie e preciso que você enumere para mim, a classe taxonômica, ordem taxonômica e nome científico',
			},
			{ role: 'user', content: `${commonName}` },
		],
		response_format: zodResponseFormat(Taxonomy, 'event'),
	});

	const event = completition.choices[0].message.parsed;
	return NextResponse.json(event);
}
