import axios from 'axios';

export async function getToken(
	userName: string,
	password: string
): Promise<string | null> {
	const credentials = {
		username: userName,
		password: password,
		client: 'webide',
	};

	const token: string | null = await axios
		.post('https://acp.foe.auckland.ac.nz/API/tokenget/', credentials)
		.then((res) => {
			if (res.status === 200) {
				return res.data.token as string;
			} else return null;
		})
		.catch((error) => {
			return null;
		});

	return token;
}
