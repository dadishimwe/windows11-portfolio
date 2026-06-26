export type MediaType = {
	filename: string;
	thumbnail: string;
	secure_url: string;
	format: string;
	public_id: string;
	url: string;
};

export type PdfDocument = {
	title: string;
	fileName: string;
	pdfUrl: string;
	downloadUrl: string;
	public_id: string;
	format: string;
	thumbnailUrl?: string;
};

export type ErrorType = {
	error: string;
	index: number;
};

export type HistoryType = {
	input: string;
	response: string | null;
	promptPath?: string;
};

export type ProjectType = {
	fork: boolean;
	full_name: string;
	id: number;
	html_url: string;
	name: string;
	updated_at: string;
	size: number;
};
