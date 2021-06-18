# QLDB Audits

Immutable audit logs powered by QLDB & EventBridge.
Example code for the [Immutable audit logs with Amazon Quantum Ledger Database](https://medium.com/white-prompt-blog/immutable-audit-logs-with-amazon-quantum-ledger-database-ac8868f9e236).

## Overview

This repo outlines a serverless microservice that takes care of generating 
immutable records in QLDB based on events sent on an EventBridge custom event
bus.

![Interaction diagram](https://miro.medium.com/max/1400/0*L_3UF-Vd-l7lelVT)

### Details

The event message should have an `entity` and an `attributes` properties in the 
`detail` property of the message. Any event with the `source` and `detail-type` 
matched by the pattern specified for the `auditLogWriter` function triggers 
will generate a new audit log record.

The `entity` attribute needs to match the name of any of the tables created in 
the ledger. 

## Development Environment Setup

### Pre Requisites

This project uses [Serverless Framework](https://serverless.com/).
The definition of the resources used by the service are defined in the
`serverless.yml` file.

* A working AWS Account
* Node v12+
* NPM v6+
* `npm install -g serverless`
* [Follow the instructions of the Serverless Docs](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
  to configure your AWS credentials with the serverless framework.

### Installation

* `git clone` this repo
* `cd` into project's root
* `npm install` dependencies
* Setup the environmental file.
    * Duplicate `.env.example` and rename it `.env`
    * This file contains the values for the environment variables required by the application
      * `ACCOUNT_ID` The AWS account 12-digit identifier
      * `AWS_COGNITO_USER_POOL_ID` Your cognito user pool id
      * `DEFAULT_EVENT_BUS_NAME` the name of the default event bridge bus used by the application
        * Example value: `my-custom-event-bus`
      * `ENVIRONMENT_CODE` the environment code for the application, also used to set the stage of the lambdas 
        * Example value: `dev`
      * `NODE_ENV` node's environment (should be `production` in the live app)
        * Example value: `test`
      * `PROFILE` the name of the local AWS credentials profile, used to deploy the lambda app
        * Example value: `my_aws_profile`
      * `REGION` the AWS region in which the serverless application will be deployed 
        * Example value: `us-east-2`
