#!/usr/bin/env node

import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';

import { getProjects } from './getProjects';
import { getProjectVersion } from './getProjectVersion';
import { getToken } from './getToken';
import { saveData } from './saveData';

async function main() {
	//INTRO
	console.log('Welcome to the ACP CLI');

	var upi: string | null = null;
	var password: string | null = null;

	if (fs.existsSync('./credentials.json')) {
		const credentials = JSON.parse(
			fs.readFileSync('./credentials.json', 'utf8').toString()
		);

		upi = credentials.UPI ?? null;
		password = credentials.password ?? null;
	} else {
		const loginDetailsAnswers: {
			UPI: string;
			password: string;
			remember: boolean;
		} = await inquirer.prompt([
			{ name: 'UPI', type: 'input' },
			{ name: 'password', type: 'password' },
			{ name: 'remember', type: 'confirm', message: 'Remember credentials?' },
		]);

		if (loginDetailsAnswers.remember) {
			fs.writeFileSync(
				'./credentials.json',
				JSON.stringify({
					UPI: loginDetailsAnswers.UPI,
					password: loginDetailsAnswers.password,
				})
			);
		}

		upi = loginDetailsAnswers.UPI;
		password = loginDetailsAnswers.password;
	}

	if (!upi || !password) {
		console.log('Invalid credentials');
		return;
	}
	const username = upi + '@aucklanduni.ac.nz';

	const token = await getToken(username, password);

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
		{
			type: 'input',
			name: 'savedir',
			message: 'Where would you like to save the project(s)?',
			default: './ACP',
		},
	]);

	const basePath: string = selectedProjectAnswers.savedir as string;
	const projectsToDownload = (selectedProjectAnswers.projects as number[]).map(
		(projectId: number) => projects.find((project) => project.id === projectId)
	);

	projectsToDownload.forEach((project) => {
		project?.versions.forEach((version) => {
			getProjectVersion(token, project.id, version.version_number).then(
				(data) => {
					if (data != null) {
						saveData(
							data,
							path.join(
								basePath,
								project.location,
								project.name,
								'version' + version.version_number.toString()
							)
						);
					}
				}
			);
		});
	});

	console.log('Done!');
}

main();
