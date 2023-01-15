# Farcaster auth tokens

Is a set of utility scripts for the farcaster api around generating and revoking auth tokens

# Setup

1. Clone this repo
2. Set up your .env file using .env.template with your seed phrase from your farcaster wallet (12 or 24 words)
3. Make sure you have node 18 installed
4. Run `npm install`
5. Now you can run any of the scripts below

# Scripts

## Revoke a single auth token

Replace "MK-....==" with the auth token you want to revoke

`npm run revoke MK-rDdfdstxfsdfFf0DhMwCmopf+NPYfw==`

## Revoke all auth tokens

This will revoke all your farcaster auth tokens with expiresAt less than 109999999999999
This is likely all your tokens, and will likely break any third party apps you have
signed in with your farcaster wallet with.

`npm run revoke-all`

## Create long lived auth token

This token will live until it is revoked or until it is not one of the 50 tokens with the latest expiry date

`npm run create-authtoken`

## Create an auth token that will be valid for 10 minutes

`npm run create-ten-minute-token`

# Errors

Errors are unhandled, and will throw, exiting the process. The error will be logged to STDOUT
