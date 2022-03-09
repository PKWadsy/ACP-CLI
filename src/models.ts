export interface Project {
	id: number;
	name: string;
	location: string;
	creator: number;
	versions: {
		version_number: number;
		tag: string;
		hidden: boolean;
	}[];
	institute: { id: number; name: string };
	order: number;
}

export interface SubdirObj {
	name: string;
	subdir: {
		[subdirName: string]: {
			data: SubdirObj | FileObj;
		};
	};
}

export interface FileObj {
	name: string;
	file_content: string;
}

export interface ProjectVersion {
	[dirname: string]: {
		data: SubdirObj;
	};
}
