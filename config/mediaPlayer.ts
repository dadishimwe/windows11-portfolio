import { MediaKind } from '../lib/mediaPlayerMessages';
import { MediaType } from '../typings';

export type MediaPlayerState = {
	isOpen: boolean;
	media: MediaType | null;
	kind: MediaKind;
};

export const initialMediaPlayerState: MediaPlayerState = {
	isOpen: false,
	media: null,
	kind: 'image',
};
