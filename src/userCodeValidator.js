const { USERCODE_OPERATIONS, execute } = require("./hasuraOperation")
const { generateJWT } = require("./jwtGenerator")

const userCodeValidator = async (req, res) => {
    const { user_code } = req.body.input;
    const values = Object.values(req.body.session_variables)

    // create payload
    const payload = {
        "sub": "1",
        "name": "user",
        "iat": (new Date().getTime()) / 1000,
        "exp": ((new Date().getTime()) / 1000) + 900,
        "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": [values[0]],
            "x-hasura-default-role": values[0],
            "x-hasura-user-id": values[2],
            "x-hasura-org-id": values[3],
            "x-hasura-custom": values[1]
        }
    };

    const token = generateJWT(payload)

    // execute the Hasura operation
    const { data, errors } = await execute({ user_code }, USERCODE_OPERATIONS, token);

    // if Hasura operation errors, then throw error
    if (errors) {
        return res.status(400).json(errors[0])
    }

    // success
    return res.json({
        user_code: data.kw_rejected_users
    })
}

module.exports = { userCodeValidator }
