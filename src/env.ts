/**
 * @description Validates the environment variables.
 * In case of missing any value, throws an error.
 */
export const verify_env = function () {
    if (!process.env.SDS_ORGANIZATION_NAME) {
        throw 'Missing SDS_ORGANIZATION_NAME environment variable';
    }
    if (!process.env.SDS_PROJECT_NAME) {
        throw 'Missing SDS_PROJECT_NAME environment variable';
    }

    let host = process.env.SDS_GATEWAY_HOST!
    if (!host) {
        throw `Missing 'SDS_GATEWAY_HOST' environment variable`;
    }
}