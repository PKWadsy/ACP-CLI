import axios from 'axios';
import { Project } from './models';

export async function getProjects(token: string): Promise<Project[] | null> {
	const data = await axios
		.get(
			'https://acp.foe.auckland.ac.nz/API/projects/?client=webide&hidden=false',
			{
				headers: {
					Authorization: `Token ${token}`,
				},
			}
		)
		.then((res) => {
			if (res.status === 200) {
				return res.data as Project[];
			} else return null;
		})
		.catch((err) => {
			return null;
		});

	return data;
}
