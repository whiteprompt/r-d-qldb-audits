const JWT = require('jsonwebtoken');
const JwksRsa = require('jwks-rsa');
const {REGION} = process.env;
const cognitoDomain = `https://cognito-idp.${REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}`;

const getCognitoPublicKey = (header, callback) => {
  const jwksUri = `${cognitoDomain}/.well-known/jwks.json`;
  const client = JwksRsa({jwksUri});
  client.getSigningKey(header.kid, (error, key) => {
    const signingKey = key && (
      ('publicKey' in key && key.publicKey) || ('rsaPublicKey' in key && key.rsaPublicKey)
    ) || '';
    callback(error, signingKey);
  });
};

async function isTokenValid (token) {
  if (!token) {
    return {error: 'No token provided'};
  }

  if (process.env.NODE_ENV === 'development') {
    const authTime = Date.now()/1000;
    return {
      iss: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxx",
      sub: "localhost-user",
      email_verified: true,
      phone_number_verified: true,
      'cognito:username': "localhost-user",
      aud: "web-client-id",
      event_id: "12345678-1234-1234-1234-123456789012",
      token_use: "id",
      auth_time: authTime,
      phone_number: "+1123123456",
      exp: authTime+3600,
      iat: authTime,
      email: "localhost-user@localhost"
    }
  }

  return new Promise((resolve, reject) => {
    JWT.verify(
      token,
      getCognitoPublicKey,
      {
        issuer: cognitoDomain,
        algorithms: ['RS256']
      },
      (error, decoded) => {
        if (error) {
          reject(error.message);
        }
        if (decoded) {
          resolve(decoded);
        }
      }
    );
  });
}

const generatePolicy = (principalId, effect, resource, context) => {
  const authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {};
    const lambdaStatement = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];

    lambdaStatement.Action = 'execute-api:Invoke';
    lambdaStatement.Effect = effect;
    lambdaStatement.Resource = resource;

    policyDocument.Statement[0] = lambdaStatement;
    authResponse.policyDocument = policyDocument;
  }

  if (context) {
    authResponse.context = context;
  }

  return authResponse;
};

module.exports = {
  authorizer (event, context, callback) {
    try {
      const authorizationHeader = event.headers.Authorization;
      if (typeof authorizationHeader === 'undefined') {
        callback('Unauthorized');
      }

      const authorizationHeaderSplit = authorizationHeader.split('Bearer');
      if (authorizationHeaderSplit.length !== 2) {
        callback('Unauthorized');
      }

      const token = authorizationHeaderSplit[1].trim();

      isTokenValid(token).then(
        (decoded) => {
          try {
            if (decoded['cognito:groups'].includes('admins')) {
              callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
            } else {
              callback('Unauthorized')
            }
          } catch (e) {
            console.log(e);
            callback('Unauthorized');
          }
        },
        (error) => {
          console.log('invalid token', error);
          callback('Unauthorized');
        }
      );
    } catch (e) {
      console.log(e);
      callback('Unauthorized');
    }
  }
};
