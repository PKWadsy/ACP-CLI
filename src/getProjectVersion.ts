import axios from 'axios';
import { ProjectVersion } from './models';

export async function getProjectVersion(
	token: string,
	id: number,
	versionNumber: number
): Promise<ProjectVersion | null> {
	const data = await axios
		.get(
			`https://acp.foe.auckland.ac.nz/API/download_project/?client=webide&json=True&projectID=${id}&versionNumber=${versionNumber}&webide=True`,
			{
				headers: {
					Authorization: `Token ${token}`,
				},
			}
		)
		.then((res) => {
			if (res.status === 200) {
				return res.data.data as ProjectVersion;
			}
			return null;
		});

	return data;
}
