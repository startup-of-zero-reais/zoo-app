import { appendFileSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';

const randomicError = () => Math.random() * 100;

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const uploadId = formData.get('upload_id')! as string;
	const chunkIndex = parseInt(formData.get('chunk_index')! as string);
	const chunk = formData.get('chunk')! as File;
	const totalChunks = parseInt(formData.get('total_chunks')! as string);

	const uploadsDir = path.join(process.cwd(), 'uploads');

	console.log({ chunk, chunkIndex, totalChunks });

	const filePath = path.join(uploadsDir, `${uploadId}-${chunkIndex}`);

	appendFileSync(filePath, Buffer.from(await chunk.arrayBuffer()));

	if (chunkIndex + 1 === totalChunks) {
		const finalFilePath = path.join(uploadsDir, `${uploadId}-final.jpeg`);

		readdirSync(uploadsDir)
			.filter(getByUploadId(uploadId))
			.sort(byChunkIndex())
			.forEach((chunkfile) => {
				const chunkfilePath = path.join(uploadsDir, chunkfile);

				appendFileSync(finalFilePath, readFileSync(chunkfilePath));
				unlinkSync(chunkfilePath);
			});
	}

	if (randomicError() > 50) {
		return NextResponse.json(
			{ error: 'Algum erro aconteceu' },
			{ status: 400 },
		);
	}

	await new Promise((resolve) => setTimeout(resolve, 100));
	return NextResponse.json({ message: 'Chunk received!' });
}

function getByUploadId(uploadId: string) {
	return (filename: string) => filename.startsWith(uploadId);
}

function byChunkIndex() {
	return (fileA: string, fileB: string) => {
		const indexA = fileA.split('-').at(1)!;
		const indexB = fileB.split('-').at(1)!;

		return parseInt(indexA) - parseInt(indexB);
	};
}
