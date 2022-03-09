import fs from 'fs';
import path from 'path';
import { ProjectVersion } from './models';
import { SubdirObj, FileObj } from './models';

export function saveData(data: ProjectVersion, location: string) {
	// Saves data to file

	function writeContent(object: SubdirObj | FileObj, startDir: string = '') {
		const newDir = path.join(startDir, object.name);
		if ('file_content' in object) {
			// If we have reached the end of the structure
			const filePath = newDir;
			const parentDir = path.dirname(filePath);

			if (!fs.existsSync(parentDir)) {
				fs.mkdirSync(parentDir, { recursive: true });
			}
			fs.writeFileSync(filePath, object.file_content);
		} else {
			const keys = Object.keys(object.subdir);
			keys.forEach((key) => {
				writeContent(object.subdir[key].data, newDir);
			});
		}
	}

	Object.keys(data).forEach((key) => {
		writeContent(data[key].data, location);
	});
}
