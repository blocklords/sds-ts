import * as fs from 'fs';
import axios from 'axios';

/**
 * Load the local JSON file as a JS object.
 * @param path String
 * @requires JSON file should be in the same machine and in UTF-8 format.
 * @returns Object or FALSE
 */
export const loadLocalSync = (path: string) => {
    let rawdata = '';
    try {
        rawdata = fs.readFileSync(path, 'utf-8');
    } catch {
        console.log({
            error_path: 'src/utils/json.loadLocalSync',
            line: 'reading_file',
            message: `failed to load the file\non path '${path}'`
        });
        return false;
    }
    
    try {
    return JSON.parse(rawdata);
    } catch {
        console.log({
            error_path: 'src/utils/json..loadLocalSync',
            line: 'parsing',
            message: `could not convert into the file\non path '${path}'`
        });
        return false;
    }
};

/**
 * Load the JSON file as a JS object from remote machine
 * @param url The remote path of the JSON file
 * @param noError The error is not shown if its set to true.
 * @returns Object or FALSE
 */
export const loadRemote = async (url: string, noError = false) => {
    try {
        let res = await axios({
            method: 'get',
            url: url,
            responseType: 'json'
        });
        if (typeof(res.data) !== 'object') {
            throw `Invalid JSON was fetched from '${url}'. Please make sure that it's in the JSON format`;
        }
        return res.data;
    } 
    catch (error) {
        if (axios.isAxiosError(error)) {
            if (!noError) {
                console.log({
                    error_path: 'src/utils/json.loadRemote',
                    line: 'axios',
                    message: `could not fetch remote data\nfrom path '${url}'\nRemote handler error: ${error.message}`
                }) 
            }
            return false;
        } else {
            console.log({
                error_path: 'src/utils/json.loadRemote',
                line: 'unknown',
                message: `could not fetch remote data\nfrom path '${url}'\nRemote handler error: ${error}`
            })
            return false;
        }
      }
}