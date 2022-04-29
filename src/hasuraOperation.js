const fetch = require("node-fetch")

//Hasura operations
const USERCODE_OPERATIONS = `
query UserCodeValidator($user_code: String_comparison_exp!) {
    kw_rejected_users(where: {user_code: $user_code}) {
      user_code
    }
  }
`;


// execute the parent operation in Hasura
const execute = async (variables, hasura_operation, bearerToken) => {
    const fetchOpts = {
        method: 'POST',
        body: JSON.stringify({
            query: hasura_operation,
            variables
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    }

    if (bearerToken) {
        fetchOpts.headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + bearerToken
        }
    }

    const fetchResponse = await fetch(
        "https://sandbox-inl.hasura.app/v1/graphql",
        fetchOpts
    );

    const data = await fetchResponse.json();
    console.log('DEBUG: ', data);
    return data;
};

module.exports = {
    USERCODE_OPERATIONS,
    execute
}
