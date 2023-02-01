import inquirer from "inquirer";

const ask = (message: string) => {
    const questions = [
        {
            name: "STRING",
            type: "input",
            message: message
        }
    ];
    return inquirer.prompt(questions);
};

const askOption = (options: string[], message: string) => {
    const questions = [
        {
            name: "OPTION",
            type: "list",
            message: message,
            choices: options
        }
    ];
    return inquirer.prompt(questions);
};

/** Prompts user to write the string.
 * @param message is the description of the prompt.
 * @param default_value [optional] if user didn't write in the prompt then this value is returned.
 * @return string or default value.
 * @throws an exception if user didn't wrote the input and no default value is given.
*/
export const promptString = async(message: string, default_value: string|undefined): Promise<string> => {
    const { STRING } = await ask(message);
    if (STRING.length > 0) {
      return STRING;
    }

    if (default_value === undefined) {
        throw `No default value given, no user inputted a data`;
    }

    return default_value;
}


/** Prompts user to choose an option from the given list of elements.
 * @param message is the description of the prompt.
 * @param options list of options that user can choose.
 * @param default_value [optional] if user didn't pick in the prompt, then this value is returned.
 * @return string or default value.
 * @throws an exception if user didn't wrote the input and no default value is given.
 */
export const promptStringOption = async (message: string, options: string[], default_value: string|undefined): Promise<string> => {
    const { OPTION } = await askOption(options, message);
    if (OPTION.length == 0) {
        if (default_value == undefined) {
            throw `No option was selected`;
        }

        return default_value;
    }

    for (var i in options) {
        if (options[i] == OPTION) {
            return options[i];
        }
    }

    throw `User didn't pick any element from the list of options`;
}
