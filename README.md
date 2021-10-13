# LexCafeLab

Integrating Amazon Lex and Amazon Lambda enables us to add custom user input validations. This enables us to build-in business rules that meet any use case scenario. Additionally, we use Amazon lambda upon fulfillment. In this use case, we will save the coffee order to a DynamoDB table upon fulfillment and set up a data stream to save user favorites in a separate table. This enables us to provide a unique user experience by suggesting the user’s previous order if no slots are provided. This bot will start as a single intent bot and expand to cover many intents. We will be using the serverless framework to provision our resources.  

testing the application: 
  - npm run test

Deploying the application:
  - serverless deploy
  
Logging into AWS console:
  - aws-azure-login --mode=gui


