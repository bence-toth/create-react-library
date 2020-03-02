const execa = require('execa');
const validateNpmPackageName = require('validate-npm-package-name');

const capitalizeString = string => {
	const firstLetter = `${string}`.charAt(0).toUpperCase();
	const rest = `${string}`.slice(1);
	return `${firstLetter}${rest}`;
};

const validatePackageName = packageName => {
	const {errors} = validateNpmPackageName(packageName);
	return (
		errors ?
			errors.map(capitalizeString) :
			undefined
	);
};

const validateScopeName = packageName => {
	const {errors: npmErrors} = validateNpmPackageName(
		packageName.slice(1)
	);
	const updatedNpmErrors = npmErrors && npmErrors.map(error => {
		if (error === 'name length must be greater than zero') {
			return 'name length must be greater than one';
		}

		return error;
	});
	const errors = [
		...(
			(packageName.length === 0) ?
				['name length must be greater than zero'] :
				[]
		),
		...(
			(packageName && (packageName.charAt(0) !== '@')) ?
				(['name must start with an @']) :
				[]
		),
		...(
			(packageName && packageName.includes('/')) ?
				(['name must not contain a /']) :
				[]
		),
		...(updatedNpmErrors || [])
	];
	return (
		(errors.length > 0) ?
			errors.map(capitalizeString) :
			undefined
	);
};

const getLoggedInNpmUsername = async () => {
	const {stdout} = await execa('npm', ['whoami']);
	return stdout;
};

module.exports = {
	validatePackageName,
	validateScopeName,
	getLoggedInNpmUsername
};
