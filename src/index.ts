#!/usr/bin/env node

import inquirer from 'inquirer';
import path from 'path';
import { getProjects } from './getProjects';
import { getProjectVersion } from './getProjectVersion';
import { getToken } from './getToken';
import { saveData } from './saveData';

async function main() {
	//INTRO
	console.log('Welcome to the ACP CLI');

	const loginDetailsAnswers: { UPI: string; password: string } =
		await inquirer.prompt([
			{ name: 'UPI', type: 'input' },
			{ name: 'password', type: 'password' },
		]);

	const username = loginDetailsAnswers.UPI + '@aucklanduni.ac.nz';
	const password = loginDetailsAnswers.password;

	const token = await getToken(username, password);

	const basePath = './ACP';

	// console.log('Got a token', token);

	if (!token) {
		console.log('There was a login failure, sorry :(');
		return;
	}

	const projects = await getProjects(token);

	if (!projects || projects.length === 0) {
		console.log('No projects found, sorry :(');
		return;
	}

	console.log('Found ' + projects.length + ' projects');

	const selectedProjectAnswers = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'projects',
			message: 'Which projects would you like to download',
			choices: projects.map((p) => ({
				name: p.name,
				value: p.id,
			})),
		},
	]);

	const projectsToDownload = (selectedProjectAnswers.projects as number[]).map(
		(projectId: number) => projects.find((project) => project.id === projectId)
	);

	projectsToDownload.forEach((project) => {
		project?.versions.forEach((version) => {
			getProjectVersion(token, project.id, version.version_number).then(
				(data) => {
					if (data != null) {
						saveData(data, path.join(basePath, project.location, project.name));
					}
				}
			);
		});
	});

	console.log('Done!');
}

main();
